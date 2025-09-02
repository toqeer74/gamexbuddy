import React from "react";

export default function AffiliateLink({ href, children }: { href: string; children: React.ReactNode }){
  return (
    <a className="gx-btn" href={href} target="_blank" rel="noopener noreferrer sponsored">
      {children}
    </a>
  );
}

