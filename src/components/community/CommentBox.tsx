import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { awardPointsAndRefresh } from "@/lib/points";

interface CommentBoxProps {
  targetType: "news" | "guide";
  targetId: string;
}

export default function CommentBox({ targetType, targetId }: CommentBoxProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSending(false); return; }

    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      target_type: targetType,
      target_id: targetId,
      body: text.trim()
    });

    if (!error) {
      // earn: first comment on this target → +10
      await awardPointsAndRefresh("comment_post", `${targetType}:${targetId}`, 10).catch(()=>{});
      setText("");
      document.dispatchEvent(new CustomEvent("gxb:comment:added"));
    }
    setSending(false);
  }

  return (
    <div className="gx-card p-4 space-y-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full bg-transparent border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:border-primary focus:outline-none"
        placeholder="Share your thoughts..."
        rows={3}
      />
      <button
        disabled={sending || !text.trim()}
        onClick={submit}
        className="gx-btn px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Posting…" : "Post Comment"}
      </button>
    </div>
  );
}