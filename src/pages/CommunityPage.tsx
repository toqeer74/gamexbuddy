import React from "react";
import { Helmet } from "react-helmet-async";
import MemeWall from "@/components/MemeWall";
import MemeUploader from "@/components/MemeUploader";
import ThreadsPreview from "@/components/ThreadsPreview";
import Leaderboard from "@/components/Leaderboard";

export default function CommunityPage(){
  return (
    <>
      <Helmet>
        <title>Community – Memes, Threads, Leaderboard | GameXBuddy</title>
        <meta name="description" content="Join trending threads, share memes, and climb the leaderboard in the GameXBuddy community." />
      </Helmet>
      <MemeUploader />
      <MemeWall />
      <ThreadsPreview />
      <Leaderboard />
    </>
  );
}
