import React from "react";
import HeroWall from "@/components/HeroWall";
import GameAuthorityMarquee from "@/components/GameAuthorityMarquee";
import NewsFeed from "@/components/NewsFeed";
import MagazineGrid from "@/components/MagazineGrid";
import React, { lazy, Suspense } from "react";
import GuideCarouselSkeleton from "@/components/GuideCarouselSkeleton";
import ExitIntentModal from "@/components/ExitIntentModal";
const GuideCarousel = lazy(() => import("@/components/GuideCarousel"));

import "@/styles/home.css";

export default function HomePage() {
  return (
    <>
      <HeroWall />
      <GameAuthorityMarquee />
      <NewsFeed />
      <MagazineGrid />
      <Suspense fallback={<GuideCarouselSkeleton />}>
        <GuideCarousel />
      </Suspense>
      <ExitIntentModal />
    </>
  );
}
