import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Target,
  MessageSquare,
  Heart,
  Zap,
  Activity
} from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionTime: number;
  topContentViews: Array<{
    title: string;
    views: number;
    engagement: number;
  }>;
  userBehavior: Array<{
    action: string;
    count: number;
    trend: number;
  }>;
  engagementMetrics: {
    commentsPerUser: number;
    reactionsPerUser: number;
    timeOnSite: number;
    bounceRate: number;
  };
}

export default function UserAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);

    // In a real implementation, this would fetch from your analytics API
    // For now, using mock data
    setTimeout(() => {
      setAnalytics({
        totalUsers: 2847,
        activeUsers: 1250,
        totalSessions: 8920,
        averageSessionTime: 7.2,
        topContentViews: [
          { title: "GTA6 Release Date Update", views: 2450, engagement: 34 },
          { title: "Best Fortnite Tips 2025", views: 1890, engagement: 28 },
          { title: "Gaming PC Build Guide", views: 1567, engagement: 41 },
          { title: "Meme Wall Highlights", views: 1234, engagement: 67 },
          { title: "Gaming News Roundup", views: 987, engagement: 23 }
        ],
        userBehavior: [
          { action: "Page Views", count: 15420, trend: 12 },
          { action: "Comments", count: 892, trend: 23 },
          { action: "Reactions", count: 3456, trend: 15 },
          { action: "Shares", count: 234, trend: 8 },
          { action: "Downloads", count: 567, trend: 31 }
        ],
        engagementMetrics: {
          commentsPerUser: 1.8,
          reactionsPerUser: 4.2,
          timeOnSite: 7.2,
          bounceRate: 42.8
        }
      });
      setLoading(false);
    }, 1000);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "primary",
    suffix = ""
  }: {
    title: string;
    value: number | string;
    icon: any;
    trend?: number;
    color?: string;
    suffix?: string;
  }) => (
    <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{title}</p>
            <p className="text-2xl font-bold text-primary animate-pulse-glow">
              {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            {trend !== undefined && (
              <p className={`text-xs flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}% from last {timeRange}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">
          <Activity className="w-8 h-8 animate-spin" />
          <p className="mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            📊 User Analytics Dashboard
          </h1>
          <p className="text-white/70 mt-2">Deep insights into gaming community behavior</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'neon' : 'outline'}
            onClick={() => setTimeRange('7d')}
            size="sm"
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'neon' : 'outline'}
            onClick={() => setTimeRange('30d')}
            size="sm"
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'neon' : 'outline'}
            onClick={() => setTimeRange('90d')}
            size="sm"
          >
            90 Days
          </Button>
        </div>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={analytics.totalUsers}
              icon={Users}
              trend={8.2}
            />
            <StatCard
              title="Active Users"
              value={analytics.activeUsers}
              icon={Zap}
              trend={12.5}
            />
            <StatCard
              title="Total Sessions"
              value={analytics.totalSessions}
              icon={Target}
              trend={15.8}
            />
            <StatCard
              title="Avg Session Time"
              value={analytics.averageSessionTime}
              icon={Clock}
              trend={5.2}
              suffix="m"
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-white/10">
              <TabsTrigger value="overview" className="text-primary data-[state=active]:bg-primary/20">Overview</TabsTrigger>
              <TabsTrigger value="content" className="text-primary data-[state=active]:bg-primary/20">Content</TabsTrigger>
              <TabsTrigger value="engagement" className="text-primary data-[state=active]:bg-primary/20">Engagement</TabsTrigger>
              <TabsTrigger value="behavior" className="text-primary data-[state=active]:bg-primary/20">User Behavior</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Top Content Performance */}
              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Top Performing Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topContentViews.map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium">{content.title}</p>
                          <p className="text-white/60 text-sm">{content.views.toLocaleString()} views</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-bold">{content.engagement}%</p>
                          <p className="text-white/60 text-xs">engagement</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Comments/User"
                  value={analytics.engagementMetrics.commentsPerUser}
                  icon={MessageSquare}
                  trend={18.5}
                />
                <StatCard
                  title="Reactions/User"
                  value={analytics.engagementMetrics.reactionsPerUser}
                  icon={Heart}
                  trend={22.3}
                />
                <StatCard
                  title="Avg. Time on Site"
                  value={analytics.engagementMetrics.timeOnSite}
                  icon={Clock}
                  trend={-8.1}
                  suffix="m"
                />
                <StatCard
                  title="Bounce Rate"
                  value={analytics.engagementMetrics.bounceRate}
                  icon={TrendingUp}
                  trend={-5.2}
                  suffix="%"
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-6">
              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary">Content Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-white/50">
                    <BarChart3 className="w-8 h-8 mr-2" />
                    Content analytics chart would appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6 mt-6">
              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary">Community Engagement Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-white/50">
                    <Users className="w-8 h-8 mr-2" />
                    Engagement heatmap would appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6 mt-6">
              <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-primary">User Behavior Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analytics.userBehavior.map((behavior, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium">{behavior.action}</p>
                          <span className="text-primary font-bold">{behavior.count.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(behavior.count / 20000 * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-white/60 text-sm mt-1">
                          +{behavior.trend}% vs last period
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

        </>
      )}

    </div>
  );
}