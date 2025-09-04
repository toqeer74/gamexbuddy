-- Migration: create profiles table (id references auth.users)
-- Safe to run multiple times due to IF NOT EXISTS guards.
-- Generated: 2025-09-04T03:10:20

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Enable RLS (no-op if already enabled)
do $$
begin
  if not exists (
    select 1 from pg_tables
    where schemaname = 'public' and tablename = 'profiles'
  ) then
    raise exception 'profiles table not found after create';
  end if;

  -- Enable RLS if not yet enabled
  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'profiles'
      and c.relrowsecurity = true
  ) then
    execute 'alter table public.profiles enable row level security';
  end if;
end $$;

-- Policies (id == auth.uid())
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Profiles are viewable by everyone'
  ) then
    create policy "Profiles are viewable by everyone"
      on public.profiles for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on public.profiles for insert
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end $$;
