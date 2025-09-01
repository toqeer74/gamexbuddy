import React from "react";

const PlayStationHub = () => {
  return (
    <div className="container py-8 min-h-[calc(100vh-14rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">PlayStation Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Your go-to for all things PlayStation! Explore exclusive titles, news, and community discussions.
      </p>
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>PS5 & PS4 Game Reviews</li>
          <li>PlayStation Plus Updates</li>
          <li>Hardware & Accessory Guides</li>
          <li>Community Events</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayStationHub;