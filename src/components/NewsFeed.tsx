import React, { useMemo, useState } from "react";
import data from "@/content/gta6/news.json";

type Item = {
  id: string; title: string; date: string; url: string; excerpt: string;
  image?: string; official?: boolean; trending?: boolean; tags?: string[];
};

const ALL = "All";
const fmt = (d:string) => new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});

export default function NewsFeed({ initialTag }: { initialTag?: string }) {
  const items = useMemo(() => (data as Item[]).sort((a,b)=>+new Date(b.date)-+new Date(a.date)), []);
  const allTags = useMemo(() => {
    const s = new Set<string>(); items.forEach(i => (i.tags||[]).forEach(t => s.add(t)));
    return [ALL, ...Array.from(s)];
  }, [items]);
  const [active, setActive] = useState(initialTag || ALL);
  const filtered = active===ALL ? items : items.filter(i => i.tags?.includes(active));

  return (
    <section className="nf">
      <div className="nf__wrap">
        <h2 className="h2">Latest News Highlights</h2>
        <div className="nf__chips">
          {allTags.map(t=> (
            <a key={t}
               href={t===ALL?"/news":`/news/tag/${encodeURIComponent(t)}`}
               onClick={(e)=>{ e.preventDefault(); setActive(t); }}
               className={`nf__chip ${active===t?"nf__chip--on":""}`}>{t}</a>
          ))}
        </div>
        <div className="nf__grid">
          {filtered.map(n => (
            <article key={n.id} className="nf__card reveal">
              {n.image && <a href={n.url} target="_blank" rel="noopener noreferrer"><img src={n.image} className="nf__img" alt={n.title}/></a>}
              <div className="nf__overlay">
                <div className="nf__badges">
                  {n.official && <span className="badge badge--official">Official</span>}
                  {n.trending && <span className="badge badge--trend">Trending</span>}
                  <time className="nf__date">{fmt(n.date)}</time>
                </div>
                <div className="nf__title">{n.title}</div>
                <div className="nf__desc">{n.excerpt}</div>
                <a href={n.url} className="nf__btn" target="_blank" rel="noopener noreferrer">Read on Source</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

