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
import { fetchRockstarNews, fetchRedditMemes } from "@/lib/api"; // Import API functions

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
      setNewsHighlights(news.slice(0, 3)); // Display top 3 news items

      const memes = await fetchRedditMemes();
      setCommunityHighlights(memes.slice(0, 3)); // Display top 3 memes
    };
    loadData();
  }, []);

  const gta6ReleaseDate = "2025-12-01T00:00:00Z"; // Placeholder for GTA6 release date

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter Signup:", { email, telegramOptIn });
    alert("Thank you for signing up! (Check console for details)");
    // In a real application, you would send this data to a backend service
    // like Mailchimp, Brevo, or MailerLite here.
    setEmail("");
    setTelegramOptIn(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative text-center py-20 bg-gradient-to-br from-purple-800 via-pink-600 to-cyan-600 text-white overflow-hidden">
        {/* Background glow effect - using a placeholder image for now */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Vice+City+Skyline')" }}
        ></div>

        <div className="relative z-10 container">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            GamexBuddy
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Stay updated with <span className="font-bold text-pink-400">GTA6</span>, explore hubs, and join the community.
          </p>

          {/* Countdown */}
          <div className="mb-10">
            <CountdownTimer targetDate={gta6ReleaseDate} />
          </div>

          {/* Trailer */}
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl backdrop-blur bg-white/10 border border-white/20
                        hover:shadow-cyan-500/70 hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.9)] transition-all duration-300">
            <TrailerEmbed youtubeId="QdBZY2fkU-0" title="GTA6 Official Trailer" />
          </div>
        </div>
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

      {/* Newsletter Signup */}
      <section className="container py-16">
        <Card className="max-w-2xl mx-auto p-8 bg-card shadow-lg relative overflow-hidden rounded-xl">
          {/* Faded gaming background image */}
          <div
            className="absolute inset-0 opacity-10 z-0"
            style={{
              backgroundImage: "url('https://via.placeholder.com/800x400/000000/FFFFFF?text=Pixel+Pattern')",
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
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-left block mb-1 text-primary">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="enter your command here..."
                    className="mt-1 rounded-lg border-2 border-cyan-500 bg-background text-cyan-300
                               focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background
                               shadow-inner shadow-cyan-500/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="telegram-optin"
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    checked={telegramOptIn}
                    onCheckedChange={(checked) => setTelegramOptIn(!!checked)}
                  />
                  <Label htmlFor="telegram-optin" className="text-muted-foreground">
                    Opt-in for Telegram updates (optional)
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg text-lg py-3 bg-green-600 hover:bg-green-700 transition-all duration-300
                             shadow-lg shadow-green-600/50 hover:shadow-xl hover:shadow-green-700/70
                             drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]"
                >
                  Start
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
                isTrending={item.isTrending}
                authorAvatarUrl={item.authorAvatarUrl}
                authorName={item.authorName}
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