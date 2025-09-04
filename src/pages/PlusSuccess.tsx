import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function PlusSuccess() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const sid = params.get("session_id");
    if (!sid) { setLoading(false); return; }
    // Optionally verify session via backend; webhook already updates is_premium
    setLoading(false);
    setOk(true);
  }, []);

  if (loading) return <div className="wrap">Verifying subscription…</div>;

  return (
    <div className="wrap" style={{ padding:40, textAlign:"center" }}>
      {ok ? (
        <>
          <h1>🎉 You’re Premium!</h1>
          <p>Welcome to <strong>GamexBuddy Plus</strong>. Ads are gone and premium tools are unlocked.</p>
          <Link to="/tools" className="btn">Go to Tools</Link>
        </>
      ) : (
        <>
          <h1>Oops</h1>
          <p>No session found. Please contact support if you think this is wrong.</p>
        </>
      )}
    </div>
  );
}

