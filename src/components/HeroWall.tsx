import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCountdownPro from "@/components/HeroCountdownPro";

const TRAILERS = [
  { id: "QdBZY2fkU-0", title: "GTA VI — Trailer 1", thumb: "https://i.ytimg.com/vi/QdBZY2fkU-0/hqdefault.jpg" },
  { id: "4HK6G2qfU-s", title: "Cyberpunk 2077: Phantom Liberty", thumb: "https://i.ytimg.com/vi/4HK6G2qfU-s/hqdefault.jpg" },
  { id: "M2N0b7X9-ys", title: "Minecraft Trails & Tales", thumb: "https://i.ytimg.com/vi/M2N0b7X9-ys/hqdefault.jpg" }
];

export default function HeroWall() {
  const targetISO = import.meta.env.VITE_GTA6_DATE || "2026-01-01T00:00:00-05:00";
  const [active, setActive] = useState(TRAILERS[0].id);

  return (
    <section className="page-hero" style={{ position: "relative" }}>
      <div className="hero-glow" />
      <div className="parallax-icons" aria-hidden>
        <svg className="i1" width="80" height="80"><circle cx="40" cy="40" r="24" fill="#58e0ff"/></svg>
        <svg className="i2" width="80" height="80"><rect x="16" y="16" width="48" height="48" rx="12" fill="#ff58b3"/></svg>
        <svg className="i3" width="80" height="80"><polygon points="40,10 70,70 10,70" fill="#8f7dff"/></svg>
      </div>

      <div className="page-hero__wrap">
        <div>
          <span className="badge badge--hot">GTA 6 • Countdown & Official</span>
          <h1 className="title-xl">GAME<span style={{color:'#58e0ff'}}>✖</span>BUDDY</h1>
          <p className="subtitle">
            Your ultimate GTA 6 & multi-game hub — news, guides, tools, wallpapers, and community.
            Clean, fast, and neon-powered.
          </p>

          <HeroCountdownPro targetISO={targetISO} />

          <div className="cta-row">
            <a className="btn" href="/gta6">Enter GTA 6 Hub</a>
            <a className="btn btn--soft" href="/community">Join Community</a>
          </div>
        </div>

        <div className="hero-media">
          <AnimatePresence mode="wait">
            <motion.iframe
              key={active}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${active}`}
              title="Trailer"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 18 }}>
        <div className="carousel">
          {TRAILERS.map(t => (
            <button
              key={t.id}
              className="card-glass"
              style={{ minWidth: 220, borderRadius: 14, overflow: "hidden", textAlign: "left" }}
              onClick={() => setActive(t.id)}
              aria-label={`Play ${t.title}`}
            >
              <img src={t.thumb} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />
              <div style={{ padding: 10, fontWeight: 700 }}>{t.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

