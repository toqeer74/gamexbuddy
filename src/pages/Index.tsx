import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { prefetchOnIdle } from "@/lib/prefetch";
import { canonical } from "@/lib/seo";

import Hero from "@/components/Hero";
import GameAuthorityMarquee from "@/components/GameAuthorityMarquee";
import RecommendedGames from "@/components/RecommendedGames";
import NewsFeed from "@/components/NewsFeed";
import MagazineGrid from "@/components/MagazineGrid";
import GuideCarouselSkeleton from "@/components/GuideCarouselSkeleton";
import ExitIntentModal from "@/components/ExitIntentModal";
import TrendingStrip from "@/components/TrendingStrip";
import ThreadsPreview from "@/components/ThreadsPreview";
import Leaderboard from "@/components/Leaderboard";
import PCCheckerCard from "@/components/PCCheckerCard";
import QuizStarter from "@/components/QuizStarter";
import trending from "@/content/gta6/news.json";
import newsData from "@/content/gta6/news.json";
import WallpaperSkeleton from "@/components/WallpaperSkeleton";

const WallpaperGrid = lazy(() => import("@/components/WallpaperGrid"));
const GuideCarousel = lazy(() => import("@/components/GuideCarousel"));
const GuideCarouselDb = lazy(() => import("@/components/GuideCarouselDb"));
import { USE_DB_GUIDES } from "@/config/flags";

import "@/styles/home.css";

export default function HomePage() {
  const hot = (trending as any[]).filter((n: any) => n.trending).slice(0, 4);

  // Live news fallback to bundled data, updated if /api/news is available
  const [liveNews, setLiveNews] = useState<any[] | null>(null);
  const latestNews = useMemo(() => {
    const base = (liveNews && Array.isArray(liveNews) && liveNews.length ? liveNews : (newsData as any[])) as any[];
    return base
      .slice()
      .sort((a, b) => +new Date(b.date || b.publishedAt || 0) - +new Date(a.date || a.publishedAt || 0))
      .slice(0, 6);
  }, [liveNews]);
  const trendingLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Trending Now",
    "itemListElement": hot.map((n: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: n.url,
      name: n.title,
    })),
  } as const;

  useEffect(() => {
    prefetchOnIdle(["/news", "/guides", "/tools", "/community"]);
  }, []);

  // Try fetch live news from an optional same-origin endpoint
  useEffect(() => {
    let aborted = false;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    (async () => {
      try {
        const res = await fetch("/api/news", { signal: ctrl.signal });
        if (!res.ok) return;
        const json = await res.json();
        if (!aborted && Array.isArray(json)) setLiveNews(json);
      } catch {}
    })();
    return () => {
      aborted = true;
      clearTimeout(t);
      ctrl.abort();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>GameXBuddy - GTA 6 News, Guides, Tools & Gaming Hub</title>
        <meta name="description" content="Stay updated with live GTA 6 news, guides, tools, wallpapers and community content. GameXBuddy curates the latest updates across PC, PlayStation, Xbox, Android and iOS." />
        <meta name="keywords" content="GTA 6, GTA VI, Grand Theft Auto 6, gaming hub, news, guides, tools, wallpapers, PC, PlayStation, Xbox, Android, iOS" />
        <meta property="og:title" content="GameXBuddy - GTA 6 News, Guides & Tools" />
        <meta property="og:image" content="/Gamexbuddy-logo-v2-neon-transparent.png" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonical("/")} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "GameXBuddy",
            url: "https://gamexbuddy.com/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://gamexbuddy.com/search?q={query}",
              "query-input": "required name=query",
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GameXBuddy",
            url: "https://gamexbuddy.com/",
            logo: "https://gamexbuddy.com/Gamexbuddy-logo-v2-neon-transparent.png",
            sameAs: [
              "https://twitter.com/gamexbuddy",
              "https://www.youtube.com/@gamexbuddy"
            ]
          })}
        </script>
        <script type="application/ld+json">{JSON.stringify(trendingLd)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Latest News",
            itemListElement: latestNews.map((n: any, idx: number) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: n.url,
              name: n.title,
            }))
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "GameXBuddy Home",
            hasPart: latestNews.map((n: any) => ({
              "@type": "NewsArticle",
              headline: n.title,
              datePublished: n.date || n.publishedAt,
              url: n.url,
              image: n.image || "https://gamexbuddy.com/Gamexbuddy-logo-v2-neon-transparent.png",
              description: n.excerpt,
              author: { "@type": "Organization", name: "GameXBuddy" },
              publisher: { "@type": "Organization", name: "GameXBuddy", logo: { "@type": "ImageObject", url: "https://gamexbuddy.com/Gamexbuddy-logo-v2-neon-transparent.png" } }
            }))
          })}
        </script>
      </Helmet>

      <Hero />
      <GameAuthorityMarquee />
      <TrendingStrip />
      <RecommendedGames />
      <NewsFeed />
      <MagazineGrid />

      <Suspense fallback={<GuideCarouselSkeleton />}>
        {USE_DB_GUIDES ? <GuideCarouselDb /> : <GuideCarousel />}
      </Suspense>

      <section className="section">
        <div className="wrap" style={{ display: "grid", gap: 18, gridTemplateColumns: "2fr 1fr" }}>
          <div>
            <ThreadsPreview />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          <PCCheckerCard />
          <QuizStarter />
          <Suspense fallback={<WallpaperSkeleton />}>
            <WallpaperGrid />
          </Suspense>
        </div>
      </section>

      <ExitIntentModal />
    </>
  );
}
