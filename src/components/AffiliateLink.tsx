import React from "react";
import { useTrack } from "@/hooks/useTrack";

export default function AffiliateLink({
  href,
  children,
  label,
  sku,
  refTag = "gamexbuddy"
}: { href: string; children: React.ReactNode; label?: string; sku?: string; refTag?: string }){
  const { clickAffiliate } = useTrack();
  const wrapped = `/functions/v1/affiliate-redirect?url=${encodeURIComponent(href)}${label ? `&label=${encodeURIComponent(label)}` : ""}${sku ? `&sku=${encodeURIComponent(sku)}` : ""}&ref=${encodeURIComponent(refTag)}`;
  return (
    <a className="gx-btn" href={wrapped} target="_blank" rel="noopener noreferrer sponsored" onClick={()=>clickAffiliate(href)}>
      {children}
    </a>
  );
}
