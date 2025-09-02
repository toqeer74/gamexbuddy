import React, { useEffect, useState } from "react";
import NewsletterGlow from "@/components/NewsletterGlow";

export default function ExitIntentModal(){
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const key = 'gx_exit_seen';
    const seen = localStorage.getItem(key);
    if(seen) return;
    function onMouseOut(e: MouseEvent){
      if(!e.toElement && !e.relatedTarget && e.clientY <= 0){
        localStorage.setItem(key, '1'); setOpen(true);
      }
    }
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, []);
  if(!open) return null;
  return (
    <div className="ytm" role="dialog" aria-modal="true" aria-label="Get GTA VI release alerts" onClick={()=>setOpen(false)}>
      <div className="ytm__panel" onClick={(e)=>e.stopPropagation()}>
        <button className="ytm__close" aria-label="Close" onClick={()=>setOpen(false)}>×</button>
        <div style={{padding:16}}>
          <div className="h2" style={{marginBottom:8}}>Get GTA VI release alerts</div>
          <NewsletterGlow />
        </div>
      </div>
    </div>
  );
}

