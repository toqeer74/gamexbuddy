import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCountdownPro from "@/components/HeroCountdownPro";
// Note: Do not embed YouTube iframe in hero to avoid early LCP cost
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import SmartImage from "@/components/common/SmartImage";
import TrailerModal from "@/components/modals/TrailerModal";

const TRAILERS = [
  { id: "QdBZY2fkU-0", title: "GTA VI - Trailer 1", thumb: "https://i.ytimg.com/vi/QdBZY2fkU-0/hqdefault.jpg" },
  { id: "4HK6G2qfU-s", title: "Cyberpunk 2077: Phantom Liberty", thumb: "https://i.ytimg.com/vi/4HK6G2qfU-s/hqdefault.jpg" },
  { id: "M2N0b7X9-ys", title: "Minecraft Trails & Tales", thumb: "https://i.ytimg.com/vi/M2N0b7X9-ys/hqdefault.jpg" }
];

export default function HeroWall() {
  const targetISO = import.meta.env.VITE_GTA6_DATE || "2026-01-01T00:00:00-05:00";
  const [active, setActive] = useState(TRAILERS[0].id);
  const [modal, setModal] = useState<{ id: string; title: string } | null>(null);
  const reduced = usePrefersReducedMotion();
  const playLabel = "Play trailer";

  return (
    <section className="page-hero" style={{ position: "relative" }}>
      <div className="hero-glow" />

      {!reduced && (
        <div className="parallax-icons" aria-hidden>
          <svg className="i1" width="80" height="80">
            <circle cx="40" cy="40" r="24" fill="#58e0ff" />
          </svg>
          <svg className="i2" width="80" height="80">
            <rect x="16" y="16" width="48" height="48" rx="12" fill="#ff58b3" />
          </svg>
          <svg className="i3" width="80" height="80">
            <polygon points="40,10 70,70 10,70" fill="#8f7dff" />
          </svg>
        </div>
      )}

      <div className="page-hero__wrap">
        <div>
          <span className="badge badge--hot">GTA 6 • Official</span>
          <h1 className="title-xl">
            GAME<span style={{ color: "#58e0ff" }}>X</span>BUDDY
          </h1>
          <p className="subtitle">
            Your ultimate GTA 6 & multi-game hub — news, guides, tools, wallpapers, and community.
          </p>

          <HeroCountdownPro targetISO={targetISO} />

          <div className="cta-row">
            <a className="btn" href="/gta6">Enter GTA 6 Hub</a>
            <a className="btn btn--soft" href="/community">Join Community</a>
          </div>
        </div>

        {/* HERO MEDIA (Lite preview; opens modal) */}
        <div className="hero-media" style={{ position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.button
              type="button"
              aria-label={playLabel}
              key={active}
              className="w-full h-full"
              style={{ display: "block", position: "relative" }}
              onClick={() => setModal({ id: active, title: "Trailer" })}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              exit={reduced ? {} : { opacity: 0, y: -10 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
            >
              <img
                src={`https://i.ytimg.com/vi/${active}/maxresdefault.jpg`}
                alt="Trailer preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
              <span className="hero-overlay" aria-hidden>
                <span className="hero-overlay__glyph">▶</span>
                <span className="hero-overlay__text">Play</span>
              </span>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* mini trailer wall */}
      <div className="wrap" style={{ marginTop: 18 }}>
        <div className="carousel">
          {TRAILERS.map((t) => (
            <button
              key={t.id}
              className="card-glass"
              style={{ minWidth: 220, borderRadius: 14, overflow: "hidden", textAlign: "left" }}
              onClick={() => { setActive(t.id); setModal({ id: t.id, title: t.title }); }}
              aria-label={`Play ${t.title}`}
            >
              <SmartImage src={t.thumb} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />
              <div style={{ padding: 10, fontWeight: 700 }}>
                {t.title.replace(/[^ -~]+/g, "")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {modal && (
        <TrailerModal open={!!modal} onClose={() => setModal(null)} id={modal.id} title={modal.title} />
      )}
    </section>
  );
}
