import React from "react";
import data from "@/content/gta6/news.json";

type NewsItem = {
  id: string;
  title: string;
  date: string; // ISO
  url: string; // Newswire URL
  excerpt: string;
  image?: string;
  official?: boolean;
  mirror?: { enabled?: boolean; slug?: string; summary?: string };
  tags?: string[];
};

function fmt(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RockstarFeed() {
  const items = (data as NewsItem[]).sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );

  return (
    <section aria-labelledby="rockstar-feed" className="gx-section">
      <div className="gx-wrap">
        <h2 id="rockstar-feed" className="gx-h2">
          Latest News Highlights
        </h2>

        <div className="gx-grid">
          {items.map((n) => (
            <article key={n.id} className="gx-card">
              {n.image && (
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gx-imgwrap"
                >
                  <img src={n.image} loading="lazy" alt="" />
                </a>
              )}

              <div className="gx-meta">
                {n.official && (
                  <span className="gx-badge gx-badge--official">Official</span>
                )}
                <time dateTime={n.date} className="gx-date">
                  {fmt(n.date)}
                </time>
              </div>

              <h3 className="gx-title">{n.title}</h3>
              <p className="gx-excerpt">{n.excerpt}</p>

              <div className="gx-actions">
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gx-btn"
                >
                  Read on Newswire
                </a>

                {n.mirror?.enabled && n.mirror.slug && (
                  <a
                    href={`/gta6/news/${n.mirror.slug}`}
                    className="gx-btn gx-btn--soft"
                  >
                    Mirror Post
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

