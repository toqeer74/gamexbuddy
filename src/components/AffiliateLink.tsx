import React, { useEffect, useState } from "react";
import { useTrack } from "@/hooks/useTrack";
import { supabase } from "@/lib/supabaseClient";

export default function AffiliateLink({
  href,
  children,
  label,
  sku,
  refTag = "gamexbuddy"
}: { href: string; children: React.ReactNode; label?: string; sku?: string; refTag?: string }){
  const { clickAffiliate } = useTrack();
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUid(data.user?.id || null)); }, []);
  const wrapped = `/functions/v1/affiliate-redirect?url=${encodeURIComponent(href)}${label ? `&label=${encodeURIComponent(label)}` : ""}${sku ? `&sku=${encodeURIComponent(sku)}` : ""}&ref=${encodeURIComponent(refTag)}${uid ? `&uid=${encodeURIComponent(uid)}` : ""}`;
  return (
    <a className="gx-btn" href={wrapped} target="_blank" rel="noopener noreferrer sponsored" onClick={()=>clickAffiliate(href)}>
      {children}
    </a>
  );
}
