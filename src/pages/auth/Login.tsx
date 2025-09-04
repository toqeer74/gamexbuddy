import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const redirectTo = `${location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setSent(true);
      showSuccess("Check your email for the login link.");
    } catch (err: any) {
      showError(err?.message || "Failed to send magic link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ padding: 20, maxWidth: 420 }}>
      <h1 className="title-xl font-extrabold">Sign in</h1>
      <p className="opacity-80 text-sm mb-3">Admins and editors can request a magic link.</p>
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="you@example.com"
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10 flex-1"
        />
        <button className="btn" type="submit" disabled={busy || !email}>
          {busy ? "Sending..." : "Send link"}
        </button>
      </form>
      {sent && (
        <p className="mt-3 text-sm">Check your email for the login link.</p>
      )}
      <div className="mt-4 text-xs opacity-70">
        If your project requires verified redirect URLs, add:
        <pre style={{ whiteSpace:'pre-wrap' }}>{`http://localhost:5173/auth/callback\nhttps://gamexbuddy.com/auth/callback`}</pre>
        in Supabase Auth settings.
      </div>
    </div>
  );
}

