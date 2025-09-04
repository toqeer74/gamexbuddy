import React from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import data from "@/content/gta6/news.json";
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
    <>
      <Helmet>
        <title>GTA 6 Hub | GameXBuddy</title>
        <link rel="canonical" href={canonical("/gta6")} />
        <meta name="description" content="Countdown, trailers, and official GTA VI updates." />
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":"GTA 6 Hub","url": canonical("/gta6"),"mainEntity":{"@type":"ItemList","itemListElement": ((data as any[]).filter(n=>n.official).slice(0,10)).map((n:any,idx:number)=>({"@type":"ListItem","position":idx+1,"url":n.url,"name":n.title}))}})}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"CollectionPage",
          name:"GTA6 Hub",url:"https://gamexbuddy.com/gta6",
          about:["Grand Theft Auto VI","Rockstar Games"],
          hasPart:[
            {"@type":"WebPage","name":"Release Date","url":"https://gamexbuddy.com/gta6/release-date"},
            {"@type":"WebPage","name":"Editions","url":"https://gamexbuddy.com/gta6/editions"},
            {"@type":"WebPage","name":"Map & Setting","url":"https://gamexbuddy.com/gta6/map"},
            {"@type":"WebPage","name":"Characters","url":"https://gamexbuddy.com/gta6/characters"},
            {"@type":"WebPage","name":"FAQs","url":"https://gamexbuddy.com/gta6/faqs"}
          ]
        })}</script>
      </Helmet>
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
    </>
  );
};

export default Gta6Index;







