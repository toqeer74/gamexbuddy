import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { addXp } from "@/lib/xp";
import SmartImage from "@/components/common/SmartImage";
import ReportButton from "@/components/community/ReportButton";
import { getPosts as getCommunityPosts, getUserLikesForPosts, toggleLike } from "@/lib/communityApi";

type Post = { id: string; title: string; image?: string; image_url?: string; likes?: number; like_count?: number };

export default function MemeWall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id || null;
      setUserId(uid);
      const { data, error } = await getCommunityPosts("meme");
      const list = ((data as any[]) || []) as Post[];
      if (!error) setPosts(list);
      if (uid && list.length) {
        const ids = list.map((p) => String(p.id));
        const { data: likedIds } = await getUserLikesForPosts(ids, uid);
        const lm: Record<string, boolean> = {};
        (likedIds || []).forEach((pid) => (lm[pid] = true));
        setLiked(lm);
      }
    })();
  }, []);

  const like = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { alert("Please sign in to like posts"); return; }
    const wasLiked = !!liked[id];
    try {
      await toggleLike(id, userData.user.id);
      setLiked((m) => ({ ...m, [id]: !wasLiked }));
      setPosts((prev) => prev.map((p) => p.id === id ? {
        ...p,
        like_count: Math.max(0, (p.like_count ?? p.likes ?? 0) + (wasLiked ? -1 : 1)),
        likes: Math.max(0, (p.likes ?? p.like_count ?? 0) + (wasLiked ? -1 : 1)),
      } : p));
      if (!wasLiked) { try { await addXp(1); } catch {} }
    } catch {}
  };

  // Realtime: likes and posts
  useEffect(() => {
    const likesChannel = supabase
      .channel("public:likes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes" },
        (payload: any) => {
          const pid = payload.new?.post_id as string | undefined;
          if (!pid) return;
          setPosts((prev) => prev.map((p) => (p.id === pid ? { ...p, like_count: (p.like_count ?? p.likes ?? 0) + 1, likes: (p.likes ?? p.like_count ?? 0) + 1 } : p)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "likes" },
        (payload: any) => {
          const pid = payload.old?.post_id as string | undefined;
          if (!pid) return;
          setPosts((prev) => prev.map((p) => (p.id === pid ? { ...p, like_count: Math.max(0, (p.like_count ?? p.likes ?? 0) - 1), likes: Math.max(0, (p.likes ?? p.like_count ?? 0) - 1) } : p)));
        }
      )
      .subscribe();

    const postsChannel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload: any) => {
          const row = payload.new as any;
          if (row?.type !== "meme") return;
          setPosts((prev) => [{ id: row.id, title: row.title, image_url: row.image_url, like_count: 0 }, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload: any) => {
          const row = payload.old as any;
          if (row?.type !== "meme") return;
          setPosts((prev) => prev.filter((p) => p.id !== row.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(postsChannel);
    };
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">From Our Community</h2>
        <div className="wall-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {posts.map((p) => {
            const count = p.like_count ?? p.likes ?? 0;
            const img = p.image_url || p.image || "";
            return (
              <figure key={p.id} className="wall-card card-glass" style={{ overflow: "hidden", isolation: "isolate" }}>
                <SmartImage src={img} alt={p.title} className="w-full h-56 object-cover block transition-transform duration-200 ease-in-out group-hover:scale-105" />
                <figcaption className="p" style={{ padding: 10 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700 }}>
                    {p.title} {count > 50 ? <span className="badge badge--trend">Trending</span> : null}
                  </div>
                  <button
                    onClick={() => like(p.id)}
                    className="nf__btn"
                    style={{ padding: "6px 10px", fontSize: 12, opacity: liked[p.id] ? 0.7 : 1 }}
                    aria-pressed={liked[p.id] ? "true" : "false"}
                  >
                    {liked[p.id] ? "♥ Liked" : "♡ Like"} ({count})
                  </button>
                  <div style={{ marginTop: 6 }}>
                    <ReportButton postId={p.id} userId={userId || undefined} />
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
