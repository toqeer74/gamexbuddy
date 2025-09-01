import React from "react";

const XboxHub = () => {
  return (
    <div className="container py-8 min-h-[calc(100vh-14rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">Xbox Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Everything Xbox! Get the latest on Game Pass, console news, and community content.
      </p>
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Xbox Series X|S Game Spotlights</li>
          <li>Game Pass Ultimate Perks</li>
          <li>Controller & Accessory Guides</li>
          <li>Multiplayer Events</li>
        </ul>
      </div>
    </div>
  );
};

export default XboxHub;