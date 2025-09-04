import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SB_URL, SB_KEY);

async function fetchFeed() {
  const res = await fetch("https://example.com/feed.json");
  if (!res.ok) throw new Error("feed");
  return res.json();
}

function slugify(s: string){
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

serve(async () => {
  try {
    const feed = await fetchFeed();
    const rows = (feed.items || []).slice(0, 20).map((it:any) => ({
      source: it.source || "curated",
      title: it.title,
      slug: slugify(it.title),
      excerpt: it.description?.slice(0,200) || "",
      body_html: it.content_html || it.description || "",
      url: it.url,
      image_url: it.image || it.banner_image || "",
      tags: it.tags || [],
      published_at: it.date_published || new Date().toISOString(),
      status: "published"
    }));

    for (const r of rows) {
      await sb.from("news").upsert(r, { onConflict: "slug" });
    }

    return new Response(JSON.stringify({ ok:true, upserted: rows.length }), { headers: { "content-type":"application/json" }});
  } catch (_e) {
    return new Response(JSON.stringify({ ok:false }), { status: 500 });
  }
});
