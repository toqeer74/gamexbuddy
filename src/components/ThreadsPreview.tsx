import React, { useEffect, useRef, useState } from "react";
import { sb } from "@/lib/supabase";
import { getThreadsWithCounts, getReplies, createReply, createThread, incrementXP } from "@/lib/communityApi";

type Post = {
  id: string;
  title: string | null;
  body: string | null;
  author_id: string | null;
  created_at: string;
};

type Reply = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export default function ThreadsPreview() {
  const [threads, setThreads] = useState<Post[]>([]);
  const [replyCount, setReplyCount] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [draft, setDraft] = useState("");
  const [me, setMe] = useState<{ id: string; email?: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [creating, setCreating] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // auth
  useEffect(() => {
    let unsub: any;
    (async () => {
      const { data } = await sb.auth.getUser();
      if (data.user) setMe({ id: data.user.id, email: (data.user as any).email });
      const sub = sb.auth.onAuthStateChange((_e, s) => {
        if (s?.user) setMe({ id: s.user.id, email: (s.user as any).email }); else setMe(null);
      });
      unsub = sub.data?.subscription;
    })();
    return () => { try { unsub?.unsubscribe?.(); } catch {} };
  }, []);

  // initial load
  useEffect(() => {
    (async () => {
      const { data, error } = await getThreadsWithCounts();
      if (!error && data) {
        setThreads(data as any);
        const map = Object.fromEntries(((data as any[]) || []).map((t: any) => [t.id, t.reply_count ?? 0]));
        setReplyCount(map);
      }
    })();
  }, []);

  // realtime: threads
  useEffect(() => {
    const ch = sb
      .channel("threads")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts", filter: "type=eq.thread" }, (payload) => {
        const p = payload.new as Post;
        setThreads((old) => [p, ...old]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "posts", filter: "type=eq.thread" }, (payload) => {
        const p = payload.old as Post;
        setThreads((old) => old.filter((t) => t.id !== p.id));
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, []);

  // realtime: replies
  useEffect(() => {
    const ch = sb
      .channel("replies")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "post_replies" }, (payload) => {
        const r = payload.new as Reply;
        setReplyCount((m) => ({ ...m, [r.post_id]: (m[r.post_id] || 0) + 1 }));
        if (open === r.post_id) setReplies((all) => ({ ...all, [r.post_id]: [r, ...(all[r.post_id] || [])] }));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "post_replies" }, (payload) => {
        const r = payload.old as Reply;
        setReplyCount((m) => ({ ...m, [r.post_id]: Math.max(0, (m[r.post_id] || 1) - 1) }));
        if (open === r.post_id) setReplies((all) => ({ ...all, [r.post_id]: (all[r.post_id] || []).filter((x) => x.id !== r.id) }));
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [open]);

  async function onOpenThread(id: string) {
    const willOpen = open === id ? null : id;
    setOpen(willOpen);
    if (willOpen && !replies[willOpen]) {
      const { data, error } = await getReplies(willOpen);
      if (!error && data) {
        setReplies((all) => ({ ...all, [willOpen]: data as any }));
        setReplyCount((m) => ({ ...m, [willOpen]: (data as any[]).length }));
      }
    }
    const el = document.getElementById(`thread-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function onReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!open || !me || !draft.trim()) return;
    const body = draft.trim();
    setDraft("");
    const temp: Reply = { id: `temp-${Date.now()}` as string, post_id: open, author_id: me.id, body, created_at: new Date().toISOString() };
    setReplies((all) => ({ ...all, [open]: [temp, ...(all[open] || [])] }));
    setReplyCount((m) => ({ ...m, [open]: (m[open] || 0) + 1 }));
    const { error } = await createReply(open, body, me.id);
    if (error) {
      setReplies((all) => ({ ...all, [open]: (all[open] || []).filter((r) => r.id !== temp.id) }));
      setReplyCount((m) => ({ ...m, [open]: Math.max(0, (m[open] || 1) - 1) }));
      alert("Reply failed. Please try again.");
    } else {
      try { await incrementXP(me.id, 5); } catch {}
    }
  }

  async function onCreateThread(e: React.FormEvent) {
    e.preventDefault();
    if (!me || !newTitle.trim()) return;
    setCreating(true);
    try {
      const { data, error } = await createThread(newTitle.trim(), newBody.trim(), me.id);
      if (error) throw error;
      if (data) setThreads((cur) => [data as any, ...cur]);
      setNewTitle(""); setNewBody("");
      try { await incrementXP(me.id, 20); } catch {}
    } catch (err) {
      alert("Failed to create thread.");
    } finally { setCreating(false); }
  }

  return (
    <section className="section" aria-labelledby="threads-heading">
      <div className="wrap">
        <h3 id="threads-heading" className="h2">Latest Discussions</h3>

        {/* New Thread Composer */}
        <form onSubmit={onCreateThread} aria-label="Create new thread" style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <input
            className="nl__input"
            placeholder={me ? "Thread title" : "Sign in to start a topic"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={!me || creating}
            aria-label="Thread title"
            style={{ padding: 10, borderRadius: 10 }}
          />
          <input
            className="nl__input"
            placeholder="Optional: add a short description"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            disabled={!me || creating}
            aria-label="Thread description"
            style={{ padding: 10, borderRadius: 10 }}
          />
          <div>
            <button className="gx-btn gx-btn--soft" disabled={!me || creating || !newTitle.trim()}>
              {creating ? "Posting…" : "Post"}
            </button>
          </div>
        </form>

        <div role="list" aria-label="Threads list" ref={listRef}>
          {threads.map((t) => {
            const count = replyCount[t.id] ?? 0;
            const openThis = open === t.id;
            return (
              <article
                id={`thread-${t.id}`}
                key={t.id}
                role="listitem"
                className="card-glass thread-row"
                aria-labelledby={`thread-title-${t.id}`}
                aria-expanded={openThis}
                aria-controls={`thread-panel-${t.id}`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenThread(t.id); } }}
                onClick={() => onOpenThread(t.id)}
                style={{ marginBottom: 8, padding: "10px 12px" }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <h4 id={`thread-title-${t.id}`} style={{ fontWeight: 700, flex: 1, margin: 0 }}>
                    {t.title || (t.body ? (t.body.length > 60 ? t.body.slice(0, 57) + "…" : t.body) : "Untitled thread")}
                  </h4>
                  <div className="reply-chip" aria-label={`${count} replies`}>💬 {count}</div>
                  <button className="gx-btn gx-btn--soft" aria-expanded={openThis} aria-controls={`thread-panel-${t.id}`}>
                    {openThis ? "Hide" : "Open"}
                  </button>
                </div>

                {openThis && (
                  <div id={`thread-panel-${t.id}`} style={{ paddingTop: 10 }}>
                    <div style={{ marginBottom: 8 }}>
                      <ReportButton postId={t.id} userId={me?.id} />
                    </div>
                    <form onSubmit={onReplySubmit} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input
                        className="nl__input"
                        placeholder={me ? "Write a reply" : "Sign in to reply"}
                        aria-label="Write a reply"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        disabled={!me}
                        style={{ flex: 1, padding: 10, borderRadius: 10 }}
                      />
                      <button className="gx-btn gx-btn--soft" disabled={!me || !draft.trim()}>
                        Send
                      </button>
                    </form>
                    <div style={{ display: "grid", gap: 8 }}>
                      {(replies[t.id] || []).map((r) => (
                        <div key={r.id} className="card-glass" style={{ padding: 10 }}>
                          <div style={{ fontSize: 12, opacity: 0.75 }}>
                            {new Date(r.created_at).toLocaleString()}
                          </div>
                          <div>{r.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
