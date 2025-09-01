import React from "react";
import HeroNeon from "@/components/HeroNeon";
import GameAuthorityStrip from "@/components/GameAuthorityStrip";
import RockstarFeedPro from "@/components/RockstarFeedPro";
import MagazineGrid from "@/components/MagazineGrid";
import NewsletterGlow from "@/components/NewsletterGlow";
import React, { lazy, Suspense } from "react";
import LazySection from "@/components/LazySection";
import SkeletonBlock from "@/components/SkeletonBlock";
const TrailerWallPro = lazy(() => import("@/components/TrailerWallPro"));
const AffiliateGuidesRow = lazy(() => import("@/components/AffiliateGuidesRow"));
const NewsletterFooterGlow = lazy(() => import("@/components/NewsletterFooterGlow"));

import "@/styles/home.css";

export default function HomePage() {
  return (
    <>
      <HeroNeon />
      <GameAuthorityStrip />
      {/* Fresh/official posts high on the page for authority */}
      <RockstarFeedPro />
      {/* Show breadth—multiple games/tools in a visual grid */}
      <MagazineGrid />
      {/* Premium newsletter capture mid-page */}
      <NewsletterGlow />
      {/* Cinematic trailer wall (deferred) */}
      <LazySection>
        <Suspense fallback={<SkeletonBlock height={320} />}>
          <TrailerWallPro />
        </Suspense>
      </LazySection>
      {/* Affiliate-ready guides row (deferred) */}
      <LazySection>
        <Suspense fallback={<SkeletonBlock height={280} />}>
          <AffiliateGuidesRow />
        </Suspense>
      </LazySection>
      {/* Footer CTA for conversions (deferred) */}
      <LazySection>
        <Suspense fallback={<SkeletonBlock height={180} />}>
          <NewsletterFooterGlow />
        </Suspense>
      </LazySection>
    </>
  );
}
