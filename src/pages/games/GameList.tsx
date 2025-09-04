import React from "react";
import { Link } from "react-router-dom";
import { sb } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/signedImage";

type Row = { id: string; slug: string; title: string; cover_path?: string | null; rating?: number | null };

export default function GameList() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [signed, setSigned] = React.useState<Record<string, string | undefined>>({});

  React.useEffect(() => {
    (async () => {
      const { data } = await sb.from("games").select("id, slug, title, cover_path, rating").order("created_at", { ascending: false }).limit(60);
      const rows = (data as any as Row[]) || [];
      setRows(rows);
      const paths = rows.map(r => r.cover_path || "").filter(Boolean) as string[];
      const map = await getSignedUrls("media", paths, 3600, 600);
      setSigned(map);
    })();
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="title-xl font-extrabold mb-4">Games</h1>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {rows.map(g => (
            <Link key={g.id} to={`/games/${g.slug}`} className="card-glass rounded-xl border border-white/10 overflow-hidden bg-white/5">
              {g.cover_path && (
                <img src={signed[g.cover_path]}
                     alt={g.title}
                     style={{ width: "100%", height: 140, objectFit: "cover" }}
                     loading="lazy" />
              )}
              <div className="p-3">
                <div className="font-bold">{g.title}</div>
                {g.rating != null && <div className="text-sm opacity-80">⭐ {g.rating}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

