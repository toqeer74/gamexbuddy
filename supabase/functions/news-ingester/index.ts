// Supabase Edge Function: news-ingester
// - Aggregates RSS feeds (Rockstar, IGN, PCGamer, Kotaku)
// - Normalizes and upserts into public.news (creates table if missing)
// - Safe per-feed error handling; suitable for cron scheduling

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Parser from "https://esm.sh/rss-parser@3.13.0";
import { Client as PgClient } from "https://deno.land/x/postgres@v0.17.2/mod.ts";

type NewsRow = {
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  tags: string[];
  published_at: string; // ISO
  source_url: string;
  source: string;
};

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DB_URL = Deno.env.get("SUPABASE_DB_URL"); // Optional: direct SQL for table creation

const sb = createClient(SB_URL, SB_KEY);
const parser = new Parser({
  timeout: 15000,
});

const FEEDS: { source: string; url: string }[] = [
  { source: "rockstar", url: "https://www.rockstargames.com/newswire.rss" },
  { source: "ign", url: "https://www.ign.com/rss.xml" },
  { source: "pcgamer", url: "https://www.pcgamer.com/rss/" },
  { source: "kotaku", url: "https://kotaku.com/rss" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function firstImage(html?: string): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function pickImage(it: any): string | null {
  if (it.enclosure?.url) return it.enclosure.url;
  if ((it as any)["media:content"]?.["$"]?.url) return (it as any)["media:content"]["$"]?.url;
  return firstImage(it["content:encoded"] || it.content || it.summary || it.description);
}

function normalizeItem(source: string, it: any): NewsRow | null {
  const title = (it.title || "").toString().trim();
  const link = (it.link || it.guid || "").toString().trim();
  if (!title || !link) return null;
  const slug = slugify(title);
  const excerpt = (it.contentSnippet || it.summary || it.description || "").toString().replace(/\s+/g, " ").trim().slice(0, 280);
  const image_url = pickImage(it);
  const tags: string[] = Array.isArray(it.categories) ? it.categories.map((c: any) => String(c)) : [];
  const published_at = new Date(it.isoDate || it.pubDate || Date.now()).toISOString();
  const source_url = link;
  return { title, slug, excerpt, image_url, tags, published_at, source_url, source };
}

async function ensureTableExists(): Promise<{ created: boolean; ok: boolean; error?: string }> {
  if (!DB_URL) return { created: false, ok: true };
  try {
    const pg = new PgClient(DB_URL);
    await pg.connect();
    try {
      await pg.queryObject(`
        create table if not exists public.news (
          id bigserial primary key,
          title text not null,
          slug text not null unique,
          excerpt text,
          image_url text,
          tags text[] default '{}',
          published_at timestamptz not null,
          source_url text not null,
          source text not null,
          created_at timestamptz default now()
        );
        create index if not exists news_published_idx on public.news (published_at desc);
        create index if not exists news_source_idx on public.news (source);
      `);
    } finally {
      await pg.end();
    }
    return { created: true, ok: true };
  } catch (e) {
    return { created: false, ok: false, error: (e as Error).message };
  }
}

async function processFeed(def: { source: string; url: string }) {
  const out: { upserted: number; source: string; url: string; errors?: string[] } = {
    upserted: 0,
    source: def.source,
    url: def.url,
    errors: [],
  };
  try {
    const feed = await parser.parseURL(def.url);
    const items = (feed.items || [])
      .map((it) => normalizeItem(def.source, it))
      .filter(Boolean) as NewsRow[];
    for (const row of items) {
      const { error } = await sb.from("news").upsert(row, { onConflict: "slug" });
      if (error) out.errors!.push(error.message);
      else out.upserted += 1;
    }
  } catch (e) {
    out.errors!.push((e as Error).message);
  }
  return out;
}

serve(async (_req) => {
  const start = Date.now();
  const ensure = await ensureTableExists();
  const results = [] as Awaited<ReturnType<typeof processFeed>>[];

  for (const f of FEEDS) {
    results.push(await processFeed(f));
  }

  const total = results.reduce((a, r) => a + r.upserted, 0);
  const took = Date.now() - start;

  const payload = {
    ok: true,
    createdTable: ensure.created && ensure.ok,
    tableCreateError: ensure.ok ? undefined : ensure.error,
    totalUpserted: total,
    results,
    tookMs: took,
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: { "content-type": "application/json" },
  });
});

