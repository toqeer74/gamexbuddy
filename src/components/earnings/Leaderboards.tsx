import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, Target } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  points: number;
  streak_days: number;
  avatar_url?: string;
}

export default function Leaderboards() {
  const [topStreaks, setTopStreaks] = useState<LeaderboardEntry[]>([]);
  const [topWeekly, setTopWeekly] = useState<LeaderboardEntry[]>([]);
  const [quizChampions, setQuizChampions] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  async function fetchLeaderboards() {
    try {
      // Note: Replace with actual view names from your Supabase setup
      const [streakRes, weeklyRes] = await Promise.all([
        supabase.from("v_user_streaks").select("*").order("current_streak", { ascending: false }).limit(20),
        supabase.from("v_leaderboard_7d").select("*").order("xp_7d", { ascending: false }).limit(20)
      ]);

      setTopStreaks(streakRes.data || []);
      setTopWeekly(weeklyRes.data || []);
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error);
      // Fallback to mock data if views don't exist yet
      setMockData();
    }
    setLoading(false);
  }

  function setMockData() {
    setTopStreaks([
      { username: "FireGamer", points: 250, streak_days: 45 },
      { username: "NeonPro", points: 235, streak_days: 38 },
      { username: "CyberKing", points: 220, streak_days: 33 },
      { username: "RetroMaster", points: 205, streak_days: 28 },
      { username: "FutureNinja", points: 190, streak_days: 25 }
    ]);

    setTopWeekly([
      { username: "GamingChamp", points: 485, streak_days: 15 },
      { username: "LevelUpKing", points: 468, streak_days: 12 },
      { username: "XPCollector", points: 445, streak_days: 18 },
      { username: "DailyGrind", points: 432, streak_days: 14 },
      { username: "PointMaster", points: 415, streak_days: 16 }
    ]);

    setQuizChampions([
      { username: "TriviaMaster", points: 820, streak_days: 10 },
      { username: "KnowledgeWizard", points: 795, streak_days: 8 },
      { username: "FunFactFan", points: 765, streak_days: 12 },
      { username: "GameScholar", points: 740, streak_days: 7 },
      { username: "QuizWhiz", points: 710, streak_days: 9 }
    ]);
  }

  const LeaderboardTable = ({
    title,
    icon: Icon,
    data,
    field,
    color
  }: {
    title: string;
    icon: any;
    data: LeaderboardEntry[];
    field: keyof LeaderboardEntry;
    color: string;
  }) => (
    <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
      <CardHeader>
        <CardTitle className={`flex items-center text-${color} text-lg`}>
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((entry, index) => (
            <div
              key={`${entry.username}-${index}`}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${index < 3 ? 'bg-primary/10 border border-primary/20' : 'bg-white/5'}
                transition-all duration-200 hover:bg-white/10
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-600/20 text-orange-400' :
                    'bg-white/20 text-white/60'}
                  font-bold text-sm
                `}>
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{entry.username}</div>
                  <div className="text-white/50 text-xs">
                    {field === 'streak_days' ? `${entry[field]} day streak` : `${entry[field]} points`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-${color} font-bold`}>
                  {field === 'points' ? entry[field] : entry[field]}
                </div>
                {field === 'points' && entry.points > 100 && (
                  <div className="text-green-400 text-xs">🔥 Hot</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse text-primary">Loading leaderboards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent mb-2">
          🏆 Gaming Leaderboards
        </h1>
        <p className="text-white/70">See who's leading the gaming community!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeaderboardTable
          title="Longest Streaks"
          icon={Flame}
          data={topStreaks}
          field="streak_days"
          color="orange-500"
        />

        <LeaderboardTable
          title="Top Weekly Earners"
          icon={Target}
          data={topWeekly}
          field="points"
          color="primary"
        />

        <LeaderboardTable
          title="Quiz Champions"
          icon={Trophy}
          data={quizChampions}
          field="points"
          color="yellow-500"
        />
      </div>

      {/* User's Rank Card */}
      <Card className="border-white/10 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-white/70 mb-2">Your Rank</div>
            <div className="text-2xl font-bold text-primary">#127</div>
            <div className="text-white/50 text-sm">Current: 2,450 points</div>
            <div className="text-green-400 text-xs mt-1">↗️ +45 from yesterday</div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Footer */}
      <div className="text-center text-white/50 text-sm">
        Keep earning and climb the rankings! 🎮
      </div>
    </div>
  );
}