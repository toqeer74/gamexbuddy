import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { sb } from "@/lib/supabase";
import { getSignedUrl } from "@/lib/signedImage";

type Offer = { store: string; url: string; price: number | null; currency: string | null; discount: number | null };
type Row = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  cover_path?: string | null;
  rating?: number | null;
  platforms?: string[] | null;
  genres?: string[] | null;
  game_offers: Offer[];
};

export default function GameDetail() {
  const { slug = "" } = useParams();
  const [game, setGame] = React.useState<Row | null>(null);
  const [cover, setCover] = React.useState<string | undefined>();

  React.useEffect(() => {
    (async () => {
      const { data } = await sb
        .from("games")
        .select("id, slug, title, description, cover_path, rating, platforms, genres, game_offers(store, url, price, currency, discount)")
        .eq("slug", slug)
        .single();
      const row = (data as any as Row) || null;
      setGame(row);
      if (row?.cover_path) setCover(await getSignedUrl("media", row.cover_path, 3600, 1000));
    })();
  }, [slug]);

  if (!game) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description || undefined,
    genre: game.genres || undefined,
    gamePlatform: game.platforms || undefined,
  } as const;

  return (
    <section className="section">
      <Helmet>
        <title>{game.title} | GamexBuddy</title>
        {game.description && <meta name="description" content={game.description} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="wrap grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          {cover && <img src={cover} alt={game.title} style={{ width: "100%", height: "auto", borderRadius: 12 }} />}
        </div>
        <div>
          <h1 className="title-xl font-extrabold mb-2">{game.title}</h1>
          <div className="text-sm opacity-80 mb-3">
            {game.rating != null && <span className="mr-3">⭐ {game.rating}</span>}
            {Array.isArray(game.platforms) && game.platforms.length > 0 && <span>{game.platforms.join(", ")}</span>}
          </div>
          {game.description && <p className="opacity-90 mb-4" style={{ whiteSpace: "pre-wrap" }}>{game.description}</p>}
          <h2 className="font-bold mb-2">Offers</h2>
          <ul className="space-y-2">
            {game.game_offers?.length ? (
              game.game_offers.map((o, i) => (
                <li key={i} className="flex items-center justify-between gap-3 p-2 rounded-md border border-white/10 bg-white/5">
                  <span className="font-medium">{o.store}</span>
                  <span className="text-sm opacity-80">
                    {o.discount ? <b className="text-green-400 mr-2">-{o.discount}%</b> : null}
                    {o.price != null ? `${o.price} ${o.currency ?? "USD"}` : "See deal"}
                  </span>
                  <a className="btn" href={o.url} target="_blank" rel="noreferrer">View Deal</a>
                </li>
              ))
            ) : (
              <li>No offers available.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

