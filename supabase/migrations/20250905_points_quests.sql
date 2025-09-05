-- Points ledger, quests, progress, redemptions, and KPIs
-- Idempotent: uses IF NOT EXISTS guards

create extension if not exists pgcrypto with schema public;

-- Users -> profiles already exists in previous migrations

create table if not exists public.points_ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_ref text,
  delta_points int not null,
  created_at timestamptz default now(),
  unique(user_id, event_type, event_ref)
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  description text,
  points int not null default 50,
  period text not null default 'weekly',
  is_active boolean default true
);

create table if not exists public.quest_progress (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_code text not null references public.quests(code),
  progress int not null default 0,
  required int not null default 1,
  updated_at timestamptz default now(),
  unique(user_id, quest_code)
);

create table if not exists public.redemptions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_code text not null,
  cost_points int not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Optional newsletter subscribers (double opt-in handled app-side)
create table if not exists public.newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  confirmed boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.points_ledger enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='points_ledger' and policyname='read own points'
  ) then
    create policy "read own points" on public.points_ledger for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='points_ledger' and policyname='insert own points via RPC only'
  ) then
    create policy "insert own points via RPC only" on public.points_ledger for insert with check (auth.uid() = user_id);
  end if;
end $$;

alter table public.quest_progress enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='quest_progress' and policyname='own quest progress'
  ) then
    create policy "own quest progress" on public.quest_progress for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='quest_progress' and policyname='update own via RPC'
  ) then
    create policy "update own via RPC" on public.quest_progress for update using (auth.uid() = user_id);
  end if;
end $$;

-- KPIs
create or replace view public.kpi_daily_points as
select date_trunc('day', created_at) d, sum(delta_points) points, count(*) events
from public.points_ledger group by 1 order by 1 desc;

create or replace view public.kpi_active_earners as
select date_trunc('day', created_at) d, count(distinct user_id) active_users
from public.points_ledger group by 1 order by 1 desc;

