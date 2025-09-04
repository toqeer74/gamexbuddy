import React, { useState } from "react";
import { sb } from "@/lib/supabase";

export default function ReportButton({ postId, userId }: { postId: string; userId?: string }){
  const [busy, setBusy] = useState(false);
  async function onReport(e: React.MouseEvent){
    e.stopPropagation();
    if (!userId) { alert("Sign in to report."); return; }
    setBusy(true);
    const { error } = await sb.from("moderation_flags").insert({ post_id: postId, reporter_id: userId, reason: "user_report" });
    setBusy(false);
    if (error) alert("Failed to report"); else alert("Thanks — we’ll review this.");
  }
  return (
    <button className="gx-btn gx-btn--soft" onClick={onReport} disabled={busy} aria-label="Report this post">
      {busy ? "Reporting…" : "Report"}
    </button>
  );
}

