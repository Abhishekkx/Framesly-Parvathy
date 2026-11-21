-- Table privileges for the API roles.
--
-- Newer Supabase projects no longer grant table access to `anon` and
-- `authenticated` by default, so every table the app uses is granted here
-- explicitly. Grants only decide whether a role may use a table at all;
-- row-level security (previous migration) still decides which rows it sees.
--
-- `anon` (signed-out visitors) gets nothing: Week 1 has no public data.
-- Client gallery access arrives in Week 2 through a server route.

-- Signed-in photographers
grant select, update on public.profiles to authenticated;
grant select, update, delete on public.studios to authenticated;        -- insert only via create_studio()
grant select on public.studio_members to authenticated;                  -- insert only via create_studio()
grant select, insert, update, delete on public.galleries to authenticated;
grant select, insert, update, delete on public.sections to authenticated;
grant select, insert, update, delete on public.photos to authenticated;
grant select on public.renditions to authenticated;                      -- written by the processing job
grant select on public.gallery_overview to authenticated;

-- Helpers called inside RLS policies and triggers
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.gallery_studio_id(uuid) to authenticated;
grant execute on function public.is_reserved_slug(text) to authenticated;

-- Server-side jobs (FR-07 processing) use the service role, which bypasses RLS
-- but still needs table privileges.
grant all on public.profiles, public.studios, public.studio_members, public.galleries,
  public.sections, public.photos, public.renditions to service_role;
grant select on public.gallery_overview to service_role;
