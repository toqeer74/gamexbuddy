import React from "react";
import HeroWall from "@/components/HeroWall";
import GameAuthorityMarquee from "@/components/GameAuthorityMarquee";
import NewsFeed from "@/components/NewsFeed";
import MagazineGrid from "@/components/MagazineGrid";
import GuideCarousel from "@/components/GuideCarousel";

import "@/styles/home.css";

export default function HomePage() {
  return (
    <>
      <HeroWall />
      <GameAuthorityMarquee />
      <NewsFeed />
      <MagazineGrid />
      <GuideCarousel />
    </>
  );
}
