-- GameXBuddy Community System Migration
-- 2025-09-06: Community v1 - Comments + Reactions + Moderation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Comments table
create table if not exists public.comments (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('news', 'guide')),
  target_id text not null,
  body text not null,
  created_at timestamptz default now(),
  edited_at timestamptz,
  is_deleted boolean default false
);

-- Index for fast lookups
create index if not exists ix_comments_target on public.comments(target_type, target_id);
create index if not exists ix_comments_user on public.comments(user_id);

-- Comment reactions (emojis)
create table if not exists public.comment_reactions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  comment_id bigint not null references public.comments(id) on delete cascade,
  emoji text not null check (emoji in ('like', 'fire', 'star')),
  created_at timestamptz default now(),
  -- Prevent duplicate reactions from same user on same comment
  unique (user_id, comment_id, emoji)
);

-- Comment reports for moderation
create table if not exists public.comment_reports (
  id bigserial primary key,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  comment_id bigint not null references public.comments(id) on delete cascade,
  reason text default 'user_report',
  created_at timestamptz default now(),
  -- Prevent duplicate reports
  unique (reporter_id, comment_id)
);

-- Row Level Security (RLS)
alter table public.comments enable row level security;
alter table public.comment_reactions enable row level security;
alter table public.comment_reports enable row level security;

-- Comments policies
create policy "comments_read_all" on public.comments for select using (true);

create policy "comments_insert_own" on public.comments for insert
  with check (auth.uid() = user_id);

create policy "comments_update_own" on public.comments for update
  using (auth.uid() = user_id);

-- Reactions policies
create policy "reactions_read_all" on public.comment_reactions for select using (true);

create policy "reactions_insert_own" on public.comment_reactions for insert
  with check (auth.uid() = user_id);

create policy "reactions_delete_own" on public.comment_reactions for delete
  using (auth.uid() = user_id);

-- Reports policies - only moderators can read reports
create policy "reports_read_mods_only" on public.comment_reports for select
  using (
    exists(
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_moderator = true
    )
  );

create policy "reports_insert_own" on public.comment_reports for insert
  with check (auth.uid() = reporter_id);

-- Add moderator permission to profiles if not exists
-- Run this separately if you need to add moderator column:
-- alter table public.profiles add column if not exists is_moderator boolean default false;

-- Functions for moderation
create or replace function moderate_comment(
  comment_id bigint,
  action text -- 'delete', 'hide', 'approve'
) returns void as $$
begin
  -- Check if user is moderator (implement this check)
  if not exists(
    select 1 from public.profiles
    where id = auth.uid() and is_moderator = true
  ) then
    raise exception 'Permission denied: moderator role required';
  end if;

  if action = 'delete' then
    update public.comments
    set is_deleted = true, edited_at = now()
    where id = comment_id;
  elsif action = 'hide' then
    update public.comments
    set is_deleted = true, edited_at = now()
    where id = comment_id;
  elsif action = 'approve' then
    update public.comments
    set is_deleted = false, edited_at = now()
    where id = comment_id;
  end if;
end;
$$ language plpgsql security definer;

-- Grant execution to authenticated users
grant execute on function moderate_comment(bigint, text) to authenticated;

-- Enable RLS on profiles if editing profiles table
-- alter table public.profiles enable row level security;
-- create policy "profiles_read_own" on public.profiles for select using (auth.uid() = id);
-- create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);