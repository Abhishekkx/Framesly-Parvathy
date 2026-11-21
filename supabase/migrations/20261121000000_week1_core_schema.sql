-- =============================================================================
-- Framesly · Week 1 core schema (FR-02)
--
-- Every row belongs to a studio. RLS lets a signed-in user touch only rows of
-- studios they are a member of. Public client-gallery access (Week 2) goes
-- through a server route, not through these policies.
--
-- Differences from the ticket draft, on purpose:
--   * profiles table: the photographer's own name and avatar, created by a
--     trigger when they sign up.
--   * Studio creation goes through create_studio() (security definer, one
--     transaction) instead of a service-role server action. Same atomicity,
--     no service-role key needed in the web app for onboarding.
--   * Studio logos live in Supabase Storage (bucket studio-assets, path
--     studios/{studioId}/logo/...). Wedding photos stay on Cloudflare R2.
--   * Studio slugs reject reserved words (they would clash with site pages
--     at /{studio}/{gallery}), enforced in the database, not only the form.
--   * RLS helpers wrap auth.uid() in a scalar subquery for performance.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Keep in sync with apps/web/src/lib/reserved-slugs.ts
create or replace function public.is_reserved_slug(p_slug text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_slug = any (array[
    'app','api','auth','login','signup','logout','pricing','video','sample','legal',
    'opengraph-image','twitter-image','robots.txt','sitemap.xml','favicon.ico','_next',
    'about','blog','help','support','contact','careers','press','docs','status',
    'account','settings','admin','dashboard','onboarding','studio','studios','gallery',
    'galleries','store','shop','checkout','billing','features','compare','terms',
    'privacy','www','framesly','reset-password','forgot-password'
  ]);
$$;

-- ---------------------------------------------------------------------------
-- Profiles: one per auth user
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  avatar_path text,
  plan_interest text check (plan_interest in ('solo', 'studio', 'collective')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile when someone signs up (email or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan text := new.raw_user_meta_data ->> 'plan';
begin
  insert into public.profiles (id, full_name, plan_interest)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 120),
    case when v_plan in ('solo', 'studio', 'collective') then v_plan end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Studios and membership
-- ---------------------------------------------------------------------------

create table public.studios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique
    check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$' and not public.is_reserved_slug(slug)),
  logo_path text,
  brand_color text not null default '#F2A93B' check (brand_color ~ '^#[0-9A-Fa-f]{6}$'),
  region text not null default 'us' check (region in ('us', 'eu', 'in')),
  plan text not null default 'trial',
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger studios_updated_at before update on public.studios
  for each row execute function public.set_updated_at();

create table public.studio_members (
  studio_id uuid not null references public.studios (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'shooter', 'editor')),
  created_at timestamptz not null default now(),
  primary key (studio_id, user_id)
);
create index studio_members_user_idx on public.studio_members (user_id);

-- Membership check used by every policy.
create or replace function public.is_member(p_studio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.studio_members m
    where m.studio_id = p_studio_id and m.user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Galleries, sections, photos, renditions
-- ---------------------------------------------------------------------------

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  slug text not null check (slug ~ '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'),
  event_date date,
  status text not null default 'draft' check (status in ('draft', 'culling', 'delivered', 'archived')),
  cover_photo_id uuid,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (studio_id, slug)
);
create index galleries_studio_created_idx on public.galleries (studio_id, created_at desc);

create trigger galleries_updated_at before update on public.galleries
  for each row execute function public.set_updated_at();

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index sections_gallery_idx on public.sections (gallery_id, sort_order);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries (id) on delete cascade,
  section_id uuid references public.sections (id) on delete set null,
  original_name text not null,
  r2_key text not null unique,
  bytes bigint not null check (bytes > 0),
  mime text not null,
  width int,
  height int,
  taken_at timestamptz,
  camera text,
  status text not null default 'uploading'
    check (status in ('uploading', 'uploaded', 'processing', 'ready', 'failed')),
  error text,
  created_at timestamptz not null default now()
);
create index photos_gallery_taken_idx on public.photos (gallery_id, taken_at);
create index photos_gallery_status_idx on public.photos (gallery_id, status);

alter table public.galleries
  add constraint galleries_cover_photo_fk
  foreign key (cover_photo_id) references public.photos (id) on delete set null;

create table public.renditions (
  photo_id uuid not null references public.photos (id) on delete cascade,
  kind text not null check (kind in ('thumb', 'web', 'full')),
  r2_key text not null,
  width int not null,
  height int not null,
  bytes bigint not null,
  primary key (photo_id, kind)
);

