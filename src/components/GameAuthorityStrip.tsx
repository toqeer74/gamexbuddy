import React from "react";

const TAGS = [
  "GTA 6", "Minecraft", "PUBG", "Fortnite", "Cyberpunk 2077",
  "EA FC 25", "Call of Duty", "Elden Ring", "Valorant", "Helldivers 2"
];

export default function GameAuthorityStrip(){
  return (
    <div className="strip" aria-hidden>
      <div className="strip__wrap">
        {TAGS.map(t => <span key={t} className="tag">#{t}</span>)}
      </div>
    </div>
  );
}

