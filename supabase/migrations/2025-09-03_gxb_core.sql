-- === Enums (safe, idempotent) ==========================
do $$ begin
  create type post_type as enum ('thread','meme','review','comment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('published','flagged','deleted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reaction_type as enum ('like','laugh','fire');
exception when duplicate_object then null; end $$;

-- === Tables (extend existing if present) ===============

-- profiles: extend with premium/rank fields if missing
alter table if exists public.profiles
  add column if not exists bio text,
  add column if not exists xp_total int default 0,
  add column if not exists rank text default 'rookie',
  add column if not exists is_premium boolean default false,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_status text,  -- 'active' | 'canceled' | null
  add column if not exists avatar_url text;

-- roles
alter table public.profiles
  add column if not exists is_moderator boolean default false,
  add column if not exists is_editor boolean default false;

-- public profile handle
alter table public.profiles
  add column if not exists username text;

-- unique index for username when present
create unique index if not exists ux_profiles_username on public.profiles (username) where username is not null;
create unique index if not exists uq_profiles_username_ci on public.profiles (lower(username)) where username is not null;

-- media paths for content
alter table if exists public.news add column if not exists image_path text;
alter table if exists public.guides add column if not exists cover_path text;

-- moderator can update posts.status (example policy)
create policy if not exists posts_update_moderator
on public.posts for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_moderator,false) = true))
with check (true);

-- search helper across guides/news/posts
create or replace function public.search_all(q text)
returns table(kind text, id uuid, title text, snippet text) as $$
begin
  return query
  select 'guide'::text, g.id, g.title, left(coalesce(g.body_mdx,''), 180)
  from public.guides g
  where g.tsv @@ to_tsquery('simple', replace(q,' ',' & '))

  union all
  select 'news'::text, n.id, n.title, left(coalesce(n.excerpt,''), 180)
  from public.news n
  where n.tsv @@ to_tsquery('simple', replace(q,' ',' & '))

  union all
  select 'post'::text, p.id, coalesce(p.title, '[Post]'), left(coalesce(p.body_md,''), 180)
  from public.posts p
  where p.tsv @@ to_tsquery('simple', replace(q,' ',' & '));
end; $$ language plpgsql stable;

-- optional: cap helper for XP like_received per day
create or replace function public.count_like_received_today(uid uuid)
returns table(count bigint) as $$
begin
  return query
  select count(*)::bigint
  from public.xp_events e
  where e.user_id = uid and e.action = 'like_received'
    and e.created_at >= now() - interval '1 day';
end; $$ language plpgsql stable;

-- posts: add columns to support unified model
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete cascade,
  type post_type not null,
  title text,
  body_md text,
  media_urls text[] default '{}',
  parent_id uuid references public.posts(id) on delete cascade,
  game text,
  tags text[] default '{}',
  status post_status default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- likes (legacy) already exists in your project; keep it.
-- reactions (future-ready): optional richer reactions
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  type reaction_type not null default 'like',
  created_at timestamptz default now(),
  unique (post_id, user_id, type)
);

-- post_replies (you already created; ensure present)
create table if not exists public.post_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- xp events + badges
create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  action text not null,         -- e.g., post_create, reply_create, like_received, daily_login
  points int not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  description text,
  icon text,
  criteria jsonb default '{}'::jsonb
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  awarded_at timestamptz default now(),
  unique (user_id, badge_id)
);

-- content: news / guides / reviews
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  source text,
  title text,
  slug text unique,
  excerpt text,
  body_html text,
  url text,
  image_url text,
  tags text[] default '{}',
  published_at timestamptz,
  status text default 'published'
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text,
  body_mdx text,
  game text,
  tags text[] default '{}',
  seo jsonb default '{}'::jsonb,
  published_at timestamptz,
  status text default 'published'
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  game text,
  rating numeric(3,1),
  pros text[] default '{}',
  cons text[] default '{}',
  body_mdx text,
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  status text default 'published'
);

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  merchant text,
  sku text,
  url text,
  clicks int default 0,
  revenue_cents int default 0,
  created_at timestamptz default now()
);

create table if not exists public.feature_flags (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

create table if not exists public.moderation_flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete cascade,
  reason text,
  status text default 'open',
  created_at timestamptz default now()
);

