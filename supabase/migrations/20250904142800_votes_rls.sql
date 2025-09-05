-- Enable RLS and policies for votes tables
alter table if exists public.post_votes enable row level security;
alter table if exists public.reply_votes enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='post_votes' and policyname='post_votes_select_all'
  ) then
    create policy "post_votes_select_all" on public.post_votes for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='post_votes' and policyname='post_votes_insert_owner'
  ) then
    create policy "post_votes_insert_owner" on public.post_votes for insert to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='post_votes' and policyname='post_votes_update_owner'
  ) then
    create policy "post_votes_update_owner" on public.post_votes for update to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='post_votes' and policyname='post_votes_delete_owner'
  ) then
    create policy "post_votes_delete_owner" on public.post_votes for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='reply_votes' and policyname='reply_votes_select_all'
  ) then
    create policy "reply_votes_select_all" on public.reply_votes for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='reply_votes' and policyname='reply_votes_insert_owner'
  ) then
    create policy "reply_votes_insert_owner" on public.reply_votes for insert to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='reply_votes' and policyname='reply_votes_update_owner'
  ) then
    create policy "reply_votes_update_owner" on public.reply_votes for update to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='reply_votes' and policyname='reply_votes_delete_owner'
  ) then
    create policy "reply_votes_delete_owner" on public.reply_votes for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

