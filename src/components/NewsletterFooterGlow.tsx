import React, { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function NewsletterFooterGlow() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const { trackNewsletterSubmit } = useAnalytics();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setOk(true);
    trackNewsletterSubmit(email, "NewsletterFooterGlow");
  }

  return (
    <section className="nlf">
      <div className="nlf__wrap">
        <div className="nlf__panel">
          <div className="nlf__title">Don’t Miss Drops & Guides</div>
          {ok ? (
            <div className="nlf__ok">Subscribed! Check your inbox.</div>
          ) : (
            <form className="nlf__form" onSubmit={onSubmit}>
              <input
                type="email"
                className="nlf__input"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="nlf__btn" disabled={loading}>
                {loading ? "Joining…" : "Join Free"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
