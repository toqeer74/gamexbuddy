import React from "react";
import { Link } from "react-router-dom";
import guides from "@/content/guides.json";

type Guide = { slug: string; title: string; intro: string };

export default function GuidesIndex(){
  const all = guides as Guide[];
  return (
    <section className="section">
      <div className="wrap">
        <nav style={{ fontSize: 13, opacity: .8, marginBottom: 10 }}>
          <Link to="/">Home</Link> / <span>Guides</span>
        </nav>
        <h1 className="h2">Gear & Gaming Guides</h1>
        <div className="grid">
          {all.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="card parallax">
              <div className="card__p">
                <div className="card__t">{g.title}</div>
                <div className="card__sub">{g.intro}</div>
                <div className="gx-actions" style={{ paddingTop: 10 }}>
                  <span className="gx-btn gx-btn--soft">Open Guide</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

