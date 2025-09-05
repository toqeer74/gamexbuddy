import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ReportButtonProps {
  commentId: number;
}

export default function ReportButton({ commentId }: ReportButtonProps) {
  const [busy, setBusy] = useState(false);

  async function onReport() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Sign in to report.");
      return;
    }

    setBusy(true);
    const { error } = await supabase.from("comment_reports").insert({
      reporter_id: user.id,
      comment_id: commentId,
      reason: "abuse"
    });

    setBusy(false);
    if (error) {
      alert("Failed to report");
    } else {
      alert("Thanks — we'll review this.");
    }
  }

  return (
    <button
      className="text-xs opacity-70 hover:opacity-100 transition-opacity disabled:opacity-50"
      onClick={onReport}
      disabled={busy}
    >
      {busy ? "Reporting…" : "Report"}
    </button>
  );
}

