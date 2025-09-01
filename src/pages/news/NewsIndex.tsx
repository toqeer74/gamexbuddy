import React, { useMemo } from "react";
import data from "@/content/gta6/news.json";
import "@/styles/home.css";

type Item = { id: string; title: string; date: string; url: string; excerpt: string; image?: string; official?: boolean; trending?: boolean; tags?: string[] };

function fmt(d: string) { return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }

export default function NewsIndex(){
  const items = useMemo(() => (data as Item[]).sort((a,b) => +new Date(b.date) - +new Date(a.date)), []);
  return (
    <section className="section">
      <div className="wrap">
        <h1 className="h2">All News</h1>
        <div className="grid">
          {items.map(n => (
            <article key={n.id} className="card parallax">
              {n.image && (
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  <img className="card__img" src={n.image} alt="" loading="lazy" />
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
                <div className="gx-actions" style={{ paddingTop: 10 }}>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn--soft">Read on Newswire</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

