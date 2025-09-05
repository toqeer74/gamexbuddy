import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Trophy,
  TrendingUp,
  Mail,
  FileText,
  Settings,
  BarChart3,
  Zap,
  Clock,
  Target
} from 'lucide-react';

// Mock data - replace with real API calls
const mockStats = {
  totalUsers: 1248,
  activeUsers: 892,
  totalPoints: 45632,
  newsletterSubs: 456,
  aiRequests: 1247,
  unreadFeedback: 23
};

const mockEarningActivity = [
  { time: '2m ago', user: 'PlayerX', action: 'Download', points: 50, platform: 'PC' },
  { time: '5m ago', user: 'GamerY', action: 'Post', points: 25, platform: 'Mobile' },
  { time: '8m ago', user: 'CaserZ', action: 'Browse', points: 10, platform: 'Web' },
  { time: '12m ago', user: 'EliteA', action: 'Newsletter', points: 30, platform: 'Web' },
];

const mockNewsletterStats = {
  totalSubs: 456,
  confirmed: 412,
  pending: 44,
  unsubscribed: 12,
  openRate: 67,
  clickRate: 23,
  growth: '+12%'
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [stats, setStats] = useState(mockStats);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + Math.floor(Math.random() * 10),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3 - 1),
        aiRequests: prev.aiRequests + Math.floor(Math.random() * 5)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{title}</p>
            <p className="text-2xl font-bold text-primary animate-pulse-glow">{value.toLocaleString()}</p>
            {trend && (
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-${color}/20 text-${color} animate-logo-glow`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
              GameXBuddy Admin Hub
            </h1>
            <p className="text-white/70 mt-2">Real-time platform insights and management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-primary/20 text-primary hover:border-primary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="neon">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="+8.2%"
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Zap}
            trend="+12%"
            color="green"
          />
          <StatCard
            title="Points Earned"
            value={stats.totalPoints}
            icon={Trophy}
            trend="+15%"
            color="yellow"
          />
          <StatCard
            title="Newsletter Subs"
            value={stats.newsletterSubs}
            icon={Mail}
            trend="+5.1%"
            color="pink"
          />
          <StatCard
            title="AI Requests"
            value={stats.aiRequests}
            icon={Target}
            trend="+22%"
            color="cyan"
          />
          <StatCard
            title="Feedback Items"
            value={stats.unreadFeedback}
            icon={FileText}
            color="orange"
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/50 border border-white/10">
            <TabsTrigger value="overview" className="text-primary data-[state=active]:bg-primary/20">Overview</TabsTrigger>
            <TabsTrigger value="earnings" className="text-primary data-[state=active]:bg-primary/20">Earnings</TabsTrigger>
            <TabsTrigger value="users" className="text-primary data-[state=active]:bg-primary/20">Users</TabsTrigger>
            <TabsTrigger value="content" className="text-primary data-[state=active]:bg-primary/20">Content</TabsTrigger>
            <TabsTrigger value="newsletter" className="text-primary data-[state=active]:bg-primary/20">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">

            {/* Recent Activity */}
            <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Earning Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEarningActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-white/60">{activity.time} • {activity.platform}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary font-medium">+{activity.points} pts</p>
                        <p className="text-xs text-white/60">{activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="earnings" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Earning Breakdown */}
              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary">Earning Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Downloads</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-[#ff2bd6] to-[#8b5cf6] rounded-full"></div>
                      </div>
                      <span className="ml-2 text-primary font-bold">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Community</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-gradient-to-r from-[#00f5ff] to-[#ff006e] rounded-full"></div>
                      </div>
                      <span className="ml-2 text-primary font-bold">50%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Newsletter</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] rounded-full"></div>
                      </div>
                      <span className="ml-2 text-primary font-bold">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Earners */}
              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary">Top Earners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['EliteGamer', 'ProPlayer', 'CasualUser', 'BotMaster', 'TinyTot'].map((user, index) => (
                      <div key={user} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm px-2 py-1 rounded bg-primary text-primary-foreground`}>
                            #{index + 1}
                          </span>
                          <span className="text-white/90">{user}</span>
                        </div>
                        <span className="text-primary font-bold">
                          {Math.floor(Math.random() * 200 + 100)} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
              <CardHeader>
                <CardTitle className="text-primary">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Button variant="outline" size="sm">Export Users</Button>
                  <Button variant="outline" size="sm">Bulk Email</Button>
                  <Button variant="neon" size="sm">Add User</Button>
                </div>
                <div className="text-center py-8 text-white/50">
                  User management interface - Connect to backend API
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
              <CardHeader>
                <CardTitle className="text-primary">Content Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-white/50">
                  Content moderation tools - Memes, posts, comments
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    📧 Newsletter Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{mockNewsletterStats.totalSubs}</p>
                      <p className="text-xs text-white/70">Total Subscribers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{mockNewsletterStats.confirmed}</p>
                      <p className="text-xs text-white/70">Confirmed</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Open Rate</span>
                    <span className="text-primary font-bold">{mockNewsletterStats.openRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Click Rate</span>
                    <span className="text-primary font-bold">{mockNewsletterStats.clickRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary">SendGrid Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="neon" className="w-full">
                    Create Campaign
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Templates
                  </Button>
                  <div className="text-center py-4">
                    <p className="text-xs text-white/50">SendGrid Status: ✅ Connected</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}