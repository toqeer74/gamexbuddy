import React from "react";
import { motion } from "framer-motion";
import { sb } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/signedImage";
import AffiliateLink from "@/components/AffiliateLink";

type Offer = { store: string; url: string; price: number | null; currency: string | null; discount: number | null };
type Row = {
  id: string;
  slug?: string;
  title: string;
  description?: string | null;
  cover_path?: string | null;
  rating?: number | null;
  genres?: string[] | null;
  platforms?: string[] | null;
  recommended_games: { badge?: string | null; rank: number } | null;
  game_offers: Offer[];
};

export default function RecommendedGames() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [signed, setSigned] = React.useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await sb
        .from("games")
        .select(`id, slug, title, description, cover_path, rating, genres, platforms,
                 recommended_games!inner(badge, rank),
                 game_offers(store, url, price, currency, discount)`) // inner join to ensure recommendation
        .order("rank", { foreignTable: "recommended_games", ascending: true })
        .limit(18);
      const rows = (data as any as Row[]) || [];
      setRows(rows);
      const paths = rows.map(r => r.cover_path || "").filter(Boolean) as string[];
      const map = await getSignedUrls("media", paths, 3600, 600);
      setSigned(map);
      setLoading(false);
    })();
  }, []);

  if (!rows.length && loading) return null;

  return (
    <section className="section">
      <div className="wrap">
        {/* To use i18n here, replace the heading with t("best_games") after importing i18n hooks */}
        <h2 className="title-xl font-extrabold mb-4">World’s Best Recommended Games</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {rows.map((g, idx) => {
            const url = g.cover_path ? signed[g.cover_path] : undefined;
            const offers = (g.game_offers || []).slice(0, 2);
            return (
              <motion.article key={g.id} className="card-glass rounded-xl border border-white/10 overflow-hidden bg-white/5"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                {url && <img src={url} alt={g.title} style={{ width: "100%", height: 160, objectFit: "cover" }} loading="lazy" />}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold leading-snug">{g.title}</h3>
                    {g.recommended_games?.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-cyan-300">
                        {g.recommended_games.badge}
                      </span>
                    )}
                  </div>
                  {g.description && (
                    <p className="text-sm opacity-80 line-clamp-3">{g.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs opacity-80">
                    {g.rating != null && <span>⭐ {g.rating}</span>}
                    {Array.isArray(g.genres) && g.genres.slice(0, 2).map(x => <span key={x}>{x}</span>)}
                    {Array.isArray(g.platforms) && g.platforms.slice(0, 2).map(x => <span key={x}>{x}</span>)}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offers.map((o, i) => (
                      <AffiliateLink key={i} href={o.url} label={`${o.store}${o.price ? ` · ${o.price} ${o.currency ?? "USD"}` : ""}`}>
                        {o.store}{o.price ? ` · ${o.price} ${o.currency ?? "USD"}` : ""}
                      </AffiliateLink>
                    ))}
                    {!offers.length && (
                      <a className="btn btn--soft" href={`https://www.google.com/search?q=${encodeURIComponent(g.title + " deals")}`} target="_blank" rel="noreferrer">Search Deals</a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
