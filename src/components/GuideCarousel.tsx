import React from "react";
import GuideCard from "./GuideCard";

const GUIDES = [
  { title:"Best Controllers for GTA & PC", sub:"Top picks with back buttons and low-latency wireless.", href:"/guides/best-controllers", image:"https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop", sponsored:true },
  { title:"Headsets: Footstep Clarity Tier List", sub:"Crisp directional audio for shooters and open worlds.", href:"/guides/headsets", image:"https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop", sponsored:true },
  { title:"Monitors for Competitive Play", sub:"240Hz+, motion clarity, console vs PC settings.", href:"/guides/monitors", image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop", sponsored:true }
];

export default function GuideCarousel(){
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Gear & Gaming Guides</h2>
        <div className="carousel">
          {GUIDES.map(g=> <GuideCard key={g.title} {...g} />)}
        </div>
      </div>
    </section>
  );
}

