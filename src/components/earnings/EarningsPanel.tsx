import { useEffect, useState } from "react";
import { getPointsBalance, getRecentPoints } from "@/lib/points";

export function EarningsPanel() {
  const [balance, setBalance] = useState(0);
  const [recent, setRecent] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ balance }, rec] = await Promise.all([
          getPointsBalance(),
          getRecentPoints(15),
        ]);
        setBalance(balance);
        setRecent(rec);
      } catch {}
    })();
  }, []);

  return (
    <section className="space-y-4">
      <div className="gx-card p-5 md:p-6">
        <h2 className="text-xl font-extrabold">Your Balance</h2>
        <p className="text-3xl mt-1 font-black">{balance} XP</p>
        <p className="text-sm text-white/70 mt-1">
          Earn XP by checking in daily, reading guides, downloading tools, completing quests, and more.
        </p>
      </div>

      <div className="gx-card p-5 md:p-6">
        <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
        <ul className="space-y-2">
          {recent.length === 0 && (
            <li className="text-white/70 text-sm">No activity yet.</li>
          )}
          {recent.map((r, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-white/85 capitalize">
                {String(r.event_type || "").replaceAll("_", " ")}
                {r.event_ref ? (
                  <span className="text-white/50"> · {r.event_ref}</span>
                ) : null}
              </span>
              <span className="font-semibold">
                {r.delta_points > 0 ? `+${r.delta_points}` : r.delta_points}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default EarningsPanel;

