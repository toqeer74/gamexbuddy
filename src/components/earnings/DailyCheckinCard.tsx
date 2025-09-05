import { useEffect, useState } from "react";
import { awardPointsAndRefresh, getRecentPoints } from "@/lib/points";
import { GxButton } from "@/components/ui/GxButton";
import { usePointerGlow } from "@/hooks/usePointerGlow";

export function DailyCheckinCard() {
  const [loading, setLoading] = useState(false);
  const [checkedToday, setCheckedToday] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const onMove = usePointerGlow();

  useEffect(() => {
    (async () => {
      try {
        const recent = await getRecentPoints(25);
        const today = new Date().toDateString();
        const hit = recent.find(
          (r: any) =>
            r.event_type === "daily_checkin" && new Date(r.created_at).toDateString() === today
        );
        setCheckedToday(!!hit);
      } catch {}
    })();
  }, []);

  async function onCheckin() {
    if (checkedToday || loading) return;
    setLoading(true);
    try {
      await awardPointsAndRefresh("daily_checkin", null, 20);
      setCheckedToday(true);
      setToast("Checked in! +20 XP");
    } catch (e: any) {
      const msg = String(e?.message || e || "");
      if (msg.toLowerCase().includes("duplicate")) {
        setCheckedToday(true);
        setToast("Already checked in today.");
      } else {
        setToast("Could not check in. Try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2500);
    }
  }

  return (
    <div className="gx-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Daily Check-in</h3>
          <p className="text-sm text-white/70">Come back daily to keep your streak alive and earn XP.</p>
        </div>
        <GxButton
          size="lg"
          clickNeon={checkedToday ? "lime" : "cyan"}
          onMouseMove={onMove}
          onClick={onCheckin}
          disabled={checkedToday || loading}
        >
          {checkedToday ? "Checked ✓" : loading ? "Checking…" : "Check in +20"}
        </GxButton>
      </div>
      {toast && <div className="mt-3 text-sm text-white/80">{toast}</div>}
    </div>
  );
}

export default DailyCheckinCard;
