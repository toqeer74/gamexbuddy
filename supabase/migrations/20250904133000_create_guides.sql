-- Guides: MDX-backed guides stored in Storage bucket `guides`
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  mdx_path text not null,
  -- Optional inline content fallback for demos/seeding
  body_mdx text,
  tags text[] default '{}',
  cover_path text,
  created_at timestamptz not null default now()
);

-- Basic RLS (optional; uncomment if using RLS)
-- alter table public.guides enable row level security;
-- create policy "guides_read_all" on public.guides for select using (true);
-- -- Allow editors/moderators to insert/update (adjust to your roles)
-- create policy "guides_insert" on public.guides for insert to authenticated with check (true);
-- create policy "guides_update" on public.guides for update to authenticated using (true) with check (true);

-- Ensure Storage bucket `guides` exists and is public (best-effort)
do $$ begin
  perform storage.create_bucket('guides', public => true);
exception when others then
  null; -- ignore if exists or lacking perms in non-prod envs
end $$;
