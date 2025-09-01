import React from "react";

const THREADS = [
  { id:"t1", title:"Best controller binds for GTA Online", replies:18, user:"Ari" },
  { id:"t2", title:"Your FPS tips for mid-range GPUs", replies:33, user:"Rex" },
  { id:"t3", title:"Show your best Minecraft builds", replies:11, user:"Jax" }
];

export default function ThreadsPreview(){
  return (
    <section className="section">
      <div className="wrap">
        <h3 className="h2">Latest Discussions</h3>
        {THREADS.map(t=> (
          <div key={t.id} className="thread" style={{display:"flex", gap:12, alignItems:"center", padding:"10px 12px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(21,26,59,.5)", marginBottom:8}}>
            <div className="badge">👤 {t.user}</div>
            <div style={{fontWeight:700}}>{t.title}</div>
            <div style={{marginLeft:"auto", opacity:.8}}>{t.replies} replies</div>
          </div>
        ))}
      </div>
    </section>
  );
}

