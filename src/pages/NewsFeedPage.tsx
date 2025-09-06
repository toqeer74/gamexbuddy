import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { newsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Clock, ExternalLink, TrendingUp } from "lucide-react";

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export default function NewsFeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getGamingNews({
        q: "gaming OR video games OR esports OR gaming industry",
        pageSize: 20,
        sortBy: "publishedAt"
      });
      if (response.articles) {
        setArticles(response.articles.slice(0, 12)); // Limit to 12 articles
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      // Fallback data with sample gaming news
      setArticles([
        {
          source: { id: null, name: "IGN" },
          author: "GameXBuddy Team",
          title: "GTA 6 Release Date Finally Announced",
          description: "Rockstar Games confirms Fall 2025 release for Grand Theft Auto 6",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop",
          publishedAt: "2024-12-01T10:00:00Z",
          content: "Rockstar Games has officially announced the release date for Grand Theft Auto 6..."
        },
        {
          source: { id: null, name: "GameSpot" },
          author: null,
          title: "New Esports Tournament Season Begins",
          description: "Major League Gaming announces winter 2025 esports competitions",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
          publishedAt: "2024-12-05T08:30:00Z",
          content: "The competitive gaming season is heating up with new tournaments..."
        },
        {
          source: { id: null, name: "Polygon" },
          author: null,
          title: "AI Breaks Speedrun World Record",
          description: "Machine learning algorithm completes Super Mario in record time",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop",
          publishedAt: "2024-12-03T15:20:00Z",
          content: "AI technology continues to revolutionize gaming achievements..."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getArticleIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'ign': return '🎯';
      case 'gamespot': return '🎮';
      case 'polygon': return '🔺';
      case 'pc gamer': return '🖥️';
      case 'eurogamer': return '🇪🇺';
      default: return '📰';
    }
  };

  return (
    <>
      <Helmet>
        <title>Latest Gaming News | Industry Updates | GameXBuddy</title>
        <link rel="canonical" href={canonical("/news-feed")} />
        <meta name="description" content="Stay updated with the latest gaming news, industry announcements, and esports coverage from trusted sources." />
      </Helmet>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            📰 Gaming News Feed
          </h1>
          <p className="text-white/70 mt-2">Latest updates from the gaming world</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card
                key={`${article.url}-${index}`}
                className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-800">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white flex items-center gap-1">
                      <span>{getArticleIcon(article.source.name)}</span>
                      {article.source.name}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight text-white line-clamp-3">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                      Read More
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/50 text-lg">No news articles found</div>
            <p className="text-white/30 mt-2">Check back later for gaming updates</p>
          </div>
        )}

        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              News Sources & Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-blue-500/20 rounded-full mb-2">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-blue-400 font-medium">IGN</span>
                <span className="text-white/60">Reviews</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-green-500/20 rounded-full mb-2">
                  <span className="text-2xl">🎮</span>
                </div>
                <span className="text-green-400 font-medium">GameSpot</span>
                <span className="text-white/60">News</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-purple-500/20 rounded-full mb-2">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-purple-400 font-medium">Polygon</span>
                <span className="text-white/60">Culture</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-orange-500/20 rounded-full mb-2">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-orange-400 font-medium">Esports</span>
                <span className="text-white/60">Competitions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={fetchNews} disabled={loading} variant="neon">
            {loading ? "Loading..." : "Refresh News"}
          </Button>
        </div>
      </div>
    </>
  );
}