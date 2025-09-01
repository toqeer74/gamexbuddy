import React from "react";

export default function SkeletonBlock({ height = 280 }: { height?: number }){
  return (
    <section className="section">
      <div className="wrap">
        <div className="skeleton" style={{ height }} />
      </div>
    </section>
  );
}