-- === Indexes ==========================================
create index if not exists idx_posts_author_created on public.posts(author_id, created_at desc);
create index if not exists idx_posts_parent_created on public.posts(parent_id, created_at desc);
create index if not exists idx_posts_type_created on public.posts(type, created_at desc);
create index if not exists idx_replies_post_created on public.post_replies(post_id, created_at desc);
create index if not exists idx_news_published on public.news(published_at desc);
create index if not exists idx_guides_published on public.guides(published_at desc);

-- Full-text (simple) on posts & guides/news
do $$ begin
  alter table public.posts add column if not exists tsv tsvector;
exception when duplicate_column then null; end $$;
do $$ begin
  alter table public.guides add column if not exists tsv tsvector;
exception when duplicate_column then null; end $$;
do $$ begin
  alter table public.news add column if not exists tsv tsvector;
exception when duplicate_column then null; end $$;

create index if not exists idx_posts_tsv on public.posts using gin(tsv);
create index if not exists idx_guides_tsv on public.guides using gin(tsv);
create index if not exists idx_news_tsv on public.news using gin(tsv);

create or replace function public.update_tsv_posts() returns trigger as $$
begin
  new.tsv := to_tsvector('simple', coalesce(new.title,'') || ' ' || coalesce(new.body_md,''));
  return new;
end $$ language plpgsql;

create or replace function public.update_tsv_guides() returns trigger as $$
begin
  new.tsv := to_tsvector('simple', coalesce(new.title,'') || ' ' || coalesce(new.body_mdx,''));
  return new;
end $$ language plpgsql;

create or replace function public.update_tsv_news() returns trigger as $$
begin
  new.tsv := to_tsvector('simple', coalesce(new.title,'') || ' ' || coalesce(new.excerpt,''));
  return new;
end $$ language plpgsql;

drop trigger if exists trg_posts_tsv on public.posts;
create trigger trg_posts_tsv before insert or update
on public.posts for each row execute procedure public.update_tsv_posts();

drop trigger if exists trg_guides_tsv on public.guides;
create trigger trg_guides_tsv before insert or update
on public.guides for each row execute procedure public.update_tsv_guides();

drop trigger if exists trg_news_tsv on public.news;
create trigger trg_news_tsv before insert or update
on public.news for each row execute procedure public.update_tsv_news();

-- === Views (reply counts, meme like counts) ==========
create or replace view public.thread_posts as
select p.*,
       coalesce(rc.reply_count,0)::int as reply_count
from public.posts p
left join (
  select post_id, count(*) as reply_count
  from public.post_replies
  group by post_id
) rc on rc.post_id = p.id
where p.type = 'thread';

create or replace view public.meme_posts as
select p.*,
       coalesce(lc.like_count,0)::int as like_count
from public.posts p
left join (
  select post_id, count(*) as like_count
  from public.likes
  group by post_id
) lc on lc.post_id = p.id
where p.type = 'meme';

-- === XP triggers (server-side; remove if you prefer Edge gating) ===
create or replace function public.apply_xp(user_uuid uuid, pts int, act text, meta jsonb default '{}'::jsonb)
returns void as $$
begin
  insert into public.xp_events(user_id, points, action, meta) values (user_uuid, pts, act, meta);
  update public.profiles set xp_total = coalesce(xp_total,0) + pts where id = user_uuid;
end $$ language plpgsql security definer;

-- award XP on creating a post (threads/memes/reviews/comments)
create or replace function public.xp_on_post_insert()
returns trigger as $$
begin
  perform public.apply_xp(new.author_id, 10, 'post_create', jsonb_build_object('post_id', new.id, 'type', new.type));
  return new;
end $$ language plpgsql;

drop trigger if exists trg_xp_post_insert on public.posts;
create trigger trg_xp_post_insert after insert on public.posts
for each row execute procedure public.xp_on_post_insert();

-- award XP on reply
create or replace function public.xp_on_reply_insert()
returns trigger as $$
begin
  perform public.apply_xp(new.author_id, 6, 'reply_create', jsonb_build_object('post_id', new.post_id));
  return new;
end $$ language plpgsql;

