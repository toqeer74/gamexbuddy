import React, { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";

export default function ProfileBadgeRack({ userId }: { userId: string }){
  const [badges, setBadges] = useState<any[]>([]);
  useEffect(()=>{
    let active = true;
    sb.from("user_badges").select("*, badges(*)").eq("user_id", userId).then(({ data })=>{
      if (active) setBadges(data||[]);
    });
    return () => { active = false; };
  },[userId]);

  if (!badges.length) return null;
  return (
    <div className="card-glass" style={{ padding: 12 }}>
      <strong>Badges</strong>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:10 }}>
        {badges.map((b:any)=>(
          <span key={b.id} className="xp-badge" title={b.badges?.description || ""}>
            {b.badges?.icon || "🏆"} {b.badges?.name}
          </span>
        ))}
      </div>
    </div>
  );
}

