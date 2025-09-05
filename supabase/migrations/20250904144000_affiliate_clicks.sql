create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  url text not null,
  label text,
  sku text,
  ref text,
  ip text,
  ua text,
  created_at timestamptz default now()
);

-- Optional RLS
-- alter table public.affiliate_clicks enable row level security;
-- create policy "select_all_clicks" on public.affiliate_clicks for select using (true);
-- create policy "insert_own_clicks" on public.affiliate_clicks for insert to authenticated with check (auth.uid() = user_id);

