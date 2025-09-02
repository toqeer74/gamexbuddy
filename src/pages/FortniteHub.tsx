import React from "react";
import HubNews from "@/components/HubNews";
import AffiliateGuidesRow from "@/components/AffiliateGuidesRow";
import WallpaperGrid from "@/components/WallpaperGrid";

const FortniteHub = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Fortnite Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Drops, updates, and creator content for Fortnite.
      </p>
      <HubNews tags={["Fortnite"]} title="Fortnite News" />
      <AffiliateGuidesRow />
      <WallpaperGrid />
    </div>
  );
};

export default FortniteHub;
