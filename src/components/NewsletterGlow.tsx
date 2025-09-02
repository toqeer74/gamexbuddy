import React, { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { addXp } from "@/lib/xp";

export default function NewsletterGlow() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { trackNewsletterSubmit } = useAnalytics();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email.");
      return;
    }
    setLoading(true);
    // TODO: Replace with your provider fetch (Mailchimp/ConvertKit/Resend)
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setOk(true);
    trackNewsletterSubmit(email, "NewsletterGlow");
    try { await addXp(50); } catch {}
  }

  return (
    <section className="nl">
      <div className="nl__wrap">
        <div className="nl__panel">
          <div className="nl__title">Join Our Newsletter</div>
          <p className="nl__sub">
            Get official GTA/Newswire highlights, new guides, tools, and wallpaper drops.
            <span className="nl__muted"> No spam. Unsubscribe anytime.</span>
          </p>

          {ok ? (
            <div className="nl__success">Thanks! Check your inbox for a confirmation.</div>
          ) : (
            <form className="nl__form" onSubmit={onSubmit}>
              <input
                type="email"
                className="nl__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="nl__btn" disabled={loading}>
                {loading ? "Submitting..." : "Subscribe"}
              </button>
            </form>
          )}
          {err && <div className="nl__error">{err}</div>}

          <label className="nl__opt">
            <input type="checkbox" /> Also send me Telegram updates (optional)
          </label>
        </div>
      </div>
    </section>
  );
}
