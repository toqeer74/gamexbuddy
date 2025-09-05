import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { sb } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/signedImage";
import GuideCardDb from "@/components/GuideCardDb";

export default function GuidesIndex(){
  const [rows, setRows] = useState<any[]>([]);
  const [prefetched, setPrefetched] = useState<Record<string,string|undefined>>({});
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("guides")
        .select("id, slug, title, description, cover_path, tags, created_at")
        .order("created_at", { ascending: false } as any)
        .limit(200);
      setRows(data || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const paths = (rows || []).map((g:any) => g.cover_path).filter(Boolean) as string[];
      if (!paths.length) return;
      const m = await getSignedUrls("media", paths, 600);
      setPrefetched(m);
    })();
  }, [rows]);

  const tags = useMemo(() => {
    const s = new Set<string>();
    (rows || []).forEach((r: any) => (r.tags || []).forEach((t: string) => s.add(t)));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    return (rows || []).filter((r: any) => {
      const byQ = q ? (r.title?.toLowerCase().includes(q.toLowerCase()) || r.description?.toLowerCase().includes(q.toLowerCase())) : true;
      const byTag = tag ? (r.tags || []).includes(tag) : true;
      return byQ && byTag;
    });
  }, [rows, q, tag]);

  return (
    <section className="section">
      <Helmet>
        <title>Guides — Gear & Gaming Guides</title>
        <meta name="description" content="In-depth buying guides and gaming how-tos with affiliate-ready picks." />
      </Helmet>
      <div className="wrap">
        <nav style={{ fontSize: 13, opacity: .8, marginBottom: 10 }}>
          <Link to="/">Home</Link> / <span>Guides</span>
        </nav>
        <h1 className="h2">Gear & Gaming Guides</h1>
        <div style={{ display:'flex', gap:8, margin:"12px 0 16px" }}>
          <input className="input" placeholder="Search guides" value={q} onChange={e=>setQ(e.target.value)} style={{ flex:1 }} />
          <select className="input" value={tag} onChange={e=>setTag(e.target.value)}>
            <option value="">All tags</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid" style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))' }}>
          {filtered.map((g) => (
            <GuideCardDb key={g.slug} title={g.title} slug={g.slug} cover_path={g.cover_path} />
          ))}
          {!filtered.length && <div style={{ opacity:.8 }}>No guides match.</div>}
        </div>
      </div>
    </section>
  );
}

