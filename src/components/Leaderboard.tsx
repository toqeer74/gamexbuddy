import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Row = { id: string; name?: string; username?: string; xp: number };

const XPBadge = ({xp}:{xp:number})=>{
  const tier = xp>2000 ? "Elite" : xp>1000 ? "Pro" : "Skilled";
  return <span className="badge">{tier} • {xp} XP</span>;
};

export default function Leaderboard(){
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string|undefined>();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, name, xp")
          .order("xp", { ascending: false })
          .limit(20);
        if (error) throw error;
        setRows((data as any) || []);
      } catch (e:any) {
        setErr(e.message);
        // Fallback demo data
        setRows([
          { id:"u1", name:"Nova", xp: 2100 },
          { id:"u2", name:"Blitz", xp: 1600 },
          { id:"u3", name:"Ghost", xp: 980 }
        ]);
      }
    })();
    const channel = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (_payload) => {
        // Re-fetch on any profile change
        supabase.from('profiles').select('id, username, name, xp').order('xp', { ascending: false }).limit(20)
          .then(({ data }) => setRows((data as any) || rows));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <h3 className="h2">Leaderboard</h3>
        <table className="lb-table" style={{width:"100%", borderCollapse:"collapse"}}>
          <tbody>
            {rows.map(r=> (
              <tr key={r.id} style={{borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                <td style={{fontWeight:700, padding:10}}>{r.name || r.username || "Player"}</td>
                <td style={{padding:10}}><XPBadge xp={r.xp}/></td>
              </tr>
            ))}
          </tbody>
        </table>
        {err && <div style={{opacity:.7, fontSize:12, marginTop:8}}>Showing demo leaderboard (Supabase not configured).</div>}
      </div>
    </section>
  );
}
