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

  // store click (best-effort; don’t block redirect on failure)
  try {
    await sb.from("affiliate_links").insert({
      merchant: label || "unknown",
      sku,
      url: target,
      clicks: 1
    });
  } catch (_e) {}

  const redirectTo = target + (target.includes("?") ? "&" : "?") + `ref=${encodeURIComponent(ref)}`;
  return new Response(null, { status: 302, headers: { Location: redirectTo } });
});
