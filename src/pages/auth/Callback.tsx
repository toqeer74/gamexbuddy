import React from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  React.useEffect(() => {
    (async () => {
      // prompt client to resolve session from URL hash if present
      await supabase.auth.getSession();
      const to = new URL(location.href).searchParams.get("to") || "/admin/picks";
      location.replace(to);
    })();
  }, []);
  return <div className="wrap" style={{ padding: 20 }}>Signing you in…</div>;
}

