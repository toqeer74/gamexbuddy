-- Streaks and leaderboards built on points_ledger

create or replace view public.v_user_streaks as
with days as (
  select user_id, date_trunc('day', created_at)::date d
  from public.points_ledger
  where event_type = 'daily_checkin'
  group by 1,2
),
anchored as (
  select user_id, d,
         d - (row_number() over (partition by user_id order by d))::int as grp
  from days
),
runs as (
  select user_id, min(d) as start_day, max(d) as end_day, count(*) as len
  from anchored
  group by user_id, grp
),
current_run as (
  select r.*
  from runs r
  join (select user_id, max(d) maxd from days group by 1) last on last.user_id=r.user_id
  where r.end_day = last.maxd
)
select user_id, start_day, end_day, len as current_streak
from current_run
order by current_streak desc;

create or replace view public.v_user_xp as
select user_id, sum(delta_points)::int as total_xp
from public.points_ledger
group by user_id;

create or replace view public.v_leaderboard_7d as
select user_id, sum(delta_points)::int as xp_7d
from public.points_ledger
where created_at >= now() - interval '7 days'
group by user_id
order by xp_7d desc;

