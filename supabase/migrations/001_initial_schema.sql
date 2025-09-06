-- Supabase Migration: GameXBuddy Initial Database Schema
-- This creates all necessary tables for the gaming platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============ AUTH & USER TABLES ============

-- Custom user profiles extending auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe customer mapping
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;

-- Points/XP system
CREATE TABLE points_ledger (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_ref TEXT,
  delta_points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats view (computed from points_ledger)
CREATE VIEW user_stats AS
SELECT
  p.id,
  p.username,
  SUM(pl.delta_points) as xp,
  FLOOR(SUM(pl.delta_points) / 100) + 1 as level
FROM profiles p
LEFT JOIN points_ledger pl ON p.id = pl.user_id
GROUP BY p.id, p.username;

-- User badges/awards
CREATE TABLE badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============ QUIZ SYSTEM ============

-- Quiz templates
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz choices/answers
CREATE TABLE quiz_choices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts/results
CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_id)
);

-- ============ PREMIUM SYSTEM ============

-- Premium features
CREATE TABLE premium_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ LEADERBOARD SYSTEM ============

-- Daily check-ins
CREATE TABLE user_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- User streaks (computed)
CREATE VIEW v_user_streaks AS
SELECT
  p.id,
  p.username,
  COUNT(uc.*) as checkin_count,
  MAX(uc.checkin_date) as last_checkin,
  CASE
    WHEN MAX(uc.checkin_date) >= CURRENT_DATE - INTERVAL '1 day' THEN
      EXTRACT(DAY FROM CURRENT_DATE - MIN(uc.checkin_date))::INTEGER + 1
    ELSE 0
  END as current_streak
FROM profiles p
LEFT JOIN user_checkins uc ON p.id = uc.user_id
GROUP BY p.id, p.username;

-- Weekly leaderboard view
CREATE VIEW v_leaderboard_7d AS
SELECT
  p.id,
  p.username,
  COALESCE(SUM(pl.delta_points), 0) as xp_7d
FROM profiles p
LEFT JOIN points_ledger pl ON p.id = pl.user_id
  AND pl.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.id, p.username
ORDER BY xp_7d DESC;

-- ============ FAVORITES & USER PREFERENCES ============

-- Game favorites
CREATE TABLE game_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_slug TEXT NOT NULL,
  game_title TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_slug)
);

-- Deal watchlist
CREATE TABLE deal_watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id TEXT NOT NULL,
  game_title TEXT,
  target_price DECIMAL(10,2),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, deal_id)
);

-- ============ CONTENT MANAGEMENT ============

-- Posts/Community Content
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ SEARCH & INDEXING ============

-- Enable full-text search
CREATE INDEX idx_posts_content_search ON posts USING gin (to_tsvector('english', content));
CREATE INDEX idx_quizzes_title_search ON quizzes USING gin (to_tsvector('english', title));

-- ============ RLS POLICIES ============

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (users can only access their own data)
CREATE POLICY "Users can view their own profiles" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profiles" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert on signup" ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own points" ON points_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert points" ON points_ledger FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public quiz read access" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Quiz creators can update" ON quizzes FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Public question read access" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Users can attempt quizzes" ON quiz_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own premium features" ON premium_features FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can manage favorites" ON game_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage watchlist" ON deal_watchlist FOR ALL USING (auth.uid() = user_id);

-- ============ FUNCTIONS & TRIGGERS ============

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to award points (used by Supabase Edge Functions)
CREATE OR REPLACE FUNCTION award_points(
  p_event_type TEXT,
  p_event_ref TEXT,
  p_delta INTEGER
)
RETURNS void AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  INSERT INTO points_ledger (user_id, event_type, event_ref, delta_points)
  VALUES (current_user_id, p_event_type, p_event_ref, p_delta);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============ SEED DATA ============

-- Basic badges
INSERT INTO badges (name, description, icon) VALUES
  ('Quiz Master', 'Complete 10 quizzes', '🎯'),
  ('Deal Hunter', 'Save $100 on purchases', '💰'),
  ('Community Helper', 'Help 5 fellow gamers', '🤝'),
  ('Streak Champion', '7+ day check-in streak', '🔥'),
  ('Premium Gamer', 'Support GameXBuddy', '⭐');

-- Sample quiz (GTA 6 basics)
INSERT INTO quizzes (slug, title, description) VALUES
  ('gta6-basics', 'GTA 6 Basics', 'Test your knowledge of Grand Theft Auto 6');

-- Sample questions for GTA 6 quiz
INSERT INTO quiz_questions (quiz_id, body, ordinal) VALUES
  ((SELECT id FROM quizzes WHERE slug = 'gta6-basics'), 'Which state is GTA 6 rumored to be set in?', 1),
  ((SELECT id FROM quizzes WHERE slug = 'gta6-basics'), 'What company developed GTA 6?', 2);

-- Sample choices
INSERT INTO quiz_choices (question_id, body, is_correct) VALUES
  ((SELECT id FROM quiz_questions WHERE ordinal = 1), 'Vice State', true),
  ((SELECT id FROM quiz_questions WHERE ordinal = 1), 'Liberty State', false),
  ((SELECT id FROM quiz_questions WHERE ordinal = 1), 'San Andreas', false),
  ((SELECT id FROM quiz_questions WHERE ordinal = 2), 'Rockstar Games', true),
  ((SELECT id FROM quiz_questions WHERE ordinal = 2), 'Take-Two Interactive', false);

-- Create indexes for better performance
CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_premium_features_user ON premium_features(user_id, feature_type);
CREATE INDEX idx_points_ledger_user_date ON points_ledger(user_id, created_at);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);