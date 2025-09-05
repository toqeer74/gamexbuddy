import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Reactions from "./Reactions";
import ReportButton from "./ReportButton";

interface CommentListProps {
  targetType: "news" | "guide";
  targetId: string;
  isForumMode?: boolean; // New: Enable threaded/forum mode
}

interface Comment {
  id: number;
  user_id: string;
  body: string;
  created_at: string;
  is_deleted: boolean;
  parent_id?: number; // New: For threading
  replies?: Comment[]; // New: Nested replies
  depth?: number; // New: Indentation level
  avatar_url?: string;
  username?: string;
}

export default function CommentList({ targetType, targetId, isForumMode = false }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [repliesOpen, setRepliesOpen] = useState<Set<number>>(new Set()); // New: Track expanded threads

  async function loadComments() {
    // Load top-level comments (no parent_id)
    const { data } = await supabase
      .from("comments")
      .select(`
        id, user_id, body, created_at, is_deleted,
        profiles:profiles!comments_user_id_fkey(username, avatar_url)
      `)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .is("parent_id", null) // Only top-level comments
      .order("created_at", { ascending: true });

    if (data) {
      // For each comment, load its replies if in forum mode
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const replies = isForumMode ? await loadReplies(comment.id) : [];
          return {
            ...comment,
            replies,
            depth: 0,
            avatar_url: comment.profiles?.avatar_url,
            username: comment.profiles?.username || 'Anonymous'
          };
        })
      );

      setComments(commentsWithReplies || []);
    }
  }

  async function loadReplies(parentId: number, depth = 0): Promise<Comment[]> {
    const { data } = await supabase
      .from("comments")
      .select(`
        id, user_id, body, created_at, is_deleted,
        profiles:profiles!comments_user_id_fkey(username, avatar_url)
      `)
      .eq("parent_id", parentId)
      .order("created_at", { ascending: true });

    if (data && depth < 3) { // Max nesting depth to prevent UI complexity
      const repliesWithNested = await Promise.all(
        data.map(async (reply) => ({
          ...reply,
          replies: await loadReplies(reply.id, depth + 1),
          depth: depth + 1,
          avatar_url: reply.profiles?.avatar_url,
          username: reply.profiles?.username || 'Anonymous'
        }))
      );
      return repliesWithNested;
    }

    return data?.map(reply => ({
      ...reply,
      depth: depth + 1,
      avatar_url: reply.profiles?.avatar_url,
      username: reply.profiles?.username || 'Anonymous'
    })) || [];
  }

  useEffect(() => {
    loadComments();

    const handleCommentAdded = () => loadComments();
    document.addEventListener("gxb:comment:added", handleCommentAdded);

    return () => document.removeEventListener("gxb:comment:added", handleCommentAdded);
  }, [targetType, targetId]);

  return (
    <div className="space-y-3">
      {comments.map(comment => (
        <div key={comment.id} className="gx-card p-4">
          <div className="text-sm opacity-70 mb-2">
            {new Date(comment.created_at).toLocaleString()}
          </div>
          <div className="mb-3">
            {comment.is_deleted ? (
              <i className="text-white/50">deleted</i>
            ) : (
              <div className="text-white leading-relaxed">
                {comment.body}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Reactions commentId={comment.id} />
            <ReportButton commentId={comment.id} />
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-center py-8 text-white/50">
          Be the first to comment! 💬
        </div>
      )}
    </div>
  );
}