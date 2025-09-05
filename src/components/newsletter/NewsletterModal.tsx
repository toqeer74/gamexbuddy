import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      const base = import.meta.env.VITE_SUPABASE_URL as string;
      const res = await fetch(`${base}/functions/v1/newsletter/subscribe`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("request_failed");
      setOk(true);
    } catch (e: any) {
      const m = String(e?.message || e || "");
      if (m.toLowerCase().includes("duplicate")) setOk(true);
      else setErr("Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="gx-btn px-4 py-2 rounded-xl text-sm">Subscribe</button>
      </DialogTrigger>
      <DialogContent className="bg-[#0b0b12] border-white/10">
        <DialogHeader>
          <h3 className="text-lg font-bold">Join Our Newsletter</h3>
          <p className="text-sm text-white/70">Double opt-in: we’ll email a confirmation. No spam.</p>
        </DialogHeader>
        {ok ? (
          <div className="text-sm text-white/80">Thanks! Check your inbox to confirm your subscription.</div>
        ) : (
          <form onSubmit={onSubmit} className="mt-3 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent border border-white/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-white/30"
            />
            <button className="gx-btn px-4 py-2 rounded-xl text-sm" disabled={loading}>
              {loading ? "Submitting…" : "Subscribe"}
            </button>
          </form>
        )}
        {err && <div className="text-sm text-red-400 mt-2">{err}</div>}
      </DialogContent>
    </Dialog>
  );
}
