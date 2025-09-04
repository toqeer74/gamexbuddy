import React from "react";

export default function WallpaperSkeleton(){
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Wallpaper Vault</h2>
        <div className="wall-grid" style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="card-glass" style={{borderRadius:16, overflow:'hidden'}}>
              <div className="skel-card skel-shimmer" style={{height:140}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

