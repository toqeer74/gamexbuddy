import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import CountdownTimer from "@/components/common/CountdownTimer";
import TrailerEmbed from "@/components/common/TrailerEmbed";
import NewsCard from "@/components/common/NewsCard";
import GameHubCard from "@/components/common/GameHubCard";
import CommunityContentCard from "@/components/common/CommunityContentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Blocks, Swords } from "lucide-react";

interface NewsHighlight {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  isOfficial?: boolean;
}

interface CommunityHighlight {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  type: "meme" | "quiz" | "discussion";
  xp?: number;
}

const Index = () => {
  // Placeholder for GTA6 release date (example: December 1, 2025)
  const gta6ReleaseDate = "2025-12-01T00:00:00Z";

  // Placeholder news data
  const newsHighlights: NewsHighlight[] = [
    {
      id: "1",
      title: "Rockstar Confirms GTA6 Release Window",
      description: "Official announcement details the highly anticipated launch period.",
      imageUrl: "https://via.placeholder.com/400x225/000000/FFFFFF?text=GTA6+News+1",
      link: "/gta6-hub",
      isOfficial: true,
    },
    {
      id: "2",
      title: "New Trailer Breakdown: What You Missed!",
      description: "Deep dive into the latest GTA6 trailer's hidden details and Easter eggs.",
      imageUrl: "https://via.placeholder.com/400x225/000000/FFFFFF?text=GTA6+News+2",
      link: "/gta6-hub",
      isOfficial: false,
    },
    {
      id: "3",
      title: "Community Reacts to Vice City Return",
      description: "Fans are ecstatic about the return to the iconic Vice City setting.",
      imageUrl: "https://via.placeholder.com/400x225/000000/FFFFFF?text=GTA6+News+3",
      link: "/gta6-hub",
      isOfficial: false,
    },
  ];

  // Placeholder community content data
  const communityHighlights: CommunityHighlight[] = [
    {
      id: "1",
      title: "Top 5 Gaming Memes This Week",
      description: "Hilarious memes from the gaming community!",
      imageUrl: "https://via.placeholder.com/400x225/000000/FFFFFF?text=Meme+1",
      link: "/community",
      type: "meme",
      xp: 150,
    },
    {
      id: "2",
      title: "Are You a True Gamer? Take Our Quiz!",
      description: "Test your knowledge with our latest gaming quiz.",
      imageUrl: "https://via.placeholder.com/400x225/000000/FFFFFF?text=Quiz+1",
      link: "/community",
      type: "quiz",
      xp: 200,
    },
    {
      id: "3",
      title: "Discussion: What's Your Most Anticipated Game?",
      description: "Join the debate and share your thoughts!",
      imageUrl: "https://via.placeholder.com/400x225/000000/FFFFFF?text=Discussion+1",
      link: "/community",
      type: "discussion",
      xp: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 py-20 text-white overflow-hidden">
        <div className="container text-center z-10 relative">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            GamexBuddy: Your Ultimate Gaming Hub
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Stay updated with GTA6, explore other game hubs, and connect with a vibrant community!
          </p>
          <CountdownTimer targetDate={gta6ReleaseDate} />
          <div className="mt-12 max-w-4xl mx-auto">
            <TrailerEmbed youtubeId="QdBZY2fkU-0" title="GTA 6 Official Trailer 1" /> {/* Corrected YouTube ID */}
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      </section>

      {/* News Highlights */}
      <section className="container py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Latest News Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsHighlights.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              description={news.description}
              imageUrl={news.imageUrl}
              link={news.link}
              isOfficial={news.isOfficial}
            />
          ))}
        </div>
      </section>

      {/* Quick Links to Game Hubs */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-12">Explore Our Game Hubs</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <GameHubCard
              title="GTA6 Hub"
              imageUrl="https://via.placeholder.com/100x100/FF0000/FFFFFF?text=GTA6"
              link="/gta6-hub"
              icon={<Gamepad2 size={64} />}
            />
            <GameHubCard
              title="Minecraft Hub"
              imageUrl="https://via.placeholder.com/100x100/00FF00/FFFFFF?text=MC"
              link="/minecraft-hub"
              icon={<Blocks size={64} />}
            />
            <GameHubCard
              title="PUBG Hub"
              imageUrl="https://via.placeholder.com/100x100/FFA500/FFFFFF?text=PUBG"
              link="/pubg-hub"
              icon={<Swords size={64} />}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container py-16">
        <Card className="max-w-2xl mx-auto p-8 bg-card shadow-lg relative overflow-hidden">
          {/* Faded gaming background image */}
          <div
            className="absolute inset-0 opacity-10 z-0"
            style={{
              backgroundImage: "url('https://via.placeholder.com/800x400/000000/FFFFFF?text=Gaming+Pattern')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="relative z-10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4">Join Our Newsletter!</CardTitle>
              <p className="text-muted-foreground">
                Get the latest gaming news, updates, and exclusive content directly to your inbox.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@example.com" className="mt-1 rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="telegram-optin" />
                  <Label htmlFor="telegram-optin">
                    Opt-in for Telegram updates (optional)
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg text-lg py-3 bg-primary hover:bg-primary/90 transition-all duration-300
                             shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70"
                >
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Community Preview */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-12">From Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityHighlights.map((item) => (
              <CommunityContentCard
                key={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                link={item.link}
                type={item.type}
                xp={item.xp}
              />
            ))}
          </div>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Index;