-- Which studio a gallery belongs to (used by section/photo policies).
create or replace function public.gallery_studio_id(p_gallery_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select g.studio_id from public.galleries g where g.id = p_gallery_id;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.studios enable row level security;
alter table public.studio_members enable row level security;
alter table public.galleries enable row level security;
alter table public.sections enable row level security;
alter table public.photos enable row level security;
alter table public.renditions enable row level security;

-- Profiles: you see and edit only your own.
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Studios: members read; the owner edits and deletes. Creation via create_studio().
create policy studios_select_member on public.studios
  for select to authenticated using (public.is_member(id));
create policy studios_update_owner on public.studios
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy studios_delete_owner on public.studios
  for delete to authenticated using (owner_id = (select auth.uid()));

-- Membership: you can see your own rows and your studio's roster. Changes via functions only.
create policy members_select on public.studio_members
  for select to authenticated using (user_id = (select auth.uid()) or public.is_member(studio_id));

-- Galleries
create policy galleries_all_member on public.galleries
  for all to authenticated
  using (public.is_member(studio_id))
  with check (public.is_member(studio_id));

-- Sections and photos follow their gallery's studio.
create policy sections_all_member on public.sections
  for all to authenticated
  using (public.is_member(public.gallery_studio_id(gallery_id)))
  with check (public.is_member(public.gallery_studio_id(gallery_id)));

create policy photos_all_member on public.photos
  for all to authenticated
  using (public.is_member(public.gallery_studio_id(gallery_id)))
  with check (public.is_member(public.gallery_studio_id(gallery_id)));

-- Renditions: written only by the processing job (service role); members read.
create policy renditions_select_member on public.renditions
  for select to authenticated
  using (
    public.is_member((
      select g.studio_id from public.photos p
      join public.galleries g on g.id = p.gallery_id
      where p.id = photo_id
    ))
  );

-- ---------------------------------------------------------------------------
-- RPCs used by the app
-- ---------------------------------------------------------------------------

-- Is this studio address free? (RLS hides other studios, so this checks for the app.)
create or replace function public.slug_available(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$'
     and not public.is_reserved_slug(p_slug)
     and not exists (select 1 from public.studios s where s.slug = p_slug);
$$;

-- Onboarding: create the studio and the owner's membership in one transaction.
create or replace function public.create_studio(
  p_name text,
  p_slug text,
  p_region text default 'us',
  p_brand_color text default '#F2A93B'
)
returns public.studios
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_studio public.studios;
begin
  if v_uid is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if exists (select 1 from public.studio_members m where m.user_id = v_uid) then
    raise exception 'You already have a studio' using errcode = '23505';
  end if;

  insert into public.studios (owner_id, name, slug, region, brand_color)
  values (v_uid, btrim(p_name), lower(btrim(p_slug)), p_region, upper(p_brand_color))
  returning * into v_studio;

  insert into public.studio_members (studio_id, user_id, role)
  values (v_studio.id, v_uid, 'owner');

  return v_studio;
end;
$$;

-- New gallery with optional event sections, in one transaction.
-- Runs as the caller, so RLS still decides whether they may write.
create or replace function public.create_gallery(
  p_studio_id uuid,
  p_title text,
  p_event_date date default null,
  p_sections text[] default '{}'
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_base text;
  v_slug text;
  v_n int := 1;
  v_id uuid;
  v_name text;
  v_i int := 0;
begin
  v_base := trim(both '-' from regexp_replace(lower(btrim(p_title)), '[^a-z0-9]+', '-', 'g'));
  if v_base = '' then v_base := 'gallery'; end if;
  v_base := left(v_base, 60);
  v_slug := v_base;
  while exists (select 1 from public.galleries g where g.studio_id = p_studio_id and g.slug = v_slug) loop
    v_n := v_n + 1;
    v_slug := v_base || '-' || v_n;
  end loop;

  insert into public.galleries (studio_id, title, slug, event_date, created_by)
  values (p_studio_id, btrim(p_title), v_slug, p_event_date, (select auth.uid()))
  returning id into v_id;

  foreach v_name in array coalesce(p_sections, '{}') loop
    if btrim(v_name) <> '' then
      insert into public.sections (gallery_id, name, sort_order) values (v_id, btrim(v_name), v_i);
      v_i := v_i + 1;
    end if;
  end loop;

  return v_id;
end;
$$;

-- Gallery list with photo counts in one round trip.
create or replace view public.gallery_overview
with (security_invoker = true) as
select
  g.id, g.studio_id, g.title, g.slug, g.event_date, g.status, g.cover_photo_id, g.created_at,
  count(p.id)::int as photo_count,
  count(p.id) filter (where p.status = 'ready')::int as ready_count,
  count(p.id) filter (where p.status = 'failed')::int as failed_count,
  (select count(*)::int from public.sections s where s.gallery_id = g.id) as section_count
from public.galleries g
left join public.photos p on p.gallery_id = g.id
group by g.id;

-- Function permissions: signed-in users only.
revoke execute on function public.create_studio(text, text, text, text) from public, anon;
revoke execute on function public.create_gallery(uuid, text, date, text[]) from public, anon;
revoke execute on function public.slug_available(text) from public, anon;
grant execute on function public.create_studio(text, text, text, text) to authenticated;
grant execute on function public.create_gallery(uuid, text, date, text[]) to authenticated;
grant execute on function public.slug_available(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: studio logos and avatars (public read, members write)
-- Path layout: studios/{studioId}/logo/{file}  ·  users/{userId}/avatar/{file}
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'studio-assets', 'studio-assets', true, 2097152,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "studio assets: members upload logos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'studio-assets'
    and (storage.foldername(name))[1] = 'studios'
    and public.is_member(((storage.foldername(name))[2])::uuid)
  );
create policy "studio assets: members replace logos"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'studio-assets'
    and (storage.foldername(name))[1] = 'studios'
    and public.is_member(((storage.foldername(name))[2])::uuid)
  );
create policy "studio assets: members delete logos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'studio-assets'
    and (storage.foldername(name))[1] = 'studios'
    and public.is_member(((storage.foldername(name))[2])::uuid)
  );

create policy "studio assets: users manage own avatar"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'studio-assets'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'studio-assets'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
