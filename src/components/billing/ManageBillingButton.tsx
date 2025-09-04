import React from "react";

export default function ManageBillingButton({ userId }: { userId?: string }) {
  async function onClick() {
    if (!userId) return alert("Sign in first");
    try {
      const res = await fetch("/functions/v1/create-portal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      if (!res.ok) throw new Error("Failed to open billing portal");
      const { url } = await res.json();
      if (url) location.href = url;
    } catch (e:any) {
      alert(e?.message || "Could not open billing portal");
    }
  }
  return <button className="gx-btn gx-btn--soft" onClick={onClick}>Manage Billing</button>;
}

