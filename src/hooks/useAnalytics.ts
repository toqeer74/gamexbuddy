export type AnalyticsPayload = Record<string, unknown>;

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const maskedUser = user.length <= 2 ? "**" : user[0] + "*".repeat(Math.max(1, user.length - 2)) + user.slice(-1);
  return `${maskedUser}@${domain}`;
}

export function useAnalytics() {
  function track(event: string, payload: AnalyticsPayload = {}) {
    // Lightweight client-side tracking stub (replace with your provider later)
    try {
      // eslint-disable-next-line no-console
      console.log("[analytics]", event, payload);
      // Example to wire later:
      // navigator.sendBeacon('/api/analytics', JSON.stringify({ event, payload, t: Date.now() }));
    } catch {}
  }

  function trackNewsletterSubmit(email: string, source: string) {
    track("newsletter_submit", { source, email_masked: maskEmail(email), ts: Date.now() });
  }

  return { track, trackNewsletterSubmit };
}

