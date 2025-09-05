-- Double opt-in support for newsletter subscribers

alter table if exists public.newsletter_subscribers
  add column if not exists confirm_token text,
  add column if not exists confirmed boolean default false,
  add column if not exists confirmed_at timestamptz;

create unique index if not exists ux_newsletter_email on public.newsletter_subscribers ((lower(email)));

alter table public.newsletter_subscribers enable row level security;
drop policy if exists "newsletter insert" on public.newsletter_subscribers;
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='newsletter_subscribers' and policyname='newsletter anyone insert'
  ) then
    create policy "newsletter anyone insert" on public.newsletter_subscribers for insert with check (true);
  end if;
end $$;

