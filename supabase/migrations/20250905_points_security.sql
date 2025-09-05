-- Lock down direct writes; allow only via SECURITY DEFINER RPC

revoke insert, update, delete on public.points_ledger from anon, authenticated;
revoke insert, update, delete on public.quest_progress from anon, authenticated;

grant select on public.points_ledger  to authenticated;
grant select on public.quest_progress to authenticated;

-- Redemptions policy choices depend on product stage; keep conservative
revoke all on public.redemptions from anon, authenticated;
grant select, insert on public.redemptions to authenticated;

-- Remove any permissive insert policy from earlier migrations
drop policy if exists "insert own points via RPC only" on public.points_ledger;

