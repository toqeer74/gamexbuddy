import React from "react";

const ToolsPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Utility Tools</h1>
      <p className="text-lg text-center text-muted-foreground">
        Handy tools for every gamer!
      </p>
      {/* Placeholder for Tools specific content */}
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>"Can My PC Run GTA6?" Checker</li>
          <li>Interactive Quizzes & Polls</li>
          <li>Wallpaper Vault</li>
        </ul>
      </div>
    </div>
  );
};

export default ToolsPage;