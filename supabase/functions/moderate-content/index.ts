import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const body = await req.json().catch(()=>({text:""}));
  const text = (body.text || "").slice(0, 5000);

  // TODO: call moderation provider; here we just allow
  const flagged = false;

  return new Response(JSON.stringify({ flagged }), { headers: { "content-type": "application/json" }});
});

