import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthWidget(){
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const signIn = async (provider: 'github' | 'google') => {
    const redirectTo = import.meta.env.VITE_SITE_URL || window.location.origin;
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  };
  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      {userEmail ? (
        <>
          <span style={{ fontSize:12, opacity:.85 }}>{userEmail}</span>
          <button className="gx-btn gx-btn--soft" onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <button className="gx-btn gx-btn--soft" onClick={()=>signIn('github')}>Sign in GitHub</button>
          <button className="gx-btn gx-btn--soft" onClick={()=>signIn('google')}>Google</button>
        </>
      )}
    </div>
  );
}

