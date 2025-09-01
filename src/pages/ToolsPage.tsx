import React from "react";
import PCCheckerCard from "@/components/PCCheckerCard";
import QuizStarter from "@/components/QuizStarter";
import WallpaperGrid from "@/components/WallpaperGrid";

export default function ToolsPage(){
  return (
    <div className="wrap" style={{padding:"48px 20px"}}>
      <h1 className="h2">Utility Tools</h1>
      <div style={{display:"grid",gap:18, gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
        <PCCheckerCard/><QuizStarter/><WallpaperGrid/>
      </div>
    </div>
  );
}
