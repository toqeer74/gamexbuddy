import React, { lazy, Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { prefetchOnIdle } from "@/lib/prefetch";
import { canonical } from "@/lib/seo";

import HeroWall from "@/components/HeroWall";
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
import WallpaperSkeleton from "@/components/WallpaperSkeleton";

const WallpaperGrid = lazy(() => import("@/components/WallpaperGrid"));
const GuideCarousel = lazy(() => import("@/components/GuideCarousel"));
const GuideCarouselDb = lazy(() => import("@/components/GuideCarouselDb"));
import { USE_DB_GUIDES } from "@/config/flags";

import "@/styles/home.css";

export default function HomePage() {
  const hot = (trending as any[]).filter((n: any) => n.trending).slice(0, 4);
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

  return (
    <>
      <Helmet>
        <title>GameXBuddy - GTA 6 & Gaming Hub</title>
        <meta name="description" content="News, guides, tools, wallpapers, and community for GTA VI and beyond." />
        <meta property="og:title" content="GameXBuddy - GTA 6 & Gaming Hub" />
        <meta property="og:image" content="/og-default.png" />
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
        <script type="application/ld+json">{JSON.stringify(trendingLd)}</script>
      </Helmet>

      <HeroWall />
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
