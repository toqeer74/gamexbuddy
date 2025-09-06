import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, DollarSign, Crown, Gamepad2, Play } from "lucide-react";

interface Tournament {
  id: string;
  title: string;
  game: string;
  status: "upcoming" | "registration" | "live" | "completed";
  startDate: string;
  prize: number;
  entryFee: number;
  maxPlayers: number;
  registered: number;
  sponsor: string;
}

export default function TournamentHub() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    // Mock tournament data
    const mockTournaments: Tournament[] = [
      {
        id: "1",
        title: "GTA 6 Championship 2024",
        game: "Grand Theft Auto VI",
        status: "registration",
        startDate: "2024-12-15T18:00:00Z",
        prize: 50000,
        entryFee: 25,
        maxPlayers: 128,
        registered: 89,
        sponsor: "Rockstar Games"
      },
      {
        id: "2",
        title: "Quiz Masters Weekly",
        game: "Trivia Games",
        status: "live",
        startDate: "2024-12-10T20:00:00Z",
        prize: 1500,
        entryFee: 5,
        maxPlayers: 64,
        registered: 64,
        sponsor: "GameXBuddy"
      },
      {
        id: "3",
        title: "Esports Showdown",
        game: "Multiple Games",
        status: "upcoming",
        startDate: "2024-12-20T15:00:00Z",
        prize: 10000,
        entryFee: 0,
        maxPlayers: 256,
        registered: 134,
        sponsor: "Intel Gaming"
      },
      {
        id: "4",
        title: "PC Gaming Elite Cup",
        game: "Competitive Gaming",
        status: "completed",
        startDate: "2024-12-01T16:00:00Z",
        prize: 2500,
        entryFee: 10,
        registered: 96,
        maxPlayers: 96,
        sponsor: "NVIDIA"
      }
    ];
    setTournaments(mockTournaments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "registration": return "bg-green-500";
      case "upcoming": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrize = (amount: number) => {
    return amount >= 1000 ? `$${(amount / 1000).toFixed(0)}K` : `$${amount}`;
  };

  return (
    <>
      <Helmet>
        <title>Esports Tournaments | Enter Gaming Competitions | GameXBuddy</title>
        <link rel="canonical" href={canonical("/tournaments")} />
        <meta name="description" content="Join competitive gaming tournaments with entry fees, massive prizes, and sponsor rewards. From GTA 6 competition to quiz championships!" />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🏆 Esports Tournaments
          </h1>
          <p className="text-white/70 mt-2">Compete for prizes, prove your skills, and earn glory</p>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <Button variant="neon">All Tournaments</Button>
          <Button variant="outline" disabled>Live Now</Button>
          <Button variant="outline" disabled>Registration Open</Button>
          <Button variant="outline" disabled>My Tournaments</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(tournament.status)} text-white px-2 py-1 text-xs font-bold`}>
                    {tournament.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg">{tournament.title}</CardTitle>
                <div className="text-white/70 text-sm">{tournament.game}</div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded">
                    <div className="text-primary font-bold text-lg">{formatPrize(tournament.prize)}</div>
                    <div className="text-white/60 text-xs">Prize Pool</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <div className="text-green-400 font-bold text-lg">${tournament.entryFee}</div>
                    <div className="text-white/60 text-xs">Entry Fee</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{tournament.registered}/{tournament.maxPlayers} players</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>{tournament.sponsor}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {tournament.status === "registration" && (
                    <Button variant="neon" className="w-full">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Join Tournament - ${tournament.entryFee}
                    </Button>
                  )}
                  {tournament.status === "live" && (
                    <Button variant="destructive" className="w-full" disabled>
                      <Play className="w-4 h-4 mr-2" />
                      Live Now - Spectating Available
                    </Button>
                  )}
                  {tournament.status === "completed" && (
                    <Button variant="outline" className="w-full" disabled>
                      <Trophy className="w-4 h-4 mr-2" />
                      Tournament Completed
                    </Button>
                  )}
                  {tournament.status === "upcoming" && (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Prize Distribution
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>🥇 1st Place</span>
                  <span className="text-yellow-400 font-bold">60%</span>
                </div>
                <div className="flex justify-between">
                  <span>🥈 2nd Place</span>
                  <span className="text-gray-300 font-bold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>🥉 3rd Place</span>
                  <span className="text-orange-400 font-bold">15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Benefits & Perks
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                  Exclusive streaming access
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                  Profile badges & titles
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                  Sponsor rewards & giveaways
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                  Community recognition
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}