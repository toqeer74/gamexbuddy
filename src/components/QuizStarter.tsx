import React, { useMemo, useState } from "react";
import { addXp } from "@/lib/xp";
import quizzes from "@/content/quizzes.json";

type Q = { q:string; options:string[]; a:number };
type Quiz = { slug:string; title:string; questions: Q[] };

export default function QuizStarter(){
  const ALL = quizzes as unknown as Quiz[];
  const [which, setWhich] = useState(ALL[0]?.slug || "");
  const current = useMemo(()=> ALL.find(x=>x.slug===which) || ALL[0], [which, ALL]);
  const QUIZ = current?.questions || [];
  const [i,setI]=useState(0); const [score,setScore]=useState(0); const [rewarded,setRewarded]=useState(false); const q=QUIZ[i];
  async function pick(ix:number){
    if(ix===q.a) setScore(s=>s+10);
    if(i+1<QUIZ.length){ setI(i+1); }
    else {
      setI(-1);
      if(!rewarded){ setRewarded(true); try{ await addXp(score); } catch{} }
    }
  }
  if(i===-1) return (
    <div className="card-glass" style={{padding:18}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <strong>Quiz complete!</strong>
        <select value={which} onChange={e=>{ setWhich(e.target.value); setI(0); setScore(0); setRewarded(false); }} className="nl__input" style={{maxWidth:200}}>
          {ALL.map(qz => <option key={qz.slug} value={qz.slug}>{qz.title}</option>)}
        </select>
      </div>
      <div>Score: {score} XP</div>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <a href={`https://twitter.com/intent/tweet?text=I scored ${score} XP on ${current?.title || 'this quiz'}! Play now at gamexbuddy.com&url=https://gamexbuddy.com`} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn--soft" style={{padding:8}}>Share on Twitter</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=https://gamexbuddy.com`} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn--soft" style={{padding:8}}>Share on Facebook</a>
      </div>
    </div>
  );
  return (
    <div className="card-glass" style={{padding:18}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <div style={{fontWeight:800}}>{current?.title || 'Quiz'}</div>
        <select value={which} onChange={e=>{ setWhich(e.target.value); setI(0); setScore(0); setRewarded(false); }} className="nl__input" style={{maxWidth:200}}>
          {ALL.map(qz => <option key={qz.slug} value={qz.slug}>{qz.title}</option>)}
        </select>
      </div>
      <div style={{fontWeight:800, marginBottom:8}}>{q.q}</div>
      <div style={{display:"grid", gap:8}}>
        {q.options.map((o,ix)=><button key={ix} onClick={()=>pick(ix)} className="nf__btn" style={{textAlign:"left"}}>{o}</button>)}
      </div>
    </div>
  );
}
