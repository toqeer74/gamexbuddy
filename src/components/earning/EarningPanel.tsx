import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EarningActivity {
  user_id: string;
  activity_type: string;
  points_earned: number;
  metadata?: Record<string, string | number | boolean>;
}

export default function EarningPanel() {
  const [points, setPoints] = useState(0);
  const [activities, setActivities] = useState<EarningActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = "demo-user"; // In real app, get from auth

  // Fetch user's earning data
  const fetchEarnings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/earning/user/${userId}`);
      const data = await response.json();
      setPoints(data.total_points || 0);
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  // Earn from surfing
  const earnFromSurf = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/earning/surf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId)
      });
      const data = await response.json();
      setPoints(data.total_points);
      setActivities(prev => [data.activity, ...prev]);
    } catch (error) {
      console.error('Earn surf failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Earn from community interaction
  const earnFromCommunity = async (activityType: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/earning/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, activity_type: activityType })
      });
      const data = await response.json();
      setPoints(data.total_points);
      setActivities(prev => [data.activity, ...prev]);
    } catch (error) {
      console.error('Earn community failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">🎮 GameXBuddy Earning Hub</CardTitle>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary animate-pulse-glow">
              {points.toLocaleString()}
            </div>
            <p className="text-secondary-foreground">Total Points Earned</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Earning Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Button
              variant="neon"
              onClick={earnFromSurf}
              disabled={loading}
              className="w-full text-white"
              size="lg"
            >
              🌐 Browse & Earn
            </Button>

            <Button
              variant="neonGlow"
              onClick={earnFromSurf}
              disabled={loading}
              className="w-full text-white"
              size="lg"
            >
              📱 Surf Content
            </Button>

          </div>

          {/* Community Interactions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="cyber"
              onClick={() => earnFromCommunity('post')}
              disabled={loading}
              className="text-white"
            >
              📝 Post
            </Button>

            <Button
              variant="cyber"
              onClick={() => earnFromCommunity('comment')}
              disabled={loading}
              className="text-white"
            >
              💬 Comment
            </Button>

            <Button
              variant="cyber"
              onClick={() => earnFromCommunity('like')}
              disabled={loading}
              className="text-white"
            >
              ❤️ Like
            </Button>

            <Button
              variant="cyber"
              onClick={() => earnFromCommunity('share')}
              disabled={loading}
              className="text-white"
            >
              🔗 Share
            </Button>
          </div>

          {/* Recent Activities */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-primary">Recent Activities</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm">
                    {activity.activity_type === 'surf' && '🌐 Browse'}
                    {activity.activity_type === 'community' && `📱 ${activity.metadata?.interaction_type}`}
                    {activity.activity_type === 'download' && '📥 Download'}
                    {activity.activity_type === 'newsletter' && '✉️ Newsletter'}
                  </span>
                  <span className="text-primary font-medium">
                    +{activity.points_earned} pts
                  </span>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No activities yet. Start earning points!
                </p>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}