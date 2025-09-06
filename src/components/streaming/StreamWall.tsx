import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, Heart } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  streamer: string;
  game: string;
  platform: "twitch" | "youtube";
  viewers: number;
  thumbnail: string;
  live: boolean;
}

export default function StreamWall() {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    // Mock streams
    const mockStreams: Stream[] = [
      {
        id: "1",
        title: "GTA 6 Watch Party - Let's Speculate!",
        streamer: "GTA6_Official",
        game: "Grand Theft Auto VI",
        platform: "twitch",
        viewers: 12500,
        live: true,
        thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "2",
        title: "Pro Quiz Tournament - High Stakes",
        streamer: "QuizChampion",
        game: "Trivia & Quiz Games",
        platform: "twitch",
        viewers: 3400,
        live: true,
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "3",
        title: "Gaming Let's Play - New Release",
        streamer: "GameMaster",
        game: "Various Games",
        platform: "youtube",
        viewers: 8900,
        live: true,
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "4",
        title: "PC Building Tutorial Series",
        streamer: "TechWizard",
        game: "PC Gaming Hardware",
        platform: "youtube",
        viewers: 5600,
        live: true,
        thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "5",
        title: "Esports Tournament Live",
        streamer: "ProLeague",
        game: "Competitive Gaming",
        platform: "twitch",
        viewers: 45000,
        live: true,
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "6",
        title: "Gamer Profile & Setup Tour",
        streamer: "SetupShowcase",
        game: "Gaming Lifestyle",
        platform: "youtube",
        viewers: 2300,
        live: false,
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop"
      }
    ];
    setStreams(mockStreams);
  }, []);

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <>
      <Helmet>
        <title>Live Gaming Streams | Watch Top Gamers | GameXBuddy</title>
        <link rel="canonical" href={canonical("/streams")} />
        <meta name="description" content="Watch live gaming streams from top twitch and youtube gamers. GTA 6, esports tournaments, PC gaming, and more!" />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            📺 Live Gaming Streams
          </h1>
          <p className="text-white/70 mt-2">Watch your favorite gamers live and never miss important moments</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button variant="neon">All Streams</Button>
          <Button variant="outline" disabled>GTA 6</Button>
          <Button variant="outline" disabled>Esports</Button>
          <Button variant="outline" disabled>Lets Play</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <Card
              key={stream.id}
              className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-full object-cover"
                />
                {stream.live && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  <Eye className="w-3 h-3 inline mr-1" />
                  {formatViewers(stream.viewers)}
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button variant="neon" size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    {stream.live ? 'Watch Live' : 'Watch Now'}
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      stream.platform === "twitch"
                        ? "border-purple-500 text-purple-400"
                        : "border-red-500 text-red-400"
                    }
                  >
                    {stream.platform}
                  </Badge>
                  <span className="text-xs text-white/60">{stream.game}</span>
                </div>
                <CardTitle className="text-sm leading-tight text-white">{stream.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{stream.streamer}</span>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Heart className="w-3 h-3" />
                    <span>Follow</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">💫 Stream Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-purple-500/20 rounded-full mb-2">
                  <Play className="w-6 h-6 text-purple-400" />
                </div>
                <strong className="text-purple-400">Live Gaming</strong>
                <p className="text-white/70">Watch top gamers in action</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-pink-500/20 rounded-full mb-2">
                  <Eye className="w-6 h-6 text-pink-400" />
                </div>
                <strong className="text-pink-400">Real-time Chat</strong>
                <p className="text-white/70">Interact with streamers & community</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-cyan-500/20 rounded-full mb-2">
                  <Heart className="w-6 h-6 text-cyan-400" />
                </div>
                <strong className="text-cyan-400">Follow Favorites</strong>
                <p className="text-white/70">Never miss your favorite creators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}