import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/signedImage";
import NewsCard from "@/components/common/NewsCard";

type Row = {
  slug: string;
  title: string;
  excerpt?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  status?: string | null;
};

export default function NewsIndexDb(){
  const [rows, setRows] = useState<Row[]>([]);
  const [covers, setCovers] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("news")
        .select("slug, title, excerpt, image_path, image_url, published_at, status")
        .eq("status", "published")
        .order("published_at", { ascending: false } as any)
        .limit(60);
      setRows((data || []) as Row[]);
      setLoading(false);
    })();
  }, []);

  const pathList = useMemo(() => rows.map(r => r.image_path).filter(Boolean) as string[], [rows]);

  useEffect(() => {
    (async () => {
      if (!pathList.length) { setCovers({}); return; }
      const map = await getSignedUrls("media", pathList, 600);
      setCovers(map);
    })();
  }, [pathList]);

  return (
    <>
      <Helmet>
        <title>News | GameXBuddy</title>
        <link rel="canonical" href={canonical("/news")} />
        <meta name="description" content="Official and curated gaming news: GTA 6, Minecraft, PUBG, and more." />
      </Helmet>
      <div className="wrap">
        <h1>News</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div style={{ display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))" }}>
            {rows.map(n => (
              <NewsCard
                key={n.slug}
                title={n.title}
                description={n.excerpt || ""}
                imageUrl={n.image_path ? covers[n.image_path] : (n.image_url || undefined)}
                link={`/news/${n.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

