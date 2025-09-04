import { sb } from "@/lib/supabase";

export type PostType = "meme" | "thread";

export async function getPosts(type: PostType) {
  if (type === "meme") {
    // Use view with aggregated like_count for memes
    return sb.from("meme_posts").select("*").order("created_at", { ascending: false });
  }
  return sb.from("posts").select("*").eq("type", type).order("created_at", { ascending: false });
}

export async function createPost(p: { type: PostType; title: string; body?: string; image_url?: string; author_id?: string }) {
  return sb.from("posts").insert(p as any).select().single();
}

export async function toggleLike(postId: string, userId: string) {
  // Try to find existing like; if found, delete (unlike). Otherwise insert.
  const { data: existing } = await sb
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await sb.from("likes").delete().eq("id", (existing as any).id);
    return { unliked: true } as const;
  } else {
    await sb.from("likes").insert({ post_id: postId, user_id: userId });
    return { liked: true } as const;
  }
}

export async function getUserLikesForPosts(postIds: string[], userId: string) {
  if (!postIds.length) return { data: [] as string[], error: null } as const;
  const { data, error } = await sb
    .from("likes")
    .select("post_id")
    .eq("user_id", userId)
    .in("post_id", postIds);
  return { data: (data || []).map((r: any) => r.post_id as string), error } as const;
}

export async function getLeaderboard(limit = 10) {
  return sb
    .from("profiles")
    .select("id, username, xp, avatar_url")
    .order("xp", { ascending: false })
    .limit(limit);
}

export async function incrementXP(userId: string, amount = 5) {
  // Match existing SQL in docs/supabase.sql where function signature is (user_id uuid, add int)
  return sb.rpc("increment_xp", { user_id: userId, add: amount });
}

// ---------------- Threads (unified) ----------------
export async function getReplies(postId: string) {
  return sb
    .from("post_replies")
    .select("id, post_id, author_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
}

export async function createReply(postId: string, body: string, authorId?: string) {
  const payload: any = { post_id: postId, body };
  if (authorId) payload.author_id = authorId;
  return sb.from("post_replies").insert(payload).select().single();
}

export async function createThread(title: string, body = "", authorId?: string) {
  const payload: any = { type: "thread", title, body };
  if (authorId) payload.author_id = authorId;
  return sb.from("posts").insert(payload).select().single();
}

export async function getThreadsWithCounts() {
  return sb
    .from("thread_posts")
    .select("*")
    .order("created_at", { ascending: false });
}
