// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Required envs guard
const REQUIRED = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
for (const k of REQUIRED) {
  if (!Deno.env.get(k)) {
    console.error(`Missing env ${k}`);
    throw new Error(`Missing env ${k}`);
  }
}

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CHEAPSHARK_BASE = Deno.env.get("CHEAPSHARK_BASE") || "https://www.cheapshark.com/api/1.0";

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

// Discount/badge rules (tweakable)
const STRONG_DISCOUNT = 60;
const MEDIUM_DISCOUNT = 40;

type Deal = {
  dealID: string;
  storeID: string;
  savings?: string | number;
  salePrice?: string | number;
  normalPrice?: string | number;
};

async function fetchStores(): Promise<Record<string, string>> {
  const r = await fetch(`${CHEAPSHARK_BASE}/stores`);
  if (!r.ok) return {};
  const list = await r.json();
  const map: Record<string, string> = {};
  for (const s of list) map[s.storeID] = s.storeName;
  return map;
}

async function fetchDealsByTitle(title: string): Promise<Deal[]> {
  const search = await fetch(`${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(title)}&limit=1`);
  if (!search.ok) return [];
  const arr = await search.json();
  if (!Array.isArray(arr) || !arr.length) return [];
  const gameID = arr[0]?.gameID;
  if (!gameID) return [];
  const details = await fetch(`${CHEAPSHARK_BASE}/games?id=${encodeURIComponent(gameID)}`);
  if (!details.ok) return [];
  const j = await details.json();
  const deals: Deal[] = Array.isArray(j?.deals) ? j.deals : [];
  return deals;
}

async function upsertOffers(gameId: string, deals: Deal[], storeNames: Record<string, string>): Promise<{ count: number; bestDiscount: number }> {
  // Only replace offers if we actually fetched fresh deals.
  // This avoids wiping existing offers on transient API failures.
  if (!deals.length) return { count: 0, bestDiscount: 0 };
  await sb.from("game_offers").delete().eq("game_id", gameId);

  const rows = deals.slice(0, 20).map((d) => {
    const discount = Math.round(Number(d.savings ?? 0));
    const price = Number(d.salePrice ?? d.normalPrice ?? 0);
    const store = storeNames[d.storeID] || `Store ${d.storeID}`;
    return {
      game_id: gameId,
      store,
      url: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
      price,
      currency: "USD",
      discount,
    };
  });

  const { error } = await sb.from("game_offers").insert(rows);
  if (error) throw error;

  const bestDiscount = rows.reduce((m, r) => Math.max(m, r.discount || 0), 0);
  return { count: rows.length, bestDiscount };
}

function badgeForDiscount(best: number): string | null {
  if (best >= STRONG_DISCOUNT) return "🔥 Hot Deal";
  if (best >= MEDIUM_DISCOUNT) return "💸 Great Price";
  return null;
}

async function maybeUpdateBadge(gameId: string, bestDiscount: number): Promise<boolean> {
  const label = badgeForDiscount(bestDiscount);
  if (!label) return false;

  // Only update if game is already in recommended_games
  const { data: rec, error } = await sb
    .from("recommended_games")
    .select("id, rank, badge")
    .eq("game_id", gameId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!rec?.id) return false; // do not create new recommendation rows

  if (rec.badge === label) return false; // no change
  const { error: upErr } = await sb.from("recommended_games").update({ badge: label }).eq("id", rec.id);
  if (upErr) throw upErr;
  return true;
}

async function processPage(offset: number, pageSize: number, stores: Record<string, string>) {
  const { data: games, error } = await sb
    .from("games")
    .select("id, title")
    .order("created_at", { ascending: false } as any)
    .range(offset, offset + pageSize - 1);

  if (error) throw error;
  if (!games || !games.length) return { processed: 0, refreshed: 0, updatedBadges: 0 };

  let refreshed = 0;
  let updatedBadges = 0;

  for (const g of games) {
    try {
      const deals = await fetchDealsByTitle(g.title);
      const { bestDiscount } = await upsertOffers(g.id, deals, stores);
      refreshed += 1; // replaced offers (even if 0)
      const changed = await maybeUpdateBadge(g.id, bestDiscount);
      if (changed) updatedBadges += 1;
    } catch (e) {
      console.error(`deal-radar: game ${g.id} "${g.title}" failed:`, (e as any)?.message ?? String(e));
      // continue
    }
  }

  return { processed: games.length, refreshed, updatedBadges };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { "content-type": "text/plain" } });

  // Optional: accept { pageSize?: number, maxPages?: number }
  const body = await req.json().catch(() => ({}));
  const pageSize = Math.min(Math.max(Number(body?.pageSize ?? 200), 1), 500);
  const maxPages = Math.min(Math.max(Number(body?.maxPages ?? 9999), 1), 9999);

  try {
    const stores = await fetchStores();

    let offset = 0;
    let page = 0;
    let totalProcessed = 0;
    let totalRefreshed = 0;
    let totalUpdatedBadges = 0;

    while (page < maxPages) {
      const { processed, refreshed, updatedBadges } = await processPage(offset, pageSize, stores);
      if (!processed) break;
      totalProcessed += processed;
      totalRefreshed += refreshed;
      totalUpdatedBadges += updatedBadges;
      console.log(`deal-radar: page=${page} processed=${processed} refreshed=${refreshed} badges=${updatedBadges}`);
      offset += pageSize;
      page += 1;
    }

    return new Response(
      JSON.stringify({ ok: true, processed: totalProcessed, refreshed: totalRefreshed, updatedBadges: totalUpdatedBadges }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (e: any) {
    console.error("deal-radar error:", e?.message ?? String(e));
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});

