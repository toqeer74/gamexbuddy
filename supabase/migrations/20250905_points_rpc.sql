-- Award points via RPC tied to auth.uid(); safe + idempotent

create or replace function public.award_points(
  p_event_type text,
  p_event_ref  text,
  p_delta      int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_delta = 0 then
    return;
  end if;

  insert into public.points_ledger (user_id, event_type, event_ref, delta_points)
  values (auth.uid(), p_event_type, p_event_ref, p_delta)
  on conflict (user_id, event_type, coalesce(event_ref, ''))
  do nothing;
end;
$$;

grant execute on function public.award_points(text, text, int) to authenticated;

