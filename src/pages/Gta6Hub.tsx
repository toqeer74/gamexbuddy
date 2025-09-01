import React from "react";

const Gta6Hub = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">GTA6 Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        This is the dedicated hub for all things Grand Theft Auto VI. More content coming soon!
      </p>
      {/* Placeholder for GTA6 specific content */}
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Countdown Timer</li>
          <li>Latest Trailers & Analysis</li>
          <li>Rockstar Newswire Updates</li>
          <li>Release Date, Editions, Map, Characters, FAQs</li>
          <li>"Ready Your Setup" Guides</li>
        </ul>
      </div>
    </div>
  );
};

export default Gta6Hub;