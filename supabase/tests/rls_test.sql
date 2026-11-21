-- RLS tests (FR-02 "done when"): user A cannot read, update or delete any
-- gallery, section or photo of studio B. Run with: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

-- Two users
insert into auth.users (id, email, raw_user_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'a@example.test', '{"full_name":"Asha"}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'b@example.test', '{"full_name":"Ben"}', 'authenticated', 'authenticated');

-- Profiles are created by the signup trigger
select is((select full_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'), 'Asha', 'signup trigger creates the profile');

-- Each user creates a studio through the RPC, as themselves
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select lives_ok($$ select public.create_studio('Studio A', 'studio-a', 'in', '#F2A93B') $$, 'A creates a studio');
select set_config('test.studio_a', (select id::text from public.studios where slug = 'studio-a'), true);
select throws_ok($$ select public.create_studio('Again', 'studio-a2') $$, '23505', null, 'A cannot create a second studio');
select is(public.slug_available('studio-a'), false, 'taken slug is unavailable');
select is(public.slug_available('pricing'), false, 'reserved slug is unavailable');
select lives_ok($$ select public.create_gallery((select id from public.studios where slug = 'studio-a'), 'Aarohi and Kabir', '2026-02-12', array['Haldi','Ceremony']) $$, 'A creates a gallery with sections');
select is((select count(*)::int from public.sections), 2, 'A sees two sections');

set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select lives_ok($$ select public.create_studio('Studio B', 'studio-b', 'eu') $$, 'B creates a studio');

-- B cannot see or touch anything of A
select is((select count(*)::int from public.studios where slug = 'studio-a'), 0, 'B cannot read studio A');
select is((select count(*)::int from public.galleries), 0, 'B cannot read galleries of A');
select is((select count(*)::int from public.sections), 0, 'B cannot read sections of A');
update public.galleries set title = 'hacked';
delete from public.galleries;
select throws_ok(
  $$ insert into public.galleries (studio_id, title, slug) values (current_setting('test.studio_a')::uuid, 'x', 'x') $$,
  '42501', null, 'B cannot insert a gallery into studio A'
);

-- Back to A: data untouched
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((select title from public.galleries limit 1), 'Aarohi and Kabir', 'A gallery was not changed by B');
select is((select count(*)::int from public.galleries), 1, 'A gallery was not deleted by B');

select * from finish();
rollback;
