import React from "react";

export default function AdSlot({
  placement,
  size = "728x90",
  isPremium
}: { placement: string; size?: "728x90"|"300x250"|"320x100"; isPremium?: boolean }) {
  if (isPremium) return null;
  const minHeight = size === "300x250" ? 250 : size === "320x100" ? 100 : 90;
  return (
    <div className="card-glass" data-ad={placement} style={{ display:"grid", placeItems:"center", minHeight }}>
      <div aria-label={`Ad: ${placement}`} style={{ opacity:.6, fontSize:12 }}>
        Ad slot {placement} ({size})
      </div>
      {/* TODO: integrate ad provider; keep fixed wrapper to avoid CLS */}
    </div>
  );
}

