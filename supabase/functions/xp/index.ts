import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SB_URL, SB_KEY);

const POINTS: Record<string, number> = {
  post_create: 10,
  reply_create: 6,
  like_received: 2,
  daily_login: 3,
  meme_upload: 4,
};

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const { user_id, action, meta = {} } = await req.json();
    if (!user_id || !action || !(action in POINTS)) return new Response("Bad request", { status: 400 });

    // Example cap: like_received <= 50/day
    if (action === "like_received") {
      const { data: cnt } = await sb.rpc("count_like_received_today", { uid: user_id });
      const count = Array.isArray(cnt) ? (cnt[0]?.count ?? 0) : (cnt as any)?.count ?? 0;
      if (count >= 50) return new Response(JSON.stringify({ capped: true }), { headers: { "content-type": "application/json" } });
    }

    const points = POINTS[action];
    // Reuse server-side SQL to ensure atomicity and consistent rules
    await sb.rpc("apply_xp", { user_uuid: user_id, pts: points, act: action, meta });

    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" }});
  } catch (_e) {
    return new Response("Error", { status: 500 });
  }
});
