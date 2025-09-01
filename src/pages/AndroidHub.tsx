import React from "react";

const AndroidHub = () => {
  return (
    <div className="container py-8 min-h-[calc(100vh-14rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">Android Gaming Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Your source for mobile gaming on Android! Discover new games, tips, and device recommendations.
      </p>
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Top Android Games</li>
          <li>Mobile Gaming News</li>
          <li>Controller Compatibility</li>
          <li>Battery Saving Tips</li>
        </ul>
      </div>
    </div>
  );
};

export default AndroidHub;