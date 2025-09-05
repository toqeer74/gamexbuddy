import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";

export function usePremium() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await sb.auth.getUser();
        const uid = data.user?.id;
        if (!uid) { if (alive) { setIsPremium(false); setLoading(false); } return; }
        const { data: prof } = await sb.from('profiles').select('is_premium').eq('id', uid).maybeSingle();
        if (alive) setIsPremium(!!prof?.is_premium);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);
  return { isPremium, loading } as const;
}

