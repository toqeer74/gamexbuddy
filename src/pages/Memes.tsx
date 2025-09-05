import React from "react";
import MemeUploader from "@/components/MemeUploader";
import MemeWall from "@/components/MemeWall";

export default function MemesPage(){
  return (
    <section className="section">
      <div className="wrap">
        <h1 className="h2">Meme Wall</h1>
        <MemeUploader />
        <MemeWall />
      </div>
    </section>
  );
}

