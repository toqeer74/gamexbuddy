import React from "react";
import { motion } from "framer-motion";
import SmartImage from "@/components/SmartImage";

type Guide = { title: string; sub: string; image: string; href: string };

const GUIDES: Guide[] = [
  {
    title: "Best Controllers for GTA & PC",
    sub: "Top picks with back buttons and low-latency wireless.",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=1600&auto=format&fit=crop",
    href: "/guides/best-controllers"
  },
  {
    title: "Headsets: Footstep Clarity Tier List",
    sub: "Open-back vs closed-back, mic quality, comfort.",
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1600&auto=format&fit=crop",
    href: "/guides/headsets"
  },
  {
    title: "Monitors for Competitive Play",
    sub: "240Hz+ picks, motion clarity, console vs PC settings.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1600&auto=format&fit=crop",
    href: "/guides/monitors"
  }
];

export default function AffiliateGuidesRow(){
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Editor’s Gear Guides</h2>
        <div className="grid">
          {GUIDES.map((g, i) => (
            <motion.a
              key={g.title}
              href={g.href}
              className="card parallax"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.05 }}
            >
              <SmartImage className="card__img" src={g.image} alt={g.title} />
              <div className="card__p">
                <div className="card__t">{g.title}</div>
                <div className="card__sub">{g.sub}</div>
                <div className="gx-actions" style={{ paddingTop: 10 }}>
                  <span className="gx-btn">View Picks</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