drop trigger if exists trg_xp_reply_insert on public.post_replies;
create trigger trg_xp_reply_insert after insert on public.post_replies
for each row execute procedure public.xp_on_reply_insert();

-- award XP to post author on like received (+2)
create or replace function public.xp_on_like_insert()
returns trigger as $$
declare
  post_author uuid;
begin
  select author_id into post_author from public.posts where id = new.post_id;
  if post_author is not null then
    perform public.apply_xp(post_author, 2, 'like_received', jsonb_build_object('post_id', new.post_id, 'from', new.user_id));
  end if;
  return new;
end $$ language plpgsql;

drop trigger if exists trg_xp_like_insert on public.likes;
create trigger trg_xp_like_insert after insert on public.likes
for each row execute procedure public.xp_on_like_insert();

-- === RLS (minimal safe) ===============================
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.post_replies enable row level security;
alter table public.reactions enable row level security;
alter table public.xp_events enable row level security;
alter table public.news enable row level security;
alter table public.guides enable row level security;
alter table public.reviews enable row level security;
alter table public.profiles enable row level security;
alter table public.moderation_flags enable row level security;

-- profiles
create policy if not exists profiles_select_all
on public.profiles for select
to authenticated, anon using (true);

create policy if not exists profiles_update_self
on public.profiles for update
to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- posts
create policy if not exists posts_select_published_or_owner
on public.posts for select
to authenticated, anon using (status = 'published' or author_id = auth.uid());

create policy if not exists posts_insert_owner
on public.posts for insert
to authenticated with check (author_id = auth.uid());

create policy if not exists posts_update_owner
on public.posts for update
to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());

create policy if not exists posts_delete_owner
on public.posts for delete
to authenticated using (author_id = auth.uid());

-- likes
create policy if not exists likes_select_all
on public.likes for select
to authenticated, anon using (true);

create policy if not exists likes_insert_owner
on public.likes for insert
to authenticated with check (user_id = auth.uid());

create policy if not exists likes_delete_owner
on public.likes for delete
to authenticated using (user_id = auth.uid());

-- reactions (if used)
create policy if not exists reactions_select_all
on public.reactions for select
to authenticated, anon using (true);

create policy if not exists reactions_insert_owner
on public.reactions for insert
to authenticated with check (user_id = auth.uid());

create policy if not exists reactions_delete_owner
on public.reactions for delete
to authenticated using (user_id = auth.uid());

-- replies
create policy if not exists replies_select_all
on public.post_replies for select
to authenticated, anon using (true);

create policy if not exists replies_insert_owner
on public.post_replies for insert
to authenticated with check (author_id = auth.uid());

create policy if not exists replies_delete_owner
on public.post_replies for delete
to authenticated using (author_id = auth.uid());

-- xp_events: readable, but inserts only by server role (since triggers already write, client shouldn't)
create policy if not exists xp_events_select_all
on public.xp_events for select
to authenticated, anon using (true);

create policy if not exists xp_events_insert_service
on public.xp_events for insert
to service_role with check (true);

-- content read
create policy if not exists news_select_published
on public.news for select to authenticated, anon using (status = 'published');

create policy if not exists guides_select_published
on public.guides for select to authenticated, anon using (status = 'published');

create policy if not exists reviews_select_published
on public.reviews for select to authenticated, anon using (status = 'published');

-- editors can insert/update news/guides/reviews
create policy if not exists news_insert_editor
on public.news for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_editor,false) = true));

create policy if not exists news_update_editor
on public.news for update to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_editor,false) = true))
with check (true);

create policy if not exists guides_insert_editor
on public.guides for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_editor,false) = true));

create policy if not exists guides_update_editor
on public.guides for update to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_editor,false) = true))
with check (true);

create policy if not exists reviews_insert_editor
on public.reviews for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_editor,false) = true));

create policy if not exists reviews_update_editor
on public.reviews for update to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and coalesce(p.is_editor,false) = true))
with check (true);

-- moderation_flags
create policy if not exists modflags_select_all
on public.moderation_flags for select
to authenticated, anon using (true);

create policy if not exists modflags_insert_owner
on public.moderation_flags for insert
to authenticated with check (reporter_id = auth.uid());
