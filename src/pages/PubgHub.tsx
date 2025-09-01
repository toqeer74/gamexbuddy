import React from "react";

const PubgHub = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">PUBG Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Drop in and conquer the battlegrounds!
      </p>
      {/* Placeholder for PUBG specific content */}
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Latest News & Updates</li>
          <li>Quick Guides & Strategies</li>
          <li>Gear Recommendations</li>
          <li>Community Posts</li>
        </ul>
      </div>
    </div>
  );
};

export default PubgHub;