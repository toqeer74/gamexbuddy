import React, { useMemo, useState } from "react";
import data from "@/content/gta6/news.json";

type Item = {
  id: string; title: string; date: string; url: string; excerpt: string;
  image?: string; official?: boolean; trending?: boolean; tags?: string[];
};

const ALL = "All";

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function RockstarFeedPro() {
  const items = useMemo(() => (data as Item[]).sort((a, b) => +new Date(b.date) - +new Date(a.date)), []);
  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => (i.tags || []).forEach((t) => s.add(t)));
    return [ALL, ...Array.from(s)];
  }, [items]);

  const [active, setActive] = useState(ALL);
  const filtered = active === ALL ? items : items.filter((i) => i.tags?.includes(active));

  return (
    <section className="section">
      <div className="wrap">
        <div className="h2">Latest News Highlights</div>

        <div className="feed__chips">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`chip ${active === t ? "chip--on" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid">
          {filtered.map((n) => (
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
                <div className="gx-actions" style={{padding: "12px 0 0"}}>
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

