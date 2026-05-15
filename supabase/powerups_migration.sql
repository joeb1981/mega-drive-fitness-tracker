-- Run this once in Supabase SQL Editor to add persistent power-up support
-- without deleting or changing existing daily_activity rows.

alter table public.daily_activity
add column if not exists powerup_id text;

alter table public.daily_activity
add column if not exists calorie_bonus integer not null default 0 check (calorie_bonus >= 0);

alter table public.daily_activity
add column if not exists cheat_day boolean not null default false;

create unique index if not exists daily_activity_one_powerup_per_user
on public.daily_activity (user_id, powerup_id)
where powerup_id is not null;
