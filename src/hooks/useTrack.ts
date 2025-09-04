export function useTrack(){
  return {
    clickAffiliate: (label: string) => {
      try { (window as any).plausible?.('affiliate_click', { props: { label } }); } catch {}
      try { (window as any).gtag?.('event', 'affiliate_click', { label }); } catch {}
      if (import.meta.env.DEV) console.log('Affiliate click:', label);
    },
    newsletterSignup: (email: string) => {
      try { (window as any).plausible?.('newsletter_signup'); } catch {}
      try { (window as any).gtag?.('event', 'newsletter_signup'); } catch {}
      if (import.meta.env.DEV) console.log('Newsletter signup:', email);
    }
  };
}

