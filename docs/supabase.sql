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

-- ------------------------------------------------------------
-- Phase B unified schema (optional, for posts/likes model)
-- ------------------------------------------------------------

-- Generic posts table for memes and threads
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('meme','thread')) not null,
  title text,
  body text,
  image_url text,
  author_id uuid references public.profiles(id),
  likes int default 0 not null,
  created_at timestamptz default now()
);

-- Likes with uniqueness per user per post
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

-- Recommended RLS (uncomment to enable)
-- alter table public.posts enable row level security;
-- alter table public.likes enable row level security;
-- create policy "read all posts" on public.posts for select using (true);
-- create policy "read all likes" on public.likes for select using (true);
-- create policy "insert own post" on public.posts for insert with check (auth.uid() = author_id);
-- create policy "insert own like" on public.likes for insert with check (auth.uid() = user_id);

-- Note: increment_xp(user_id uuid, add int) already exists above.
-- Client code should call via named args: { user_id: <uuid>, add: <int> }

-- ------------------------------------------------------------
-- Option A (MVP): View for meme posts with live like_count
-- ------------------------------------------------------------
create or replace view public.meme_posts as
select p.*, coalesce(count(l.id), 0) as like_count
from public.posts p
left join public.likes l on l.post_id = p.id
where p.type = 'meme'
group by p.id
order by p.created_at desc;

-- ------------------------------------------------------------
-- Threads migration (unified): Replies for posts(type='thread')
-- ------------------------------------------------------------
create table if not exists public.post_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id),
  body text not null,
  created_at timestamptz default now()
);

-- Recommended RLS (uncomment to enable)
-- alter table public.post_replies enable row level security;
-- create policy "read all replies" on public.post_replies for select using (true);
-- create policy "insert own reply" on public.post_replies for insert with check (auth.uid() = author_id);

-- ------------------------------------------------------------
-- Minimal RLS policies to secure posts/likes/replies (enable as needed)
-- ------------------------------------------------------------
-- POSTS
-- alter table public.posts enable row level security;
-- create policy "posts_select_all" on public.posts for select to authenticated, anon using (true);
-- create policy "posts_insert_owner" on public.posts for insert to authenticated with check (auth.uid() = author_id);
-- create policy "posts_update_owner" on public.posts for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
-- create policy "posts_delete_owner" on public.posts for delete to authenticated using (auth.uid() = author_id);

-- LIKES
-- alter table public.likes enable row level security;
-- create policy "likes_select_all" on public.likes for select to authenticated, anon using (true);
-- create policy "likes_insert_owner" on public.likes for insert to authenticated with check (auth.uid() = user_id);
-- create policy "likes_delete_owner" on public.likes for delete to authenticated using (auth.uid() = user_id);

-- POST_REPLIES
-- alter table public.post_replies enable row level security;
-- create policy "replies_select_all" on public.post_replies for select to authenticated, anon using (true);
-- create policy "replies_insert_owner" on public.post_replies for insert to authenticated with check (auth.uid() = author_id);
-- create policy "replies_delete_owner" on public.post_replies for delete to authenticated using (auth.uid() = author_id);

-- ------------------------------------------------------------
-- Reply counts per thread (for list views)
-- ------------------------------------------------------------
create or replace view public.thread_posts as
select
  p.*,
  coalesce(rc.reply_count, 0)::int as reply_count
from public.posts p
left join (
  select post_id, count(*) as reply_count
  from public.post_replies
  group by post_id
) rc on rc.post_id = p.id
where p.type = 'thread'
order by p.created_at desc;

-- ------------------------------------------------------------
-- Ready-to-run RLS (uncomment if you want to apply directly)
-- ------------------------------------------------------------
-- alter table public.posts enable row level security;
-- alter table public.likes enable row level security;
-- alter table public.post_replies enable row level security;
-- 
-- create policy "posts_select_all" on public.posts for select to authenticated, anon using (true);
-- create policy "posts_insert_owner" on public.posts for insert to authenticated with check (auth.uid() = author_id);
-- create policy "posts_update_owner" on public.posts for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
-- create policy "posts_delete_owner" on public.posts for delete to authenticated using (auth.uid() = author_id);
-- 
-- create policy "likes_select_all" on public.likes for select to authenticated, anon using (true);
-- create policy "likes_insert_owner" on public.likes for insert to authenticated with check (auth.uid() = user_id);
-- create policy "likes_delete_owner" on public.likes for delete to authenticated using (auth.uid() = user_id);
-- 
-- create policy "replies_select_all" on public.post_replies for select to authenticated, anon using (true);
-- create policy "replies_insert_owner" on public.post_replies for insert to authenticated with check (auth.uid() = author_id);
-- create policy "replies_delete_owner" on public.post_replies for delete to authenticated using (auth.uid() = author_id);
