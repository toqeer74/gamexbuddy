import React, { useState } from "react";

type Q = { q:string; options:string[]; a:number };
const QUIZ: Q[] = [
  { q:"GTA VI is set primarily in which state (teased/rumored)?", options:["San Andreas","Vice State","Liberty State"], a:1 },
  { q:"Which series entry first introduced Trevor Phillips?", options:["GTA IV","GTA V","GTA VI"], a:1 }
];

export default function QuizStarter(){
  const [i,setI]=useState(0); const [score,setScore]=useState(0); const q=QUIZ[i];
  function pick(ix:number){ if(ix===q.a) setScore(s=>s+10); if(i+1<QUIZ.length) setI(i+1); else setI(-1); }
  if(i===-1) return <div className="card-glass" style={{padding:18}}><strong>Quiz complete!</strong> Score: {score} XP</div>;
  return (
    <div className="card-glass" style={{padding:18}}>
      <div style={{fontWeight:800, marginBottom:8}}>{q.q}</div>
      <div style={{display:"grid", gap:8}}>
        {q.options.map((o,ix)=><button key={ix} onClick={()=>pick(ix)} className="nf__btn" style={{textAlign:"left"}}>{o}</button>)}
      </div>
    </div>
  );
}

