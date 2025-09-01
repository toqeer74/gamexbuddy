import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import CountdownTimer from "@/components/common/CountdownTimer";
import TrailerEmbed from "@/components/common/TrailerEmbed";
import NewsCard from "@/components/common/NewsCard";
import GameHubCard from "@/components/common/GameHubCard";
import CommunityContentCard from "@/components/common/CommunityContentCard";
import HorizontalCarousel from "@/components/common/HorizontalCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Blocks, Swords, MessageSquare } from "lucide-react"; // Import MessageSquare for Discord button
import { fetchRockstarNews, fetchRedditMemes } from "@/lib/api";

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
  isTrending?: boolean;
  authorAvatarUrl?: string;
  authorName?: string;
}

const Index = () => {
  const [newsHighlights, setNewsHighlights] = React.useState<NewsHighlight[]>([]);
  const [communityHighlights, setCommunityHighlights] = React.useState<CommunityHighlight[]>([]);
  const [email, setEmail] = React.useState("");
  const [telegramOptIn, setTelegramOptIn] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      const news = await fetchRockstarNews();
      setNewsHighlights(news.slice(0, 6));

      const memes = await fetchRedditMemes();
      setCommunityHighlights(memes.slice(0, 3));
    };
    loadData();
  }, []);

  const gta6ReleaseDate = "2025-12-01T00:00:00Z";

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter Signup:", { email, telegramOptIn });
    alert("Thank you for signing up! (Check console for details)");
    setEmail("");
    setTelegramOptIn(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground"
         style={{ backgroundImage: "radial-gradient(at 50% 0%, hsl(var(--primary)) 0%, transparent 70%), radial-gradient(at 0% 100%, hsl(var(--secondary)) 0%, transparent 70%)", backgroundAttachment: "fixed" }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-pink-600 via-purple-700 to-cyan-700 overflow-hidden py-20">
        {/* Glow background or GTA skyline */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1612287235008-377e72169f46?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        ></div>

        <div className="relative z-10 container">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg">
            GamexBuddy
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            Your ultimate <span className="text-pink-400 font-bold">GTA6</span> & gaming hub
          </p>

          {/* Countdown */}
          <div className="mt-8 mb-10">
            <CountdownTimer targetDate={gta6ReleaseDate} />
          </div>

          {/* Trailer */}
          <div className="mt-12 relative z-10 max-w-4xl w-full mx-auto backdrop-blur bg-white/10 rounded-2xl border border-white/20 shadow-xl
                        hover:shadow-cyan-500/70 hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.9)] transition-all duration-300">
            <TrailerEmbed youtubeId="QdBZY2fkU-0" title="GTA6 Official Trailer" />
          </div>

          {/* CTA */}
          <Link to="/community">
            <Button className="mt-10 px-8 py-3 rounded-full bg-pink-500 text-white font-bold shadow-lg hover:bg-pink-600 transition transform hover:scale-105 animate-pulse-glow">
              Join the Community
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest News */}
      <section className="container py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Latest News Highlights</h2>
        <HorizontalCarousel className="max-w-full mx-auto">
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
        </HorizontalCarousel>
      </section>

      {/* Quick Links to Game Hubs */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-12">Explore Our Game Hubs</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <GameHubCard
              title="GTA6 Hub"
              imageUrl="https://images.unsplash.com/photo-1612287235008-377e72169f46?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Vice City skyline
              link="/gta6-hub"
              icon={<Gamepad2 size={64} />}
            />
            <GameHubCard
              title="Minecraft Hub"
              imageUrl="https://images.unsplash.com/photo-1621929798704-0212f827923d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Pixelated grass block
              link="/minecraft-hub"
              icon={<Blocks size={64} />}
            />
            <GameHubCard
              title="PUBG Hub"
              imageUrl="https://images.unsplash.com/photo-1586182987400-31e826265b07?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Desert battleground
              link="/pubg-hub"
              icon={<Swords size={64} />}
            />
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="bg-gray-900 text-white py-16">
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
                isTrending={item.isTrending}
                authorAvatarUrl={item.authorAvatarUrl}
                authorName={item.authorName}
              />
            ))}
          </div>
          <div className="mt-12">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <Button className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105 flex items-center gap-2
                                 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]">
                <MessageSquare className="h-5 w-5" /> Join our Discord
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container py-16">
        <Card className="max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md shadow-lg relative overflow-hidden rounded-xl border border-white/20
                        drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {/* Faded gaming background image */}
          <div
            className="absolute inset-0 opacity-10 z-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38148e7fd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Blurred GTA-style background
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="relative z-10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Join Our Newsletter!</CardTitle>
              <p className="text-gray-300">
                Get the latest gaming news, updates, and exclusive content directly to your inbox.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-left block mb-1 text-cyan-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="enter your email here..."
                    className="mt-1 rounded-lg border-2 border-cyan-500 bg-background/20 text-cyan-300
                               focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background
                               shadow-inner shadow-cyan-500/20 placeholder:text-cyan-300/70"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="telegram-optin"
                    className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white"
                    checked={telegramOptIn}
                    onCheckedChange={(checked) => setTelegramOptIn(!!checked)}
                  />
                  <Label htmlFor="telegram-optin" className="text-gray-300">
                    Opt-in for Telegram updates (optional)
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg text-lg py-3 bg-gradient-to-r from-pink-600 to-cyan-500 text-white font-bold
                             hover:from-pink-700 hover:to-cyan-600 transition-all duration-300
                             shadow-lg shadow-pink-600/50 hover:shadow-xl hover:shadow-cyan-500/70
                             drop-shadow-[0_0_10px_rgba(236,72,153,0.7)] hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.9)]"
                >
                  Start
                </Button>
              </form>
            </CardContent>
          </div>
        </Card>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Index;