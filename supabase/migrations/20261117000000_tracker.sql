-- Weekly progress tracker schema.
-- Run once in the Supabase SQL editor (or `supabase db push`).

-- ── Tables ──────────────────────────────────────────────────────────────

create table public.categories (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name          text not null,
  type          text not null check (type in ('hours', 'count')),
  weekly_target numeric not null check (weekly_target >= 0),
  sort_order    int not null default 0,
  is_active     bool not null default true,
  -- Lets child tables reference (id, user_id) so an entry can never point
  -- at another user's category.
  unique (id, user_id)
);

create table public.time_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id uuid not null,
  started_at  timestamptz not null,
  ended_at    timestamptz null,
  note        text,
  foreign key (category_id, user_id) references public.categories (id, user_id) on delete cascade,
  check (ended_at is null or ended_at > started_at)
);

create table public.count_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id uuid not null,
  logged_at   timestamptz not null default now(),
  note        text,
  foreign key (category_id, user_id) references public.categories (id, user_id) on delete cascade
);

create table public.daily_checks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  check_date date not null,
  check_key  text not null check (check_key in ('email', 'worst_day_min')),
  done       bool not null default false,
  unique (user_id, check_date, check_key)
);

-- ── Indexes ─────────────────────────────────────────────────────────────

-- Only one running timer per user.
create unique index time_entries_one_running_per_user
  on public.time_entries (user_id)
  where ended_at is null;

create index time_entries_user_started_idx on public.time_entries (user_id, started_at desc);
create index count_logs_user_logged_idx on public.count_logs (user_id, logged_at desc);
create index categories_user_sort_idx on public.categories (user_id, sort_order);

-- ── Row Level Security ──────────────────────────────────────────────────
-- Only the authenticated owner can see or change their rows.
-- The anon role gets no policies at all, so it sees nothing.

alter table public.categories   enable row level security;
alter table public.time_entries enable row level security;
alter table public.count_logs   enable row level security;
alter table public.daily_checks enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['categories', 'time_entries', 'count_logs', 'daily_checks'] loop
    execute format(
      'create policy "owner can select" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
    execute format(
      'create policy "owner can insert" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
    execute format(
      'create policy "owner can update" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
    execute format(
      'create policy "owner can delete" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
  end loop;
end
$$;

-- Defence in depth: the anon role has no business with these tables.
revoke all on public.categories, public.time_entries, public.count_logs, public.daily_checks from anon;
