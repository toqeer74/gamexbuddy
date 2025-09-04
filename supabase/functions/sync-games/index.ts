// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// Required envs guard
const REQUIRED = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RAWG_API_KEY"] as const;
for (const k of REQUIRED) {
  if (!Deno.env.get(k)) {
    console.error(`Missing env ${k}`);
    throw new Error(`Missing env ${k}`);
  }
}

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RAWG_KEY = Deno.env.get("RAWG_API_KEY")!;
const CHEAPSHARK_BASE = Deno.env.get("CHEAPSHARK_BASE") || "https://www.cheapshark.com/api/1.0";

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

type SyncResult = { slug: string; id?: string; offers?: number; error?: string };

async function fetchRAWG(slug: string) {
  const u = `https://api.rawg.io/api/games/${encodeURIComponent(slug)}?key=${RAWG_KEY}`;
  const r = await fetch(u, { headers: { "accept": "application/json" } });
  if (!r.ok) throw new Error(`RAWG ${slug} ${r.status}`);
  return await r.json();
}

async function fetchBuffer(url?: string): Promise<Uint8Array | undefined> {
  if (!url) return undefined;
  const res = await fetch(url);
  if (!res.ok) return undefined;
  const ab = new Uint8Array(await res.arrayBuffer());
  return ab;
}

async function uploadImage(path: string, bytes?: Uint8Array) {
  if (!bytes) return undefined;
  const { data, error } = await sb.storage.from("media").upload(path, bytes, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  return data?.path || path;
}

async function getCheapSharkStores(): Promise<Record<string, string>> {
  const r = await fetch(`${CHEAPSHARK_BASE}/stores`);
  if (!r.ok) return {};
  const a = await r.json();
  const map: Record<string, string> = {};
  for (const s of a) map[s.storeID] = s.storeName;
  return map;
}

async function syncOffers(gameId: string, title: string) {
  // Search gameID by title
  const search = await fetch(`${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(title)}&limit=1`);
  if (!search.ok) return 0;
  const arr = await search.json();
  if (!Array.isArray(arr) || !arr.length) return 0;
  const gameID = arr[0]?.gameID;
  if (!gameID) return 0;

  const stores = await getCheapSharkStores();
  const dealsRes = await fetch(`${CHEAPSHARK_BASE}/games?id=${encodeURIComponent(gameID)}`);
  if (!dealsRes.ok) return 0;
  const dealsJson = await dealsRes.json();
  const deals: any[] = dealsJson?.deals || [];

  // Replace offers for this game
  await sb.from("game_offers").delete().eq("game_id", gameId);

  const rows = deals.slice(0, 12).map((d: any) => ({
    game_id: gameId,
    store: stores[d.storeID] || `Store ${d.storeID}`,
    url: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
    price: Number(d.salePrice ?? d.normalPrice ?? 0),
    currency: "USD",
    discount: Math.round(Number(d.savings ?? 0)),
  }));
  if (!rows.length) return 0;
  const { error } = await sb.from("game_offers").insert(rows);
  if (error) throw error;
  return rows.length;
}

function short(s?: string, n = 700) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n) : s;
}

async function handleSync(slugs: string[]): Promise<SyncResult[]> {
  const out: SyncResult[] = [];
  for (const slug of slugs) {
    const res: SyncResult = { slug };
    try {
      const g = await fetchRAWG(slug);
      const coverUrl: string | undefined = g.background_image || g.background_image_additional || undefined;
      const heroUrl: string | undefined = g.background_image_additional && g.background_image ? g.background_image_additional : g.background_image || undefined;

      const cov = await fetchBuffer(coverUrl);
      const her = await fetchBuffer(heroUrl);

      const cover_path = await uploadImage(`covers/${slug}.jpg`, cov);
      const hero_path = await uploadImage(`heroes/${slug}.jpg`, her);

      const developers: string[] = Array.isArray(g.developers) ? g.developers.map((d: any) => d.name).filter(Boolean) : [];
      const genres: string[] = Array.isArray(g.genres) ? g.genres.map((d: any) => d.name).filter(Boolean) : [];
      const platforms: string[] = Array.isArray(g.platforms) ? g.platforms.map((p: any) => p.platform?.name).filter(Boolean) : [];

      const upsertRow = {
        slug,
        title: g.name ?? slug,
        description: short(g.description_raw ?? undefined, 700),
        rating: g.metacritic ?? g.rating ?? null,
        released: g.released ?? null,
        developers,
        genres,
        platforms,
        cover_path: cover_path ?? null,
        hero_path: hero_path ?? null,
      };

      const { data: game, error } = await sb.from("games").upsert(upsertRow, { onConflict: "slug" }).select("id, title").single();
      if (error) throw error;
      res.id = game.id;

      // Sync offers
      try {
        res.offers = await syncOffers(game.id, game.title);
      } catch (e) {
        // keep going if offers fail
        res.offers = 0;
      }
    } catch (e: any) {
      res.error = e?.message ?? String(e);
    }
    out.push(res);
  }
  return out;
}

export const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const body = await req.json().catch(() => ({}));
    const slugs: string[] = Array.isArray(body?.slugs) ? body.slugs.slice(0, 50) : [];
    if (!slugs.length) return new Response(JSON.stringify({ ok: false, error: "Missing slugs[]" }), { status: 400, headers: { "content-type": "application/json" } });
    const results = await handleSync(slugs);
    return new Response(JSON.stringify({ ok: true, games: results }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
};

// Deno deploy-style default
export default handler;
