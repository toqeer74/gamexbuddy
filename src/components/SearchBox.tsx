import React, { useEffect, useMemo, useRef, useState } from "react";
import news from "@/content/gta6/news.json";
import games from "@/content/games.json";

type Doc = { title: string; href: string; summary?: string };

function norm(s: string) {
  return s.toLowerCase().normalize("NFKD");
}
function score(q: string, d: Doc) {
  const n = norm(q);
  const hay = `${d.title} ${d.summary || ""}`.toLowerCase();
  return hay.includes(n) ? n.length / Math.max(20, hay.length) : 0;
}

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const docs: Doc[] = useMemo(() => {
    const n = news.map((n: { title: string; url: string; excerpt: string }) => ({ title: n.title, href: n.url, summary: n.excerpt }));
    const g = games.featured.map((g: { name: string; slug: string; platforms: string[] }) => ({ title: `${g.name} Hub`, href: `/${g.slug}`, summary: g.platforms.join(", ") }));
    return [...n, ...g];
  }, []);

  const results = useMemo(() => {
    if (!q) return [];
    const s = docs
      .map((d) => ({ d, s: score(q, d) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    return s.slice(0, 8).map((x) => x.d);
  }, [q, docs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setIdx(-1);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setOpen(false);
        setIdx(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = idx >= 0 ? results[idx] : results[0];
      if (target) window.location.assign(target.href);
    }
    if (e.key === "Escape") {
      setOpen(false);
      setIdx(-1);
    }
  }

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  return (
    <div style={{ position: "relative" }}>
      <button
        className="navlink"
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        aria-label="Search"
      >
        Search ⌘/
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal
          aria-label="Search"
          onClick={() => {
            setOpen(false);
            setIdx(-1);
          }}
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "transparent" }}
        >
          <div
            ref={dialogRef}
            className="card-glass"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              top: "56px",
              width: "min(600px, 94vw)",
              padding: 10,
              borderRadius: 12,
              maxHeight: "70vh",
            }}
          >
            <input
              id="gxb-search"
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setIdx(-1);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search news & hubs…"
              className="input reset"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10 }}
              aria-label="Search site"
            />
            <div ref={listRef} style={{ marginTop: 10, display: "grid", gap: 6, maxHeight: 260, overflow: "auto" }}>
              {results.length === 0 && <div style={{ opacity: 0.7 }}>Type to search…</div>}
              {results.map((r, i) => (
                <a
                  key={`${r.href}-${i}`}
                  href={r.href}
                  className="navlink"
                  data-active={i === idx}
                  style={{
                    display: "block",
                    background: i === idx ? "rgba(255,255,255,.10)" : "transparent",
                    borderRadius: 8,
                  }}
                  onMouseEnter={() => setIdx(i)}
                >
                  {r.title}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, opacity: 0.6, fontSize: 12, marginTop: 8 }}>
              <span>↑↓ navigate</span>
              <span>Enter open</span>
              <span>Esc close</span>
              <span>/ focus</span>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          .card-glass {
            width: 100vw !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

