import React from "react";
import CountdownTimer from "@/components/common/CountdownTimer";
import TrailerEmbed from "@/components/common/TrailerEmbed";
import NewsCard from "@/components/common/NewsCard";
import { fetchRockstarNews } from "@/lib/api";
import RockstarFeed from "@/components/RockstarFeed";

const Gta6Index: React.FC = () => {
  const [news, setNews] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const items = await fetchRockstarNews();
        setNews(items.slice(0, 3));
      } catch (e) {
        setNews([]);
      }
    })();
  }, []);

  const gta6ReleaseDate = "2025-12-01T00:00:00Z";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-muted-foreground">Countdown to GTA6</p>
        <CountdownTimer targetDate={gta6ReleaseDate} />
      </div>

      <div className="max-w-4xl mx-auto">
        <TrailerEmbed youtubeId="QdBZY2fkU-0" title="GTA6 Official Trailer" />
      </div>

      <RockstarFeed />
    </div>
  );
};

export default Gta6Index;
