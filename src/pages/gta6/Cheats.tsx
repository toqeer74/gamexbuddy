import React from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";

const Cheats: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>GTA 6 Cheats & Secrets | GameXBuddy</title>
        <link rel="canonical" href={canonical("/gta6/cheats")} />
        <meta name="description" content="Discover GTA 6 cheats, secrets, Easter eggs, and insider tips to enhance your gameplay." />
      </Helmet>
      <div className="space-y-8">
        <h1 className="h1">GTA 6 Cheats & Secrets</h1>
        <p className="text-muted-foreground">
          GTAVI cheats, secrets, Easter eggs, and pro tips revealed. Master the streets of Vice City with these expert guides.
        </p>
        <div className="card-glass" style={{ padding: 16 }}>
          <h2 className="h3">Cheat Codes (Once Released)</h2>
          <p className="mb-4">Cheat codes will be added here upon game release. Stay tuned for the ultimate GTA VI cheat compilation.</p>
          <div className="space-y-4">
            <div>
              <strong>Health & Armor:</strong> [TBA]
            </div>
            <div>
              <strong>Weapons:</strong> [TBA]
            </div>
            <div>
              <strong>Vehicles:</strong> [TBA]
            </div>
            <div>
              <strong>Weather:</strong> [TBA]
            </div>
          </div>
        </div>
        <div className="card-glass" style={{ padding: 16 }}>
          <h2 className="h3">Easter Eggs & Secrets</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Hidden references to previous GTA games throughout Vice City</li>
            <li>Secret locations with unique items and story elements</li>
            <li>Easter egg hotspots from the teaser trailers</li>
            <li>Mystery phone numbers and cryptic messages</li>
          </ul>
        </div>
        <div className="card-glass" style={{ padding: 16 }}>
          <h2 className="h3">Pro Tips & Tricks</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Master heist planning with optimal crew compositions</li>
            <li>Economic strategies for building your criminal empire</li>
            <li>Combat techniques for different playstyles</li>
            <li>Side mission completion guides for max rewards</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Cheats;