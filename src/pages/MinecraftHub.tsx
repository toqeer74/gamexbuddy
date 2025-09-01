import React from "react";

const MinecraftHub = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Minecraft Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Explore the blocky world of Minecraft!
      </p>
      {/* Placeholder for Minecraft specific content */}
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Latest News & Updates</li>
          <li>Quick Guides & Tips</li>
          <li>Gear Recommendations</li>
          <li>Community Posts</li>
        </ul>
      </div>
    </div>
  );
};

export default MinecraftHub;