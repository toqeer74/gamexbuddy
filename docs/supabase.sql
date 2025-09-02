-- Enable extensions commonly used (optional)
create extension if not exists pgcrypto;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key,
  username text,
  name text,
  xp int default 0 not null,
  created_at timestamptz default now()
);

-- MemeWall posts
create table if not exists public.memewall (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  image text not null,
  likes int default 0 not null,
  created_at timestamptz default now()
);

-- Per-user likes to prevent duplicates
create table if not exists public.memewall_likes (
  post_id uuid references public.memewall(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- Threads and replies
create table if not exists public.threads (
  id bigint generated always as identity primary key,
  title text not null,
  user text,
  replies int default 0 not null,
  created_at timestamptz default now()
);

create table if not exists public.thread_replies (
  id bigint generated always as identity primary key,
  thread_id bigint references public.threads(id) on delete cascade,
  user text,
  content text not null,
  created_at timestamptz default now()
);

-- XP increment RPC
create or replace function public.increment_xp(user_id uuid, add int)
returns void
language sql
security definer
as $$
  update public.profiles set xp = coalesce(xp,0) + add where id = user_id;
$$;

-- Optional: basic RLS policies (enable if using RLS)
-- alter table public.memewall enable row level security;
-- alter table public.memewall_likes enable row level security;
-- alter table public.threads enable row level security;
-- alter table public.thread_replies enable row level security;
-- alter table public.profiles enable row level security;
-- create policy "read all" on public.memewall for select using (true);
-- create policy "read all" on public.threads for select using (true);
-- create policy "read all" on public.thread_replies for select using (true);
-- create policy "read all" on public.profiles for select using (true);
-- create policy "insert own like" on public.memewall_likes for insert with check (auth.uid() = user_id);
-- create policy "insert thread" on public.threads for insert using (auth.role() = 'authenticated');
-- create policy "insert reply" on public.thread_replies for insert using (auth.role() = 'authenticated');

