import React, { useMemo } from "react";
import data from "@/content/gta6/news.json";
import { Link } from "react-router-dom";

type Item = { id:string; title:string; url:string; trending?:boolean };

export default function TrendingStrip(){
  const items = useMemo(()=> (data as Item[]).filter(i=>i.trending).slice(0,4), []);
  if(items.length===0) return null;
  return (
    <div style={{padding:'10px 0', background:'rgba(255,149,0,.08)', borderTop:'1px solid rgba(255,149,0,.25)', borderBottom:'1px solid rgba(255,149,0,.25)'}}>
      <div className="wrap" style={{display:'flex', gap:14, alignItems:'center', overflowX:'auto'}}>
        <span className="badge badge--trend">?? Trending Now</span>
        {items.map(it => (
          <a key={it.id} href={it.url} target="_blank" rel="noopener noreferrer" className="nf__btn" style={{whiteSpace:'nowrap'}}>
            {it.title}
          </a>
        ))}
      </div>
    </div>
  );
}


