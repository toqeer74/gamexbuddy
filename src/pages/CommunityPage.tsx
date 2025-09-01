import React from "react";
import MemeWall from "@/components/MemeWall";
import ThreadsPreview from "@/components/ThreadsPreview";
import Leaderboard from "@/components/Leaderboard";

export default function CommunityPage(){
  return (
    <>
      <MemeWall />
      <ThreadsPreview />
      <Leaderboard />
    </>
  );
}
