import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { sb } from "@/lib/supabase";

export default function ModerationQueue(){
  const [rows, setRows] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [isMod, setIsMod] = useState(false);
  useEffect(()=>{
    (async () => {
      const { data } = await sb.auth.getUser();
      const uid = data.user?.id;
      if (!uid) { setChecked(true); setIsMod(false); return; }
      const { data: prof } = await sb.from("profiles").select("is_moderator").eq("id", uid).single();
      setIsMod(!!prof?.is_moderator);
      setChecked(true);
    })();
  },[]);
  useEffect(()=>{
    sb.from("moderation_flags")
      .select("id, reason, status, created_at, post_id, reporter_id, posts(title, body_md, author_id)")
      .eq("status","open")
      .order("created_at",{ascending:false} as any)
      .then(({data})=> setRows(data||[]));
  },[]);

  async function resolve(id: string) {
    await sb.from("moderation_flags").update({ status:"resolved" }).eq("id", id);
    setRows(x=> x.filter(r=> r.id!==id));
  }

  if (checked && !isMod) return <Navigate to="/" replace />;

  return (
    <div className="wrap" style={{ padding: 20 }}>
      <h1>Moderation Queue</h1>
      <div style={{ display:"grid", gap: 12 }}>
        {rows.map(r=> (
          <div key={r.id} className="card-glass" style={{ padding: 12 }}>
            <div style={{ fontSize:12, opacity:.7 }}>
              Flagged {new Date(r.created_at).toLocaleString()} • reason: {r.reason}
            </div>
            <div style={{ marginTop:6 }}>
              <strong>Post:</strong> {r.posts?.title || (r.posts?.body_md?.slice(0,100) || "no title")}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <button className="gx-btn gx-btn--soft" onClick={()=>resolve(r.id)}>Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
