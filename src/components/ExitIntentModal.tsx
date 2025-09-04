import React, { useEffect, useState } from "react";
import NewsletterGlow from "@/components/NewsletterGlow";

export default function ExitIntentModal(){
  const [open, setOpen] = useState(false);
  const KEY_TS = 'gxb_nl_dismissed_ts';
  const DAYS = 14;
  useEffect(() => {
    // Respect reduced motion and tiny viewports
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tooSmall = typeof window !== 'undefined' && window.innerHeight < 600;
    if (prefersReduced || tooSmall) return;
    const sub = localStorage.getItem('gx_subscribed');
    const last = Number(localStorage.getItem(KEY_TS) || 0);
    const daysSince = (Date.now() - last) / 86400000;
    if(sub || daysSince < DAYS) return;
    function onMouseOut(e: MouseEvent){
      if(!e.toElement && !e.relatedTarget && e.clientY <= 0){
        setOpen(true);
      }
    }
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, []);
  function close(){ try{ localStorage.setItem(KEY_TS, String(Date.now())); } catch{} setOpen(false); }
  if(!open) return null;
  return (
    <div className="ytm" role="dialog" aria-modal="true" aria-label="Get GTA VI release alerts" onClick={close}>
      <div className="ytm__panel" onClick={(e)=>e.stopPropagation()}>
        <button className="ytm__close" aria-label="Close modal" onClick={close}>×</button>
        <div style={{padding:16}}>
          <div className="h2" style={{marginBottom:8}}>Get GTA VI release alerts</div>
          <NewsletterGlow />
        </div>
      </div>
    </div>
  );
}
