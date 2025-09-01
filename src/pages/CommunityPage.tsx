import React from "react";

const CommunityPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Community Hub</h1>
      <p className="text-lg text-center text-muted-foreground">
        Connect with fellow gamers, share memes, and join discussions!
      </p>
      {/* Placeholder for Community specific content */}
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Forums & Discussions</li>
          <li>Meme Wall (upload & like)</li>
          <li>Gamification (XP, Leaderboard)</li>
          <li>Quizzes & Polls</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityPage;