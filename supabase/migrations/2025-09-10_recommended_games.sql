-- Recommended games schema (idempotent)
-- Requires pgcrypto for gen_random_uuid
create extension if not exists pgcrypto with schema public;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  cover_path text,
  hero_path text,
  rating numeric,
  released date,
  developers text[],
  genres text[],
  platforms text[],
  created_at timestamptz default now()
);

create table if not exists public.recommended_games (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  rank int not null,
  badge text,
  created_at timestamptz default now()
);

create table if not exists public.game_offers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  store text not null,
  url text not null,
  price numeric,
  currency text default 'USD',
  discount int,
  created_at timestamptz default now()
);

create index if not exists idx_reco_rank on public.recommended_games(rank);

