import React from "react";

const IosHub = () => { // Renamed component to IosHub
  return (
    <div className="container py-8 min-h-[calc(100vh-14rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">iOS Gaming Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Explore the best of iOS gaming! Find reviews, guides, and accessory recommendations for your Apple devices.
      </p>
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Apple Arcade Highlights</li>
          <li>Best iPhone/iPad Games</li>
          <li>Gaming Accessories for iOS</li>
          <li>Performance Tips</li>
        </ul>
      </div>
    </div>
  );
};

export default IosHub;