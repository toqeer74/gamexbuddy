import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { sb } from "@/lib/supabase";
import { getSignedUrl, getSignedUrls } from "@/lib/signedImage";
import HeroCountdownPro from "@/components/HeroCountdownPro";
import TrailerEmbed from "@/components/common/TrailerEmbed";
import NewsCard from "@/components/common/NewsCard";
import GuideCardDb from "@/components/GuideCardDb";
import AdSlot from "@/components/ads/AdSlot";
import { usePremium } from "@/hooks/usePremium";

type Game = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  cover_path?: string | null;
};

type News = {
  slug: string;
  title: string;
  excerpt?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  published_at?: string | null;
};

type Guide = {
  slug: string;
  title: string;
  description?: string | null;
  cover_path?: string | null;
  tags?: string[] | null;
};

export default function HubDetail(){
  const { slug = "" } = useParams();
  const [game, setGame] = React.useState<Game | null>(null);
  const [cover, setCover] = React.useState<string | undefined>(undefined);
  const [news, setNews] = React.useState<News[]>([]);
  const [newsCovers, setNewsCovers] = React.useState<Record<string, string | undefined>>({});
  const [guides, setGuides] = React.useState<Guide[]>([]);
  const { isPremium } = usePremium();

  React.useEffect(() => {
    (async () => {
      // Load game header info
      const { data: g } = await sb.from("games").select("id, slug, title, description, cover_path").eq("slug", slug).maybeSingle();
      const row = (g || null) as any as Game | null;
      setGame(row);
      if (row?.cover_path) setCover(await getSignedUrl("media", row.cover_path, 3600, 1200));

      // Related news: tags contains slug OR title ilike
      const { data: newsRows } = await sb
        .from("news")
        .select("slug, title, excerpt, image_path, image_url, published_at")
        .or(`tags.cs.{${slug}},title.ilike.%${slug}%` as any)
        .order("published_at", { ascending: false } as any)
        .limit(12);
      const n = (newsRows as any as News[]) || [];
      setNews(n);
      const paths = n.map(r => r.image_path || "").filter(Boolean) as string[];
      if (paths.length) setNewsCovers(await getSignedUrls("media", paths, 600)); else setNewsCovers({});

      // Related guides: tags contains slug OR title ilike
      const { data: guideRows } = await sb
        .from("guides")
        .select("slug, title, description, cover_path, tags")
        .or(`tags.cs.{${slug}},title.ilike.%${slug}%` as any)
        .order("created_at", { ascending: false } as any)
        .limit(12);
      setGuides((guideRows as any as Guide[]) || []);
    })();
  }, [slug]);

  const isGTA6 = slug.toLowerCase() === "gta6" || slug.toLowerCase() === "gta-6" || slug.toLowerCase() === "grand-theft-auto-vi";

  return (
    <section className="section">
      <Helmet>
        <title>{game?.title ? `${game.title} Hub` : `Hub`} | GameXBuddy</title>
        {game?.description && <meta name="description" content={game.description} />}
        {game?.title && (
          <script type="application/ld+json">{JSON.stringify({
            "@context":"https://schema.org",
            "@type":"VideoGame",
            name: game.title,
            description: game.description || undefined,
          })}</script>
        )}
      </Helmet>

      <div className="wrap">
        <nav style={{ fontSize: 13, opacity: .8, marginBottom: 10 }}>
          <Link to="/">Home</Link> / <span>Hubs</span> / <span>{game?.title || slug}</span>
        </nav>

        <header className="grid gap-4 mb-6" style={{ gridTemplateColumns: "220px 1fr" }}>
          <div>
            {cover && (
              <img src={cover} alt={game?.title || slug} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12 }} />
            )}
          </div>
          <div>
            <h1 className="title-xl font-extrabold">{game?.title || slug}</h1>
            {game?.description && <p className="opacity-90 mt-2" style={{ whiteSpace: "pre-wrap" }}>{game.description}</p>}
          </div>
        </header>

        {isGTA6 && (
          <div className="mb-8">
            <h2 className="font-bold mb-2">GTA 6 Countdown</h2>
            <HeroCountdownPro targetISO="2026-05-26T00:00:00Z" />
          </div>
        )}

        {!isPremium && (
          <div className="mb-8">
            <AdSlot placement={`hub_${slug}_top`} size="728x90" />
          </div>
        )}

        {isGTA6 && (
          <div className="mb-10">
            <h2 className="font-bold mb-3">Official Trailers</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <TrailerEmbed youtubeId="QdBZY2fkU-0" title="Grand Theft Auto VI - Trailer 1" />
            </div>
          </div>
        )}

        {isGTA6 && (
          <div className="mb-10">
            <h2 className="font-bold mb-3">Map & Setting</h2>
            <p className="opacity-80 mb-2">Curated images and concept art from official sources.</p>
            <GtaMapGallery />
          </div>
        )}

        <div className="mb-10">
          <h2 className="font-bold mb-3">Latest News</h2>
          {news.length ? (
            <div style={{ display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))" }}>
              {news.map(n => (
                <NewsCard
                  key={n.slug}
                  title={n.title}
                  description={n.excerpt || ""}
                  imageUrl={n.image_path ? newsCovers[n.image_path] : (n.image_url || undefined)}
                  link={`/news/${n.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="opacity-80">No news yet.</div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="font-bold mb-3">Guides</h2>
          {guides.length ? (
            <div className="grid" style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))' }}>
              {guides.map(g => (
                <GuideCardDb key={g.slug} title={g.title} slug={g.slug} cover_path={g.cover_path || undefined} />
              ))}
            </div>
          ) : (
            <div className="opacity-80">No guides yet.</div>
          )}
        </div>

        {!isPremium && (
          <div className="mb-4">
            <AdSlot placement={`hub_${slug}_bottom`} size="728x90" />
          </div>
        )}
      </div>
    </section>
  );
}

function GtaMapGallery(){
  const [urls, setUrls] = React.useState<string[]>([]);
  React.useEffect(() => {
    (async () => {
      // Attempt to fetch a small curated set from Storage. You can upload your own.
      const candidates = [
        "gta6/map-vice-city-1.jpg",
        "gta6/map-vice-city-2.jpg",
        "gta6/setting-miami-1.jpg",
      ];
      const out: string[] = [];
      for (const p of candidates) {
        const u = await getSignedUrl("media", p, 600, 1200);
        if (u) out.push(u);
      }
      setUrls(out);
    })();
  }, []);
  if (!urls.length) return null;
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {urls.map((u, i) => (
        <img key={i} src={u} alt="GTA 6 map/setting" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10 }} />
      ))}
    </div>
  );
}
