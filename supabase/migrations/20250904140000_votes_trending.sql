-- Votes for threads (posts.type='thread') and replies
create table if not exists public.post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value int not null check (value in (-1,1)),
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

create table if not exists public.reply_votes (
  id uuid primary key default gen_random_uuid(),
  reply_id uuid not null references public.post_replies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value int not null check (value in (-1,1)),
  created_at timestamptz default now(),
  unique (reply_id, user_id)
);

-- View with thread scores (net votes) and reply count
create or replace view public.thread_posts_scores as
select
  p.*,
  coalesce(v.score, 0)::int as score,
  coalesce(rc.reply_count, 0)::int as reply_count
from public.posts p
left join (
  select post_id, sum(value) as score from public.post_votes group by post_id
) v on v.post_id = p.id
left join (
  select post_id, count(*) as reply_count from public.post_replies group by post_id
) rc on rc.post_id = p.id
where p.type = 'thread'
order by score desc, p.created_at desc;

-- Recommended RLS (uncomment to enable)
-- alter table public.post_votes enable row level security;
-- alter table public.reply_votes enable row level security;
-- create policy "votes_select_all" on public.post_votes for select using (true);
-- create policy "votes_insert_owner" on public.post_votes for insert to authenticated with check (auth.uid() = user_id);
-- create policy "votes_delete_owner" on public.post_votes for delete to authenticated using (auth.uid() = user_id);
-- create policy "rvotes_select_all" on public.reply_votes for select using (true);
-- create policy "rvotes_insert_owner" on public.reply_votes for insert to authenticated with check (auth.uid() = user_id);
-- create policy "rvotes_delete_owner" on public.reply_votes for delete to authenticated using (auth.uid() = user_id);

