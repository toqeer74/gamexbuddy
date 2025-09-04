import React from "react";

export default function BuyPlusButton({ userId, email }: { userId?: string; email?: string }) {
  async function onBuy() {
    if (!userId) return alert("Sign in first");
    try {
      const res = await fetch("/functions/v1/create-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_id: userId, email })
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error("No checkout URL returned");
    } catch (e: any) {
      alert(e?.message || "Could not start checkout");
    }
  }
  return (
    <button className="gx-btn" onClick={onBuy}>Get GamexBuddy Plus</button>
  );
}
