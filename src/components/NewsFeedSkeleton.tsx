import React from "react";

export default function NewsFeedSkeleton(){
  return (
    <section className="nf">
      <div className="nf__wrap">
        <div className="h2">Latest News Highlights</div>
        <div className="chips">
          <div className="chip"><span className="chip__dot"></span>Loading…</div>
          <div className="chip"><span className="chip__dot"></span>Loading…</div>
          <div className="chip"><span className="chip__dot"></span>Loading…</div>
        </div>
        <div className="skel-grid">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="skel-card skel-shimmer">
              <div className="skel-badge"></div>
              <div className="skel-line" style={{width:"70%"}}></div>
              <div className="skel-line" style={{width:"50%"}}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

