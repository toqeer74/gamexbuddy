import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [allowed, setAllowed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      if (loading) return;
      if (!user) { setAllowed(false); return; }
      const { data } = await supabase.from("profiles").select("is_editor,is_moderator").eq("id", user.id).maybeSingle();
      const ok = !!(data?.is_editor || data?.is_moderator);
      setAllowed(ok);
    })();
  }, [user, loading]);

  async function signOut() { await supabase.auth.signOut(); location.assign("/"); }

  if (loading || allowed === null) return <div className="wrap" style={{ padding: 20 }}>Checking access…</div>;
  if (!user) return (
    <div className="wrap" style={{ padding: 20 }}>
      <h2 className="title-xl">Admins only</h2>
      <a className="btn" href="/auth/login">Go to login</a>
    </div>
  );
  if (!allowed) return (
    <div className="wrap" style={{ padding: 20 }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="title-xl">Access denied</h2>
        <button className="btn btn--soft" onClick={signOut}>Sign out</button>
      </div>
      <p>You don’t have access (need editor or moderator role).</p>
    </div>
  );
  return (
    <div>
      <div className="wrap" style={{ display:'flex', justifyContent:'flex-end', paddingTop: 8 }}>
        <button className="btn btn--soft" onClick={signOut}>Sign out</button>
      </div>
      {children}
    </div>
  );
}
