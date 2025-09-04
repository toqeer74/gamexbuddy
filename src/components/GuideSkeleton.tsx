import React from "react";

export default function GuideSkeleton(){
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Gear & Gaming Guides</h2>
        <div className="carousel">
          {Array.from({length:3}).map((_,i)=> (
            <div key={i} className="card-glass" style={{ minWidth: 280, maxWidth: 320, borderRadius: 16, overflow: 'hidden' }}>
              <div className="skel-card skel-shimmer" style={{height:160}} />
              <div style={{padding:12}}>
                <div className="skel-line" style={{width:'70%'}} />
                <div className="skel-line" style={{width:'50%'}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

