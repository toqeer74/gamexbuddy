import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { sb } from "@/lib/supabase";

function slugify(s:string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }

export default function Search(){
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [rows, setRows] = useState<any[]>([]);

  useEffect(()=>{ (async ()=>{
    if (!q) return setRows([]);
    const { data } = await sb.rpc("search_all", { q });
    setRows(data||[]);
  })(); },[q]);

  return (
    <div className="wrap" style={{ padding: 20 }}>
      <h1>Search: {q}</h1>
      <div style={{ display:"grid", gap:10 }}>
        {rows.map((r,i)=>(
          <Link key={i} className="card-glass" style={{ padding:12 }}
                to={r.kind==='guide'? `/guides/${slugify(r.title)}`
                   : r.kind==='news'? `/news/${slugify(r.title)}`
                   : `/community#${r.id}`}>
            <strong>{r.title}</strong>
            <div style={{ opacity:.7 }}>{r.snippet}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

