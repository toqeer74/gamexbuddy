import React, { useState } from "react";

export default function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        style={{ width: "100%", height: "100%", border: 0, borderRadius: 12 }}
      />
    );
  }

  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return (
    <button
      onClick={() => setPlay(true)}
      aria-label={`Play ${title}`}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <img
        src={thumb}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,.35))",
          borderRadius: 12,
          color: "#fff",
          fontWeight: 800,
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1, filter: "drop-shadow(0 0 8px rgba(88,224,255,.5))" }}>▶</span>
        <span
          style={{
            background: "rgba(0,0,0,.35)",
            border: "1px solid rgba(255,255,255,.25)",
            padding: "8px 12px",
            borderRadius: 999,
          }}
        >
          Play
        </span>
      </span>
    </button>
  );
}

