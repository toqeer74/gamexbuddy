import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { addXp } from "@/lib/xp";

type Post = { id: string; title: string; image: string; likes: number };

export default function MemeWall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: auth }, { data, error }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("memewall").select("*")
      ]);
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts((data as Post[]) || []);
      }
      const uid = auth.user?.id || null;
      setUserId(uid);
      if (uid) {
        const { data: likes } = await supabase
          .from("memewall_likes")
          .select("post_id")
          .eq("user_id", uid);
        const lm: Record<string, boolean> = {};
        (likes || []).forEach((r: any) => (lm[r.post_id] = true));
        setLiked(lm);
      }
    })();
  }, []);

  const like = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert('Please sign in to like posts');
      return;
    }
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    // Prevent double-like per user
    if (liked[id]) return;

    const { data, error } = await supabase
      .from("memewall")
      .update({ likes: post.likes + 1 })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating likes:", error);
      return;
    }

    if (data && data.length > 0) {
      const updatedPost = data[0] as Post;
      setPosts((prev) => prev.map((p) => (p.id === id ? updatedPost : p)));
      try { await addXp(1); } catch {}
      if (userId) {
        // Record like to prevent duplicates
        await supabase.from("memewall_likes").insert({ post_id: id, user_id: userId });
        setLiked((m) => ({ ...m, [id]: true }));
      }
    }
  };

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">From Our Community</h2>
        <div className="wall-grid">
          {posts.map((p) => (
            <figure key={p.id} className="wall-card">
              <img src={p.image} alt={p.title} />
              <figcaption className="p">
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                <button
                  onClick={() => like(p.id)}
                  className="nf__btn"
                  disabled={!!liked[p.id]}
                  style={{ padding: "6px 10px", fontSize: 12, opacity: liked[p.id] ? 0.7 : 1 }}
                  aria-pressed={!!liked[p.id]}
                >
                  {liked[p.id] ? "❤️ Liked" : "❤️ Like"} ({p.likes})
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
