import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const url = Deno.env.get("SUPABASE_URL")!;
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(url, key);

serve(async (req) => {
  const u = new URL(req.url);
  const target = u.searchParams.get("url") || "https://gamexbuddy.com";
  const label = u.searchParams.get("label") || "";
  const sku   = u.searchParams.get("sku") || "";
  const ref   = u.searchParams.get("ref") || "gamexbuddy";
  const ip    = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0];
  const ua    = req.headers.get("user-agent") || "";

  // Try to identify user from Authorization Bearer
  let userId: string | null = null;
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (token) {
    try {
      const { data: { user } } = await sb.auth.getUser(token);
      userId = user?.id ?? null;
    } catch {}
  }

  try {
    await sb.from("affiliate_clicks").insert({ user_id: userId, url: target, label, sku, ref, ip, ua });
  } catch (_e) {}

  // Idempotent award per SKU via RPC + unique key on ledger
  if (userId && sku) {
    try { await sb.rpc("award_points", { p_event_type: "affiliate_click", p_event_ref: sku, p_delta: 5 }); } catch {}
  }

  const redirectTo = target + (target.includes("?") ? "&" : "?") + `ref=${encodeURIComponent(ref)}`;
  return new Response(null, { status: 302, headers: { Location: redirectTo } });
});
