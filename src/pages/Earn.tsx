import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DailyCheckinCard from "@/components/earnings/DailyCheckinCard";
import EarningsPanel from "@/components/earnings/EarningsPanel";
import AffiliateStores from "@/components/AffiliateStores";

export default function EarnPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAuthed(!!user);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  if (!authed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="gx-card p-6">
          <h1 className="text-xl font-bold">Sign in to start earning</h1>
          <p className="text-sm text-white/70 mt-1">
            Create an account or sign in to access daily check-ins and rewards.
          </p>
          {/* Add your auth UI here */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <DailyCheckinCard />
        <EarningsPanel />
      </div>
      <AffiliateStores />
    </div>
  );
}

