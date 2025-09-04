import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { sb } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/signedImage";
import GuideCardDb from "@/components/GuideCardDb";

export default function GuidesIndex(){
  const [rows, setRows] = useState<any[]>([]);
  const [prefetched, setPrefetched] = useState<Record<string,string|undefined>>({});

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("guides")
        .select("slug, title, cover_path, published_at, status")
        .eq("status", "published")
        .order("published_at", { ascending: false } as any)
        .limit(48);
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
        <div className="grid" style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))' }}>
          {rows.map((g) => (
            <GuideCardDb key={g.slug} title={g.title} slug={g.slug} cover_path={g.cover_path} />
          ))}
          {!rows.length && <div style={{ opacity:.8 }}>No guides yet.</div>}
        </div>
      </div>
    </section>
  );
}
