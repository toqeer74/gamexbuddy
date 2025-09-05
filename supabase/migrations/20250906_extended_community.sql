-- GameXBuddy Extended Community Features
-- 2025-09-06: Private Messaging, Events, Forums, Analytics

-- Extend comments table to support forum threading
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id bigint REFERENCES public.comments(id);
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS thread_title text;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS is_sticky boolean DEFAULT false;

-- Private messaging system
CREATE TABLE IF NOT EXISTS public.private_messages (
  id bigserial PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  is_deleted_by_sender boolean DEFAULT false,
  is_deleted_by_recipient boolean DEFAULT false
);

-- Message threads (replies)
CREATE TABLE IF NOT EXISTS public.message_replies (
  id bigserial PRIMARY KEY,
  message_id bigint NOT NULL REFERENCES public.private_messages(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Events and scheduling
CREATE TABLE IF NOT EXISTS public.events (
  id bigserial PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  event_end timestamptz,
  location text, -- Virtual or physical location
  event_type text CHECK (event_type IN ('gaming', 'tournament', 'stream', 'meetup', 'other')) DEFAULT 'gaming',
  max_attendees integer,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event registrations
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id bigserial PRIMARY KEY,
  event_id bigint NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text CHECK (status IN ('interested', 'attending', 'declined')) DEFAULT 'interested',
  registered_at timestamptz DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- Premium features and subscription tracking
CREATE TABLE IF NOT EXISTS public.premium_features (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type text CHECK (feature_type IN ('posts_highlight', 'featured_profile', 'early_access', 'custom_badge', 'priority_support')) NOT NULL,
  is_active boolean DEFAULT true,
  activated_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE (user_id, feature_type)
);

-- User analytics and engagement tracking
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'page_view', 'comment_posted', 'reaction', 'share', 'follow'
  event_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Follow system for user connections
CREATE TABLE IF NOT EXISTS public.user_follows (
  id bigserial PRIMARY KEY,
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_private_messages_sender ON public.private_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_private_messages_recipient ON public.private_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_creator ON public.events(creator_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.user_analytics(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.user_follows(follower_id);

-- RLS Policies

-- Private Messages
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "private_messages_read_own" ON public.private_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "private_messages_insert_own" ON public.private_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "private_messages_update_own" ON public.private_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "message_replies_read_participants" ON public.message_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.private_messages pm
      WHERE pm.id = message_id AND (pm.sender_id = auth.uid() OR pm.recipient_id = auth.uid())
    )
  );

CREATE POLICY "message_replies_insert_participants" ON public.message_replies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.private_messages pm
      WHERE pm.id = message_id AND (pm.sender_id = auth.uid() OR pm.recipient_id = auth.uid())
    )
  );

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_read_all_public" ON public.events FOR SELECT
  USING (is_private = false);

CREATE POLICY "events_read_own_private" ON public.events FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "events_insert_authenticated" ON public.events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "events_update_own" ON public.events FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "event_attendees_read_registered" ON public.event_attendees FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.creator_id = auth.uid())
  );

CREATE POLICY "event_attendees_insert_own" ON public.event_attendees FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "event_attendees_update_own" ON public.event_attendees FOR UPDATE
  USING (user_id = auth.uid());

-- Premium Features
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "premium_read_own" ON public.premium_features FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "premium_insert_mod" ON public.premium_features FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_moderator = true
    )
  );

CREATE POLICY "premium_update_mod" ON public.premium_features FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_moderator = true
    )
  );

-- Analytics (read only for mods)
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_read_mods_only" ON public.user_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_moderator = true
    )
  );

CREATE POLICY "analytics_insert_authenticated" ON public.user_analytics FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Follow System
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_read_all" ON public.user_follows FOR SELECT USING (true);

CREATE POLICY "follows_insert_own" ON public.user_follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "follows_delete_own" ON public.user_follows FOR DELETE
  USING (follower_id = auth.uid() OR following_id = auth.uid());

-- Update comment policies to support threading
DROP POLICY IF EXISTS "comments_insert_own" ON public.comments;
CREATE POLICY "comments_insert_authenticated" ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);