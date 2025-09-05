import React, { useEffect, useRef } from "react";

export default function AdSlot({
  placement,
  size = "728x90",
  isPremium
}: { placement: string; size?: "728x90"|"300x250"|"320x100"; isPremium?: boolean }) {
  if (isPremium) return null;
  const minHeight = size === "300x250" ? 250 : size === "320x100" ? 100 : 90;
  const ref = useRef<HTMLDivElement | null>(null);
  const client = (import.meta as any).env?.VITE_ADSENSE_CLIENT as string | undefined;

  useEffect(() => {
    if (!client) return;
    // Load AdSense script once
    if (!document.querySelector<HTMLScriptElement>('script[data-adsbygoogle]')){
      const s = document.createElement('script');
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      s.setAttribute('crossorigin','anonymous');
      (s as any).dataset.adsbygoogle = '1';
      document.head.appendChild(s);
    }
    // Try to render an ad if slot is present
    const el = ref.current?.querySelector('.adsbygoogle') as any;
    if (el && (window as any).adsbygoogle) {
      try { (window as any).adsbygoogle.push({}); } catch {}
    }
  }, [client]);

  if (!client) {
    return (
      <div className="card-glass" data-ad={placement} style={{ display:"grid", placeItems:"center", minHeight }}>
        <div aria-label={`Ad: ${placement}`} style={{ opacity:.6, fontSize:12 }}>
          Ad slot {placement} ({size})
        </div>
      </div>
    );
  }

  // Fallback generic slot id based on placement (publisher can remap later)
  const slot = (window as any).__adSlots?.[placement] || '0000000000';
  const [w, h] = size.split('x').map(n => parseInt(n, 10));
  return (
    <div ref={ref} className="card-glass" style={{ minHeight, padding: 4 }}>
      <ins className="adsbygoogle"
           style={{ display:'inline-block', width: w, height: h }}
           data-ad-client={client}
           data-ad-slot={slot}></ins>
    </div>
  );
}
