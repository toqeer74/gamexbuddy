import React from "react";
import data from "@/content/wallpapers.json";

type W = { id:string; title:string; url:string; tags?:string[] };

export default function WallpaperGrid(){
  const items = data as W[];
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Wallpaper Vault</h2>
        <div className="wall-grid" style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
          {items.map(w=> (
            <a key={w.id} className="wall-card card-glass" href={w.url} download>
              <img src={w.url} alt={w.title} style={{width:"100%", height:140, objectFit:"cover"}}/>
              <div className="p" style={{display:"flex",justifyContent:"space-between", padding:10}}>
                <div>{w.title}</div><span className="badge">Download</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

