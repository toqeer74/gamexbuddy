import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import NewsTagChips from "@/components/NewsTagChips";
import data from "@/content/gta6/news.json";
import SmartImage from "@/components/SmartImage";

type Item = {
  id: string; title: string; date: string; url: string; excerpt: string;
  image?: string; official?: boolean; trending?: boolean; tags?: string[];
};

const fmt = (d:string) => new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});

export default function NewsFeed(){
  const { tag } = useParams();
  const items = useMemo(() => (data as Item[]).sort((a,b)=>+new Date(b.date)-+new Date(a.date)), []);
  const allTags = useMemo(() => {
    const s = new Set<string>(); items.forEach(i => (i.tags||[]).forEach(t => s.add(t)));
    return Array.from(s);
  }, [items]);

  const filtered = tag ? items.filter(i => i.tags?.includes(tag)) : items;

  return (
    <section className="nf">
      <div className="nf__wrap">
        <h2 className="h2">Latest News Highlights</h2>
        <NewsTagChips tags={allTags} />

        <div className="nf__grid">
          {filtered.map(n => (
            <article key={n.id} className="nf__card reveal">
              {n.image && (
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  <SmartImage src={n.image} className="nf__img" alt={n.title} />
                </a>
              )}
              <div className="nf__overlay">
                <div className="nf__badges">
                  {n.official && <span className="badge badge--official">Official</span>}
                  {n.trending && <span className="badge badge--trend">🔥 Trending</span>}
                  <time className="nf__date">{fmt(n.date)}</time>
                </div>
                <div className="nf__title">{n.title}</div>
                <div className="nf__desc">{n.excerpt}</div>
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="nf__btn">Read on Source</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

