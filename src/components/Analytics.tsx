import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Analytics(){
  const loc = useLocation();
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  const gaId = import.meta.env.VITE_GA_ID as string | undefined;

  useEffect(() => {
    if (plausibleDomain && !document.querySelector('script[data-plausible]')){
      const s = document.createElement('script');
      s.setAttribute('defer', '');
      s.setAttribute('data-domain', plausibleDomain);
      (s as any).dataset.plausible = '1';
      s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
    if (gaId && !document.querySelector('#ga-script')){
      const s = document.createElement('script');
      s.id = 'ga-script';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
      const i = document.createElement('script');
      i.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`;
      document.head.appendChild(i);
    }
  }, [plausibleDomain, gaId]);

  useEffect(() => {
    // Plausible
    if ((window as any).plausible){ (window as any).plausible('pageview'); }
    // GA
    if ((window as any).gtag){ (window as any).gtag('event', 'page_view'); }
  }, [loc.pathname, loc.search]);

  return null;
}

