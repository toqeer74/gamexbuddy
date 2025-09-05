import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type KPI1 = { d: string; points: number; events: number };
type KPI2 = { d: string; active_users: number };

export default function AdminGrowth() {
  const [daily, setDaily] = useState<KPI1[]>([]);
  const [active, setActive] = useState<KPI2[]>([]);

  useEffect(() => {
    (async () => {
      const { data: d1 } = await supabase.from("kpi_daily_points").select("*");
      const { data: d2 } = await supabase.from("kpi_active_earners").select("*");
      setDaily((d1 ?? []).slice().reverse());
      setActive((d2 ?? []).slice().reverse());
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="gx-card p-6">
        <h1 className="text-2xl font-extrabold">Growth & Earning KPIs</h1>
        <p className="text-sm text-white/70">Daily points total and active earners.</p>
      </div>

      <div className="gx-card p-6">
        <h3 className="text-lg font-bold mb-3">Daily Points</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="d" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#121224", border: "1px solid #ffffff22" }} />
              <Line type="monotone" dataKey="points" stroke="#29f0ff" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="gx-card p-6">
        <h3 className="text-lg font-bold mb-3">Active Earners</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={active} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="d" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#121224", border: "1px solid #ffffff22" }} />
              <Line type="monotone" dataKey="active_users" stroke="#7c3aed" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

