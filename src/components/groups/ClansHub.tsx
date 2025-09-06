import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown, UserPlus, Swords } from "lucide-react";

interface Clan {
  id: string;
  name: string;
  description: string;
  member_count: number;
  created_by: string;
  level: number;
}

export default function ClansHub() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClans();
  }, []);

  async function fetchClans() {
    // Mock data for demo
    const mockClans: Clan[] = [
      {
        id: "1",
        name: "Rockstar Warriors",
        description: "Elite GTA 6 players united",
        member_count: 45,
        created_by: "GTA6King",
        level: 12
      },
      {
        id: "2",
        name: "Quiz Masters",
        description: "Knowledge sharpeners & trivia champs",
        member_count: 28,
        created_by: "TriviaGod",
        level: 8
      },
      {
        id: "3",
        name: "PC Gaming Elite",
        description: "High-performance gaming group",
        member_count: 67,
        created_by: "PCWizard",
        level: 15
      }
    ];
    setClans(mockClans);
    setLoading(false);
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading clans...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Gaming Clans & Groups | GameXBuddy</title>
        <link rel="canonical" href={canonical("/clans")} />
        <meta name="description" content="Join gaming clans and groups to connect with fellow players, compete in tournaments, and earn exclusive rewards." />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🛡️ Gaming Clans & Groups
          </h1>
          <p className="text-white/70 mt-2">Connect with fellow gamers, compete as a team!</p>
        </div>

        <div className="flex justify-center">
          <Button variant="neon" size="lg">
            🆕 Create New Clan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clans.map((clan) => (
            <Card
              key={clan.id}
              className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Crown className="w-5 h-5" />
                  {clan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70 text-sm">{clan.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{clan.member_count} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Swords className="w-4 h-4" />
                    <span>Level {clan.level}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Join Clan
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-white/10 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Clan Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>🏆 Exclusive tournaments</div>
              <div>💰 Shared earnings</div>
              <div>🎉 Community events</div>
              <div>🔓 Premium perks</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}