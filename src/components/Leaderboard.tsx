import React from "react";

const ROWS = [
  { id:"u1", name:"Nova", xp: 2100 },
  { id:"u2", name:"Blitz", xp: 1600 },
  { id:"u3", name:"Ghost", xp: 980 }
];

const XPBadge = ({xp}:{xp:number})=>{
  const tier = xp>2000 ? "Elite" : xp>1000 ? "Pro" : "Skilled";
  return <span className="badge">{tier} • {xp} XP</span>;
};

export default function Leaderboard(){
  return (
    <section className="section">
      <div className="wrap">
        <h3 className="h2">Leaderboard</h3>
        <table className="lb-table" style={{width:"100%", borderCollapse:"collapse"}}>
          <tbody>
            {ROWS.map(r=> (
              <tr key={r.id} style={{borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                <td style={{fontWeight:700, padding:10}}>{r.name}</td>
                <td style={{padding:10}}><XPBadge xp={r.xp}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

