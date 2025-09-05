import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const EMOJIS = ["like", "fire", "star"];

interface ReactionsProps {
  commentId: number;
}

export default function Reactions({ commentId }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  async function loadReactions() {
    // Get reaction counts
    const { data: countsData } = await supabase
      .from("comment_reactions")
      .select("emoji")
      .eq("comment_id", commentId);

    const countsMap: Record<string, number> = {};
    countsData?.forEach((row: any) => {
      countsMap[row.emoji] = (countsMap[row.emoji] || 0) + 1;
    });
    setCounts(countsMap);

    // Get user's reactions
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from("comment_reactions")
        .select("emoji")
        .eq("comment_id", commentId)
        .eq("user_id", user.id);

      const userReactionsSet = new Set(userData?.map((row: any) => row.emoji) || []);
      setUserReactions(userReactionsSet);
    }
  }

  async function toggleReaction(emoji: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const hasReacted = userReactions.has(emoji);

    if (hasReacted) {
      // Remove reaction
      const { error } = await supabase
        .from("comment_reactions")
        .delete()
        .eq("comment_id", commentId)
        .eq("emoji", emoji)
        .eq("user_id", user.id);

      if (!error) {
        const updatedReactions = new Set(userReactions);
        updatedReactions.delete(emoji);
        setUserReactions(updatedReactions);
      }
    } else {
      // Add reaction
      const { error } = await supabase
        .from("comment_reactions")
        .insert({
          user_id: user.id,
          comment_id: commentId,
          emoji
        });

      if (!error) {
        const updatedReactions = new Set(userReactions);
        updatedReactions.add(emoji);
        setUserReactions(updatedReactions);
      }
    }

    loadReactions();
  }

  useEffect(() => {
    loadReactions();
  }, [commentId]);

  return (
    <div className="flex gap-2">
      {EMOJIS.map(emoji => {
        const isActive = userReactions.has(emoji);
        return (
          <button
            key={emoji}
            onClick={() => toggleReaction(emoji)}
            className={`
              text-xs px-2 py-1 border rounded-lg transition-all duration-200
              ${isActive
                ? 'border-primary text-primary bg-primary/10'
                : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'
              }
            `}
          >
            {emoji === "like" && "👍"}
            {emoji === "fire" && "🔥"}
            {emoji === "star" && "⭐"}
            {" · "}{counts[emoji] || 0}
          </button>
        );
      })}
    </div>
  );
}