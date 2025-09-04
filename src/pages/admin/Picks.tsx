import React from "react";
import { sb } from "@/lib/supabase";
import { getSignedUrl } from "@/lib/signedImage";
import { showError, showSuccess } from "@/utils/toast";

type PickRow = {
  id: string;
  game_id: string;
  slug: string;
  title: string;
  thumb?: string;
  rank: number;
  badge?: string | null;
};

// TODO: Protect this route behind admin auth/role checks.
export default function AdminPicksPage() {
  const [items, setItems] = React.useState<PickRow[]>([]);
  const [original, setOriginal] = React.useState<PickRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [slug, setSlug] = React.useState("");

  const dirty = React.useMemo(() => {
    if (items.length !== original.length) return true;
    const byId: Record<string, PickRow> = Object.fromEntries(original.map(i => [i.id, i]));
    for (let idx = 0; idx < items.length; idx++) {
      const it = items[idx];
      const o = byId[it.id];
      if (!o) return true;
      if ((idx + 1) !== it.rank) return true;
      if ((o.badge || "") !== (it.badge || "")) return true;
    }
    return false;
  }, [items, original]);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await sb
        .from("recommended_games")
        .select("id, game_id, rank, badge, games!inner(id, slug, title, cover_path)")
        .order("rank", { ascending: true });
      if (error) {
        showError(`Load failed: ${error.message}`);
        setItems([]);
        setOriginal([]);
        setLoading(false);
        return;
      }
      const rows = (data || []) as any[];
      const mapped: PickRow[] = await Promise.all(rows.map(async (r: any) => {
        const cover = r.games?.cover_path as string | undefined;
        const thumb = cover ? await getSignedUrl("media", cover, 600, 300) : undefined;
        return {
          id: r.id,
          game_id: r.game_id,
          slug: r.games?.slug,
          title: r.games?.title,
          rank: r.rank,
          badge: r.badge,
          thumb,
        } as PickRow;
      }));
      setItems(mapped);
      setOriginal(JSON.parse(JSON.stringify(mapped)));
      setLoading(false);
    })();
  }, []);

  function onDragStart(e: React.DragEvent, idx: number) {
    e.dataTransfer.setData("text/plain", String(idx));
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(e: React.DragEvent, idx: number) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from) || from === idx) return;
    setItems(prev => {
      const arr = prev.slice();
      const [moved] = arr.splice(from, 1);
      arr.splice(idx, 0, moved);
      // recompute ranks
      return arr.map((it, i) => ({ ...it, rank: i + 1 }));
    });
  }

  async function saveAll() {
    try {
      const payload = items.map(it => ({ id: it.id, rank: it.rank, badge: it.badge ?? null }));
      const { error } = await sb.from("recommended_games").upsert(payload as any, { onConflict: "id" });
      if (error) throw error;
      showSuccess("Picks saved");
      setOriginal(JSON.parse(JSON.stringify(items)));
    } catch (e: any) {
      showError(`Save failed: ${e?.message ?? e}`);
    }
  }

  async function addBySlug() {
    const s = slug.trim();
    if (!s) return;
    setAdding(true);
    try {
      const exists = items.some(it => it.slug === s);
      if (exists) {
        showError("Already in picks");
        return;
      }
      const { data: g, error } = await sb.from("games").select("id, slug, title, cover_path").eq("slug", s).single();
      if (error || !g) throw new Error(error?.message || "Game not found");
      const nextRank = items.length ? Math.max(...items.map(i => i.rank)) + 1 : 1;
      const { data: inserted, error: iErr } = await sb
        .from("recommended_games")
        .insert({ game_id: g.id, rank: nextRank })
        .select("id")
        .single();
      if (iErr) throw iErr;
      const thumb = g.cover_path ? await getSignedUrl("media", g.cover_path, 600, 300) : undefined;
      const row: PickRow = { id: inserted!.id, game_id: g.id, slug: g.slug, title: g.title, thumb, rank: nextRank, badge: null };
      setItems(prev => [...prev, row]);
      setSlug("");
      showSuccess("Added to picks");
    } catch (e: any) {
      showError(`Add failed: ${e?.message ?? e}`);
    } finally {
      setAdding(false);
    }
  }

  async function remove(id: string) {
    try {
      const { error } = await sb.from("recommended_games").delete().eq("id", id);
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id).map((it, i) => ({ ...it, rank: i + 1 })));
      showSuccess("Removed");
    } catch (e: any) {
      showError(`Remove failed: ${e?.message ?? e}`);
    }
  }

  return (
    <div className="wrap" style={{ padding: 20 }}>
      <h1 className="title-xl font-extrabold mb-4">Admin: Picks</h1>
      <div className="flex items-center gap-2 mb-4">
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="Add by slug (e.g. elden-ring)"
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10 w-[280px]"
        />
        <button onClick={addBySlug} disabled={adding} className="btn">
          {adding ? "Adding..." : "Add"}
        </button>
        <button onClick={saveAll} disabled={!dirty} className={`btn ${dirty ? '' : 'opacity-60 cursor-not-allowed'}`}>
          Save changes
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : !items.length ? (
        <div className="opacity-80">No picks yet. Use the field above to add by slug.</div>
      ) : (
        <div className="grid gap-2">
          {items.map((it, idx) => (
            <div key={it.id}
                 className="flex items-center gap-3 p-2 rounded-md border border-white/10 bg-white/5"
                 draggable
                 onDragStart={(e)=>onDragStart(e, idx)}
                 onDragOver={onDragOver}
                 onDrop={(e)=>onDrop(e, idx)}>
              <div className="w-6 text-xs opacity-70">{idx+1}</div>
              <div className="w-16 h-10 bg-white/10 rounded overflow-hidden">
                {it.thumb ? <img src={it.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                <div className="text-xs opacity-70">{it.slug}</div>
              </div>
              <div className="flex items-center gap-2">
                <select value={it.badge || ""} onChange={(e)=>{
                  const v = e.target.value || null;
                  setItems(prev => prev.map(p => p.id === it.id ? { ...p, badge: v } : p));
                }} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-sm">
                  <option value="">(no badge)</option>
                  <option value="Top Pick">Top Pick</option>
                  <option value="Editor’s Choice">Editor’s Choice</option>
                  <option value="🔥 Hot Deal">🔥 Hot Deal</option>
                  <option value="💸 Great Price">💸 Great Price</option>
                </select>
                <input
                  value={it.badge || ""}
                  onChange={e => setItems(prev => prev.map(p => p.id === it.id ? { ...p, badge: e.target.value || null } : p))}
                  placeholder="Custom badge"
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-sm"
                  style={{ width: 180 }}
                />
                <button onClick={()=>remove(it.id)} className="btn btn--soft">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

