import React, { useMemo, useState } from "react";
import data from "@/content/wallpapers.json";
import SmartImage from "@/components/SmartImage";

type W = { id:string; title:string; url:string; tags?:string[] };

export default function WallpaperGrid(){
  const items = data as W[];
  const allTags = useMemo(()=>{
    const s = new Set<string>();
    items.forEach(i => (i.tags||[]).forEach(t => s.add(t)));
    return ["All", ...Array.from(s)];
  }, [items]);
  const [tag, setTag] = useState<string>("All");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const filtered = tag === "All" ? items : items.filter(i => i.tags?.includes(tag));

  function toggle(id:string){ setSelected(prev => ({ ...prev, [id]: !prev[id] })); }
  function downloadSelected(){
    const urls = filtered.filter(f => selected[f.id]).map(f => f.url);
    if(urls.length===0) return;
    // Simple bulk: open each link (browser triggers downloads if "download" attribute supported by server)
    urls.forEach(u => {
      const a = document.createElement('a'); a.href = u; a.download = '';
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  return (
    <section className="section">
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 className="h2">Wallpaper Vault</h2>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <select value={tag} onChange={e=>setTag(e.target.value)} className="nl__input">
              {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button className="gx-btn gx-btn--soft" onClick={downloadSelected}>Download Selected</button>
          </div>
        </div>
        <div className="wall-grid" style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
          {filtered.map(w=> (
            <label key={w.id} className="wall-card card-glass" style={{position:'relative', cursor:'pointer'}}>
              <input type="checkbox" checked={!!selected[w.id]} onChange={()=>toggle(w.id)} style={{position:'absolute', top:10, left:10}}/>
              <SmartImage src={w.url} alt={w.title} style={{width:"100%", height:140, objectFit:"cover"}}/>
              <div className="p" style={{display:"flex",justifyContent:"space-between", padding:10}}>
                <div>{w.title}</div>
                <a className="badge" href={w.url} download onClick={e=>e.stopPropagation()}>Download</a>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
