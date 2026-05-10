-- Run this inside Supabase SQL Editor after creating your project.
-- It creates one activity table and locks it to jrbrimble@aol.com via RLS.

create table if not exists public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  activity_date date not null,
  steps integer not null check (steps >= 0),
  calories integer not null check (calories >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

alter table public.daily_activity enable row level security;

drop policy if exists "Only allowed user can read activity" on public.daily_activity;
create policy "Only allowed user can read activity"
on public.daily_activity
for select
to authenticated
using (
  auth.email() = 'jrbrimble@aol.com'
  and auth.uid() = user_id
);

drop policy if exists "Only allowed user can insert activity" on public.daily_activity;
create policy "Only allowed user can insert activity"
on public.daily_activity
for insert
to authenticated
with check (
  auth.email() = 'jrbrimble@aol.com'
  and auth.uid() = user_id
);

drop policy if exists "Only allowed user can update activity" on public.daily_activity;
create policy "Only allowed user can update activity"
on public.daily_activity
for update
to authenticated
using (
  auth.email() = 'jrbrimble@aol.com'
  and auth.uid() = user_id
)
with check (
  auth.email() = 'jrbrimble@aol.com'
  and auth.uid() = user_id
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists daily_activity_set_updated_at on public.daily_activity;
create trigger daily_activity_set_updated_at
before update on public.daily_activity
for each row
execute function public.set_updated_at();
