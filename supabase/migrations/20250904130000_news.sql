create table if not exists public.news (
  id bigserial primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  image_url text,
  tags text[] default '{}',
  published_at timestamptz not null,
  source_url text not null,
  source text not null,
  created_at timestamptz default now()
);

create index if not exists news_published_idx on public.news (published_at desc);
create index if not exists news_source_idx on public.news (source);

