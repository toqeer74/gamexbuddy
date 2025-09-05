import React, { useMemo, useState } from "react";
import { addXp } from "@/lib/xp";

type Req = {
  name: string;
  min: { cpuTier: 'low'|'mid'|'high'; gpuTier: 'low'|'mid'|'high'; ramGB: number; storageGB: number };
};

export default function PCCheckerCard(){
  const games = useMemo<Req[]>(() => ([{
    name: 'GTA VI',
    min: { cpuTier: 'mid', gpuTier: 'mid', ramGB: 8, storageGB: 150 }
  }]), []);

  const [game, setGame] = useState(games[0].name);
  const [cpu, setCpu] = useState<'low'|'mid'|'high'>('mid');
  const [gpu, setGpu] = useState<'low'|'mid'|'high'>('mid');
  const [ram, setRam] = useState(8);
  const [storage, setStorage] = useState(150);
  const [result, setResult] = useState<string | null>(null);

  const req = games.find(g=>g.name===game)!;

  function scoreTier(val: 'low'|'mid'|'high'){ return val === 'low' ? 1 : val === 'mid' ? 2 : 3; }

  async function check(e: React.FormEvent){
    e.preventDefault();
    const okCpu = scoreTier(cpu) >= scoreTier(req.min.cpuTier);
    const okGpu = scoreTier(gpu) >= scoreTier(req.min.gpuTier);
    const okRam = ram >= req.min.ramGB;
    const okStorage = storage >= req.min.storageGB;
    const passed = okCpu && okGpu && okRam && okStorage;
    setResult(passed ? 'Your PC meets the minimum requirements ✅.' : 'Your PC does not meet the minimum requirements ❌');
    try { await addXp(passed ? 5 : 2); } catch {}
  }

  return (
    <div className="card-glass" style={{padding:18}}>
      <div className="badge" style={{ background: 'rgba(0,255,234,.12)', border: '1px solid rgba(0,255,234,.3)' }}>Tool</div>
      <h3 style={{fontWeight:800, marginTop:6}}>PC Checker</h3>
      <p style={{opacity:.85}}>Compare your rig against minimum PC requirements.</p>
      <form onSubmit={check} style={{display:'grid', gap:8, marginTop:8}}>
        <label>
          <div style={{fontSize:12, opacity:.8}}>Game</div>
          <select value={game} onChange={e=>setGame(e.target.value)} className="nl__input">
            {games.map(g=> <option key={g.name} value={g.name}>{g.name}</option>)}
          </select>
        </label>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>
            <div style={{fontSize:12, opacity:.8}}>CPU Tier</div>
            <select value={cpu} onChange={e=>setCpu(e.target.value as any)} className="nl__input">
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            <div style={{fontSize:12, opacity:.8}}>GPU Tier</div>
            <select value={gpu} onChange={e=>setGpu(e.target.value as any)} className="nl__input">
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>
            <div style={{fontSize:12, opacity:.8}}>RAM (GB)</div>
            <input type="number" min={2} max={128} value={ram} onChange={e=>setRam(parseInt(e.target.value||'0',10))} className="nl__input" />
          </label>
          <label>
            <div style={{fontSize:12, opacity:.8}}>Storage Available (GB)</div>
            <input type="number" min={10} max={2000} value={storage} onChange={e=>setStorage(parseInt(e.target.value||'0',10))} className="nl__input" />
          </label>
        </div>
        <button className="gx-btn gx-btn--soft">Check</button>
      </form>
      {result && <div style={{marginTop:8}}>{result}</div>}
      <div style={{opacity:.7, fontSize:12, marginTop:6}}>Min spec: CPU {req.min.cpuTier.toUpperCase()}, GPU {req.min.gpuTier.toUpperCase()}, RAM {req.min.ramGB} GB, Storage {req.min.storageGB} GB.</div>
    </div>
  );
}

