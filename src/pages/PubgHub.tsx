import React from "react";
import HubNews from "@/components/HubNews";
import AffiliateGuidesRow from "@/components/AffiliateGuidesRow";
import WallpaperGrid from "@/components/WallpaperGrid";

const PubgHub = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">PUBG Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Drop in and conquer the battlegrounds!
      </p>
      <HubNews tags={["PUBG"]} title="PUBG Patch Notes & News" />
      <AffiliateGuidesRow />
      <WallpaperGrid />
    </div>
  );
};

export default PubgHub;
