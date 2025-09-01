import React from "react";
import { motion } from "framer-motion";

type Card = { title: string; sub: string; image: string; href: string; wide?: boolean; };

const CARDS: Card[] = [
  { title: "GTA 6 Hub", sub: "Countdown, trailers, official news, editions", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop", href: "/gta6", wide: true },
  { title: "Minecraft Hub", sub: "Guides, shaders, server lists", image: "https://images.unsplash.com/photo-1625864250588-8d5aebbb5e10?q=80&w=1600&auto=format&fit=crop", href: "/minecraft" },
  { title: "PUBG Hub", sub: "Sensitivity, gear, map tips", image: "https://images.unsplash.com/photo-1520975922299-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop", href: "/pubg" },
  { title: "Top Gear Picks", sub: "Controller, headsets, monitors (affiliate-ready)", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop", href: "/guides/gear" },
  { title: "Wallpaper Vault", sub: "Curated 4K, free downloads", image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop", href: "/tools/wallpapers" },
];

export default function MagazineGrid(){
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Explore Our Game Hubs & Tools</h2>
        <div className="grid">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.title} href={c.href}
              className={`card parallax ${c.wide ? "card--wide" : ""}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.05 }}
            >
              <img className="card__img" src={c.image} alt="" loading="lazy" />
              <div className="card__p">
                <div className="card__t">{c.title}</div>
                <div className="card__sub">{c.sub}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

