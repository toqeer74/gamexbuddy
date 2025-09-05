-- User stats table to maintain xp/level snapshots
create table if not exists public.user_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  xp int not null default 0,
  level int not null default 1,
  updated_at timestamptz default now()
);

-- Simple function to refresh stats from profiles.xp
create or replace function public.refresh_user_stats()
returns void language sql as $$
  insert into public.user_stats(user_id, xp, level, updated_at)
  select p.id, coalesce(p.xp,0) as xp,
         greatest(1, 1 + floor(coalesce(p.xp,0) / 500)) as level,
         now()
  from public.profiles p
  on conflict (user_id) do update set xp = excluded.xp, level = excluded.level, updated_at = excluded.updated_at;
$$;

