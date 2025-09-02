import { useCallback } from 'react';

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "invalid";
  const [user, domain] = email.split("@");
  const safeUser = user || "";
  const safeDomain = domain || "";
  const maskedUser = safeUser.length <= 2 ? `${safeUser}***` : `${safeUser.slice(0, 2)}***`;
  return `${maskedUser}@${safeDomain}`;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props: Record<string, unknown> }) => void;
    gtag?: (type: string, eventName: string, props?: Record<string, unknown>) => void;
  }
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, props?: Record<string, unknown>) => {
    if (window.plausible) {
      window.plausible(eventName, { props });
    }
    if (window.gtag) {
      window.gtag('event', eventName, props);
    }
  }, []);

  const trackNewsletterSubmit = useCallback((email: string, source: string) => {
    trackEvent('newsletter_submit', {
      email: maskEmail(email),
      source,
    });
  }, [trackEvent]);

  return { trackEvent, trackNewsletterSubmit };
}
