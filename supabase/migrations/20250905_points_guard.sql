-- Add a generated day column and stricter unique indexes for daily check-in

alter table public.points_ledger
  add column if not exists day_date date generated always as (date_trunc('day', created_at)::date) stored;

-- Enforce: one row per (user, event, ref) even when ref is NULL
create unique index if not exists ux_points_event_once
  on public.points_ledger (user_id, event_type, coalesce(event_ref, ''));
  
-- Enforce: one daily row for daily_checkin regardless of ref
create unique index if not exists ux_points_daily_checkin
  on public.points_ledger (user_id, event_type, day_date)
  where event_type = 'daily_checkin';

