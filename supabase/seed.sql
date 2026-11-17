-- Seed the tracker categories for your user.
-- Run ONCE in the Supabase SQL editor after creating your user.
-- Replace the email below with the one you signed up with.

do $$
declare
  owner_email text := 'you@example.com';  -- <-- change me
  owner_id uuid;
begin
  select id into owner_id from auth.users where email = owner_email;
  if owner_id is null then
    raise exception 'No auth user with email %. Create the user first (see TRACKER_SETUP.md).', owner_email;
  end if;

  if exists (select 1 from public.categories where user_id = owner_id) then
    raise notice 'Categories already exist for %, skipping.', owner_email;
    return;
  end if;

  insert into public.categories (user_id, name, type, weekly_target, sort_order) values
    (owner_id, 'Job applications',     'count', 20, 1),
    (owner_id, 'Gym / Run',            'count',  4, 2),
    (owner_id, 'Certification course', 'hours',  5, 3),
    (owner_id, 'Portfolio project',    'hours',  5, 4),
    (owner_id, 'Practice tasks',       'hours',  3, 5),
    (owner_id, 'Investment check',     'count',  1, 6);
end
$$;
