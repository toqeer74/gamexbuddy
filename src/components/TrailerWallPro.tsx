import React, { useMemo, useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import data from "@/content/gta6/trailers.json";
import SmartImage from "@/components/SmartImage";
import TrailerModal from "@/components/modals/TrailerModal";

type Trailer = {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  url: string;
  image?: string;
  official?: boolean;
  tags?: string[];
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function TrailerWallPro() {
  const items = useMemo(() => (data as Trailer[]).sort((a, b) => +new Date(b.date) - +new Date(a.date)), []);
  const [modal, setModal] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Cinematic Trailers</h2>
        <div className="grid">
          {items.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              aria-label={`Play ${t.title}`}
              onClick={() => setModal({ id: t.youtubeId || t.id, title: t.title })}
              className={`card parallax`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="tcard__media">
                <SmartImage className="card__img" src={t.image} alt={t.title} />
                <div className="tcard__overlay" aria-hidden>
                  <div className="tcard__play">▶</div>
                </div>
              </div>
              <div className="card__p">
                <div className="feed__badges">
                  {t.official && <span className="badge badge--official">Official</span>}
                  <time className="feed__date">{fmt(t.date)}</time>
                </div>
                <div className="card__t">{t.title}</div>
                <div className="gx-actions" style={{ padding: "10px 0 0" }}>
                  <span className="gx-btn gx-btn--soft">Play</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <Suspense fallback={null}>
        <TrailerModal open={!!modal} onClose={() => setModal(null)} id={modal?.id || ""} title={modal?.title || "Trailer"} />
      </Suspense>
    </section>
  );
}

