-- Storage RLS policies for public read and editor uploads
-- Buckets: media, guides

-- Best-effort create buckets (public)
do $$ begin
  perform storage.create_bucket('media', public => true);
exception when others then null; end $$;

do $$ begin
  perform storage.create_bucket('guides', public => true);
exception when others then null; end $$;

-- Helper: predicate to allow editor/moderator
create or replace function public.is_editor_or_mod(uid uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.profiles p
    where p.id = uid and (coalesce(p.is_editor,false) or coalesce(p.is_moderator,false))
  );
$$;

-- Public read for media + guides
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public read media/guides'
  ) then
    create policy "public read media/guides"
      on storage.objects for select
      using (bucket_id in ('media','guides'));
  end if;
end $$;

-- Authenticated editor/moderator can write to media/guides
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='editor write media/guides (insert)'
  ) then
    create policy "editor write media/guides (insert)"
      on storage.objects for insert to authenticated
      with check (
        bucket_id in ('media','guides') and public.is_editor_or_mod(auth.uid())
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='editor write media/guides (update)'
  ) then
    create policy "editor write media/guides (update)"
      on storage.objects for update to authenticated
      using (
        bucket_id in ('media','guides') and public.is_editor_or_mod(auth.uid())
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='editor write media/guides (delete)'
  ) then
    create policy "editor write media/guides (delete)"
      on storage.objects for delete to authenticated
      using (
        bucket_id in ('media','guides') and public.is_editor_or_mod(auth.uid())
      );
  end if;
end $$;

