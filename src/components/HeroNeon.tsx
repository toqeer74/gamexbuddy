import React from "react";
import ParticlesCanvas from "./ParticlesCanvas";
import HeroCountdownPro from "./HeroCountdownPro";

export default function HeroNeon() {
  const targetISO = import.meta.env.VITE_GTA6_DATE || "2026-01-01T00:00:00-05:00";
  const [play, setPlay] = React.useState(false);
  const ytId = "QdBZY2fkU-0";
  const thumb = `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;

  return (
    <section className="page-hero">
      <ParticlesCanvas />
      <div className="page-hero__wrap">
        <div>
          <span className="badge badge--hot">GTA 6 â€¢ Countdown & Official</span>
          <h1 className="title-xl">GAME<span style={{color:'#58e0ff'}}>âœ–</span>BUDDY</h1>
          <p className="subtitle">Your ultimate GTA 6 & multi-game hub â€” news, guides, tools, wallpapers, and community. Clean, fast, and neon-powered.</p>

          <HeroCountdownPro targetISO={targetISO} />

          <div className="cta-row">
            <a className="btn" href="/gta6">Enter GTA 6 Hub</a>
            <a className="btn btn--soft" href="/community">Join Community</a>▶</div>
        </div>

        <div className="hero-media">
          {play ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              title="GTA VI Trailer 1" loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              aria-label="Play GTA VI Trailer"
              onClick={() => setPlay(true)}
              style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}
            >
              <SmartImage src={thumb} alt="GTA VI Trailer thumbnail" alt="GTA VI Trailer thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:64, height:64, borderRadius:999, background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, boxShadow:'0 0 40px rgba(143,125,255,.35)'}}>▶</div>
              </div>
            </button>▶</div>
      </div>
    </section>
  );
}

