import React, { useMemo } from "react";
import data from "@/content/gta6/news.json";

type Item = { id:string; title:string; date:string; url:string; excerpt:string; image?:string; official?:boolean; trending?:boolean; tags?:string[] };

const fmt = (d:string) => new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});

export default function HubNews({ tags, title='Latest News' }:{ tags: string[]; title?: string }){
  const items = useMemo(()=> (data as Item[])
    .filter(i => (i.tags||[]).some(t => tags.includes(t)))
    .sort((a,b)=> +new Date(b.date) - +new Date(a.date))
    .slice(0,6)
  , [tags]);
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">{title}</h2>
        <div className="grid">
          {items.map(n => (
            <article key={n.id} className="card parallax">
              {n.image && (
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  <img src={n.image} className="card__img" loading="lazy" alt="" />
                </a>
              )}
              <div className="card__p">
                <div className="feed__badges">
                  {n.official && <span className="badge badge--official">Official</span>}
                  {n.trending && <span className="badge badge--trend">Trending</span>}
                  <time className="feed__date">{fmt(n.date)}</time>
                </div>
                <div className="card__t">{n.title}</div>
                <div className="card__sub">{n.excerpt}</div>
                <div className="gx-actions" style={{paddingTop:10}}>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn--soft">Read Source</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

