import React, { useMemo, useState } from "react";
import data from "@/content/prices.json";
import AffiliateLink from "@/components/AffiliateLink";

type Price = { id:string; title:string; platform:string; store:'Amazon'|'InstantGaming'; price:number; url:string };

export default function PriceTracker(){
  const items = data as unknown as Price[];
  const [q, setQ] = useState("");
  const [store, setStore] = useState<'All'|'Amazon'|'InstantGaming'>('All');
  const [platform, setPlatform] = useState<'All'|'PC'|'PS5'|'Xbox'|'Switch'>('All');
  const list = useMemo(()=> items.filter(i =>
    (store==='All' || i.store===store) &&
    (platform==='All' || i.platform===platform) &&
    (q.trim()==='' || i.title.toLowerCase().includes(q.toLowerCase()))
  ), [items, q, store, platform]);

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="h2">Price Tracker</h1>
        <div style={{display:'flex', gap:8, marginBottom:12}}>
          <input className="nl__input" placeholder="Search title" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="nl__input" value={store} onChange={e=>setStore(e.target.value as any)}>
            <option>All</option><option>Amazon</option><option>InstantGaming</option>
          </select>
          <select className="nl__input" value={platform} onChange={e=>setPlatform(e.target.value as any)}>
            <option>All</option><option>PC</option><option>PS5</option><option>Xbox</option><option>Switch</option>
          </select>
        </div>
        <div className="grid">
          {list.map(p => (
            <article key={p.id} className="card parallax">
              <div className="card__p">
                <div className="card__t">{p.title} <span className="badge">{p.platform}</span></div>
                <div className="card__sub">{p.store}</div>
                <div className="gx-actions" style={{paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontWeight:800}}>${p.price.toFixed(2)}</div>
                  <AffiliateLink href={p.url}>Buy</AffiliateLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
