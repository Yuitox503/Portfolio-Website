-- Weekly reviews: one reflection per week (week_start = the Monday, in the
-- tracker timezone). Run after 20261117000000_tracker.sql.

create table public.weekly_reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  week_start  date not null check (extract(isodow from week_start) = 1),
  rating      smallint check (rating between 1 and 5),
  went_well   text,
  to_improve  text,
  next_focus  text,
  updated_at  timestamptz not null default now(),
  unique (user_id, week_start)
);

alter table public.weekly_reviews enable row level security;

create policy "owner can select" on public.weekly_reviews for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "owner can insert" on public.weekly_reviews for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "owner can update" on public.weekly_reviews for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "owner can delete" on public.weekly_reviews for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.weekly_reviews from anon;
