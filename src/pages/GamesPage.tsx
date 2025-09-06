import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { rawgAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, Gamepad2, Search } from "lucide-react";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  metacritic: number | null;
  playtime: number;
  genres: Array<{ id: number; name: string; }>;
  platforms: Array<{ platform: { id: number; name: string; } }>;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await rawgAPI.getGames({
        page,
        page_size: 20,
        search: search || undefined
      });
      setGames(response.results || []);
    } catch (error) {
      console.error('Failed to fetch games:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (page === 1) {
      fetchGames();
    } else {
      setPage(1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  return (
    <>
      <Helmet>
        <title>Game Database | Discover Thousands of Games | GameXBuddy</title>
        <link rel="canonical" href={canonical("/games")} />
        <meta name="description" content="Explore our comprehensive game database powered by RAWG. Find ratings, reviews, trailers, and detailed information for thousands of video games." />
      </Helmet>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🎮 Game Database
          </h1>
          <p className="text-white/70 mt-2">Discover, explore, and find detailed information about your favorite games</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-800">
                    {game.background_image && (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        ⭐ {game.rating.toFixed(1)}
                      </Badge>
                    </div>
                    {game.metacritic && (
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant={game.metacritic >= 75 ? "default" : game.metacritic >= 50 ? "secondary" : "destructive"}
                          className="bg-black/70"
                        >
                          MC: {game.metacritic}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-tight text-white line-clamp-2">
                      {game.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{game.released ? formatDate(game.released) : 'TBA'}</span>
                      </div>
                      {game.playtime > 0 && (
                        <div className="flex items-center gap-1">
                          <Gamepad2 className="w-3 h-3" />
                          <span>{game.playtime}h</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {game.genres?.slice(0, 2).map((genre) => (
                        <Badge key={genre.id} variant="outline" className="text-xs">
                          {genre.name}
                        </Badge>
                      ))}
                      {game.genres?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{game.genres.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-white/70">
                Page {page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={loading}
              >
                Next
              </Button>
            </div>

            {games.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-white/50 text-lg">No games found</div>
                <p className="text-white/30 mt-2">Try adjusting your search terms</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}