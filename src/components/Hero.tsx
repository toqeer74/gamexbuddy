import React from "react";
import { motion } from "framer-motion";
import HeroCountdownPro from "@/components/HeroCountdownPro";

// GTA 6 release target: May 26, 2026 (source: pcgamesn.com)
const GTA6_TARGET_ISO = "2026-05-26T00:00:00-05:00";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(88,224,255,0.25), transparent 60%), radial-gradient(1200px 600px at 90% 10%, rgba(255,88,179,0.2), transparent 60%), linear-gradient(180deg, #0b0f19 0%, #0b0f19 60%, #121826 100%)",
      }}
    >
      {/* Pulsing glow behind countdown */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0.35, scale: 0.95 }}
        animate={{ opacity: [0.25, 0.4, 0.25], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(600px 300px at 50% 40%, rgba(88,224,255,0.15), transparent 70%), radial-gradient(600px 300px at 50% 60%, rgba(143,125,255,0.12), transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14">
          {/* Left: Text + CTA */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <motion.span
              className="inline-block text-xs font-semibold tracking-wider text-cyan-300/90 drop-shadow"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              GTA 6 • Countdown & News
            </motion.span>
            <motion.h1
              className="mt-3 text-4xl md:text-6xl font-extrabold text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              GAME<span className="text-cyan-300 drop-shadow">X</span>BUDDY
            </motion.h1>
            <motion.p
              className="mt-3 text-base md:text-lg text-gray-300 max-w-xl md:max-w-2xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your hub for GTA 6 and top games — live news, in-depth guides, handy tools, wallpapers and community.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-col sm:flex-row items-center md:items-start gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <a
                href="/gta6"
                className="inline-flex items-center justify-center rounded-md bg-cyan-500 px-5 py-2.5 text-white font-semibold shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:bg-cyan-400 transition-colors"
              >
                Explore GTA 6 Hub
              </a>
              <a
                href="/community"
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-2.5 text-white/90 hover:text-white hover:bg-white/5 transition-colors"
              >
                Join Community
              </a>
            </motion.div>
          </div>

          {/* Right: Countdown */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="relative z-[1]">
              <HeroCountdownPro targetISO={GTA6_TARGET_ISO} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

