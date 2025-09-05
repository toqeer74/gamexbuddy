import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";

type NewsRow = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  tags: string[] | null;
  published_at: string; // ISO
  source_url: string;
  source: string;
};

const PAGE_SIZE = 12;

export default function NewsFeedDb() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const envMissing = useMemo(() => {
    try {
      // @ts-ignore
      return !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
    } catch {
      return false;
    }
  }, []);

  const loadPage = useCallback(async (nextPage: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const from = nextPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("news")
        .select("id,title,slug,excerpt,image_url,tags,published_at,source_url,source")
        .order("published_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      const rows = (data as NewsRow[]) || [];
      setItems((prev) => (nextPage === 0 ? rows : prev.concat(rows)));
      setHasMore(rows.length === PAGE_SIZE);
      setPage(nextPage);
    } catch (e: any) {
      setError(e?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  if (envMissing) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-white/70">
          Supabase settings missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live news.
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">Latest News</h2>

      {error && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-2">
          {error}
        </div>
      )}

      {items.length === 0 && !loading && !error && (
        <div className="text-center text-white/70">No articles yet</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <article
            key={n.id}
            className="group overflow-hidden rounded-xl border border-cyan-400/20 bg-white/5 backdrop-blur shadow-[0_0_0_1px_rgba(88,224,255,0.15),0_10px_30px_rgba(0,0,0,0.35)] hover:border-cyan-400/40 transition-colors"
          >
            <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={n.image_url || "/placeholder.svg"}
                alt={n.title}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
            </a>
            <div className="p-4">
              <a
                href={n.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-white hover:text-cyan-300 transition-colors"
              >
                {n.title}
              </a>
              <p className="mt-2 text-sm text-white/80">
                {(n.excerpt || "").slice(0, 150)}{(n.excerpt || "").length > 150 ? "…" : ""}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span className="uppercase tracking-wide">{n.source}</span>
                <time title={new Date(n.published_at).toLocaleString()}>
                  {formatDistanceToNow(new Date(n.published_at), { addSuffix: true })}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center">
        {hasMore ? (
          <button
            onClick={() => loadPage(page + 1)}
            disabled={loading}
            className="rounded-md border border-cyan-400/30 bg-white/5 px-4 py-2 text-white hover:bg-white/10 disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        ) : (
          items.length > 0 && (
            <div className="text-white/50 text-sm">You\'re all caught up</div>
          )
        )}
      </div>
    </section>
  );
}

