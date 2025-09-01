import React from "react";

const TAGS: Array<[string, "pc"|"console"|"mobile"]> = [
  ["GTA 6","pc"],["Minecraft","mobile"],["PUBG","console"],["Fortnite","pc"],
  ["Cyberpunk 2077","pc"],["EA FC 25","console"],["Call of Duty","pc"],
  ["Elden Ring","console"],["Valorant","pc"],["Helldivers 2","console"]
];

const Icon = ({kind}:{kind:"pc"|"console"|"mobile"}) => {
  const c = {pc:"#58e0ff", console:"#b3ff4c", mobile:"#ff58b3"}[kind];
  return <svg width="14" height="14"><circle cx="7" cy="7" r="6" fill={c}/></svg>;
};

export default function GameAuthorityMarquee(){
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__inner">
        {[...TAGS, ...TAGS].map(([t,k],i)=> (
          <span key={i} className="tag"><Icon kind={k as any}/>#{t}</span>
        ))}
      </div>
    </div>
  );
}

