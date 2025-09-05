-- Ensure index for affiliate clicks per user/day (optional)
create index if not exists ix_affiliate_clicks_user_day on public.affiliate_clicks(user_id, created_at);

