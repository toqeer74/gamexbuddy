import React from "react";
import SmartImage from "@/components/common/SmartImage";

type Row = { tag: string; icon: string; platform: "PC"|"PS"|"Xbox"|"Mobile" };

const ITEMS: Row[] = [
  { tag: "GTA6",      icon: "/icons/gta.svg",        platform: "PC" },
  { tag: "Minecraft", icon: "/icons/minecraft.svg",  platform: "Mobile" },
  { tag: "PUBG",      icon: "/icons/pubg.svg",       platform: "Xbox" },
  { tag: "Fortnite",  icon: "/icons/fortnite.svg",   platform: "PC" },
  { tag: "Valorant",  icon: "/icons/valorant.svg",   platform: "PC" },
  { tag: "EldenRing", icon: "/icons/eldenring.svg",  platform: "PS" },
];

const Plat = ({p}:{p:Row["platform"]}) => {
  const color = {PC:"#58e0ff", PS:"#8f7dff", Xbox:"#b3ff4c", Mobile:"#ff58b3"}[p];
  return <span aria-label={p} title={p} style={{
    display:"inline-block", width:10, height:10, borderRadius:9999,
    background: color, boxShadow:`0 0 10px ${color}80`
  }}/>
};

export default function GameAuthorityMarquee(){
  const twice = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__inner">
        {twice.map((it, i) => (
          <a key={i} href={`/news/tag/${encodeURIComponent(it.tag.toLowerCase())}`} className="tag">
            <SmartImage src={it.icon} alt={`${it.tag} icon`} style={{width:18,height:18}}/>
            #{it.tag} <Plat p={it.platform}/>
          </a>
        ))}
      </div>
    </div>
  );
}
