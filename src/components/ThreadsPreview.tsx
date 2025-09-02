import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Thread = { id: string; title: string; replies?: number; user?: string };

const MOCK: Thread[] = [
  { id:"t1", title:"Best controller binds for GTA Online", replies:18, user:"Ari" },
  { id:"t2", title:"Your FPS tips for mid-range GPUs", replies:33, user:"Rex" },
  { id:"t3", title:"Show your best Minecraft builds", replies:11, user:"Jax" }
];

export default function ThreadsPreview(){
  const [items, setItems] = useState<Thread[]>(MOCK);
  const [err, setErr] = useState<string|undefined>();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replies, setReplies] = useState<Record<string, Array<{id:number, user?:string, content:string, created_at:string}>>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    (async () => {
      try {
        const { data, error } = await supabase
          .from("threads")
          .select("id, title, replies, user")
          .order("id", { ascending: false })
          .limit(10);
        if (error) throw error;
        if (data && data.length) setItems(data as any);
      } catch (e:any) {
        setErr(e.message);
      }
    })();
  }, []);

  async function loadReplies(threadId: string){
    try {
      const { data, error } = await supabase
        .from('thread_replies')
        .select('id, user, content, created_at')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: false })
        .limit(10);
      if(error) throw error;
      setReplies(prev => ({ ...prev, [threadId]: (data as any) || [] }));
    } catch(e:any){ setErr(e.message); }
  }

  function toggleThread(tid: string){
    setOpen(prev => ({ ...prev, [tid]: !prev[tid] }));
    if(!open[tid]) loadReplies(tid);
  }

  async function submitReply(t: Thread){
    const content = (replyText[t.id]||'').trim(); if(!content) return;
    const { data: auth } = await supabase.auth.getUser();
    if(!auth.user){ setErr('Sign in to reply'); return; }
    try {
      const { data, error } = await supabase
        .from('thread_replies')
        .insert({ thread_id: t.id, user: auth.user.email, content })
        .select();
      if(error) throw error;
      // update replies list
      setReplies(prev => ({ ...prev, [t.id]: [ ...(data as any), ...(prev[t.id]||[]) ] }));
      setReplyText(prev => ({ ...prev, [t.id]: '' }));
      // increment reply count on thread
      const newCount = (t.replies||0) + 1;
      await supabase.from('threads').update({ replies: newCount }).eq('id', t.id);
      setItems(prev => prev.map(x => x.id===t.id ? { ...x, replies: newCount } : x));
    } catch(e:any){ setErr(e.message); }
  }

  async function createThread(e: React.FormEvent){
    e.preventDefault();
    if(!title.trim()) return;
    setLoading(true);
    try{
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ setErr('Sign in to post'); return; }
      const { data, error } = await supabase.from('threads').insert({ title, user: user.email, replies: 0 }).select();
      if(error) throw error;
      if(data && data[0]) setItems(prev => [data[0] as any, ...prev]);
      setTitle("");
      // XP reward for posting a thread
      try { const { addXp } = await import("@/lib/xp"); await addXp(10); } catch {}
    } catch(e:any){ setErr(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h3 className="h2">Latest Discussions</h3>
        <form onSubmit={createThread} style={{display:'flex', gap:8, marginBottom:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={userEmail?"Start a new topic":"Sign in to start a topic"} className="nl__input" disabled={!userEmail || loading} />
          <button className="gx-btn gx-btn--soft" disabled={!userEmail || loading}>Post</button>
        </form>
        {items.map(t=> (
          <div key={t.id} className="thread" style={{border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(21,26,59,.5)", marginBottom:8}}>
            <div style={{display:"flex", gap:12, alignItems:"center", padding:"10px 12px"}}>
              <div className="badge">@{t.user || "User"}</div>
              <div style={{fontWeight:700}}>{t.title}</div>
              <div style={{marginLeft:"auto", opacity:.8}}>{t.replies ?? 0} replies</div>
              <button className="gx-btn gx-btn--soft" onClick={()=>toggleThread(t.id)}>{open[t.id] ? 'Hide' : 'Reply'}</button>
            </div>
            {open[t.id] && (
              <div style={{padding:"0 12px 12px"}}>
                <div style={{display:'flex', gap:8, marginBottom:8}}>
                  <input className="nl__input" placeholder="Write a reply" value={replyText[t.id]||''} onChange={e=>setReplyText(prev=>({...prev,[t.id]:e.target.value}))} />
                  <button className="gx-btn gx-btn--soft" onClick={()=>submitReply(t)}>Send</button>
                </div>
                <div style={{display:'grid', gap:8}}>
                  {(replies[t.id]||[]).map(r => (
                    <div key={r.id} className="card-glass" style={{padding:10}}>
                      <div style={{fontSize:12, opacity:.75}}>@{r.user} • {new Date(r.created_at).toLocaleString()}</div>
                      <div>{r.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {err && <div style={{opacity:.7, fontSize:12}}>Note: {err} — showing demo or partial data.</div>}
      </div>
    </section>
  );
}
