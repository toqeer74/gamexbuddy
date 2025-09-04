import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { sb } from "@/lib/supabase";
import ImagePicker from "@/components/admin/ImagePicker";

function slugify(s: string){
  return (s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

export default function Editor(){
  const [checked, setChecked] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  // tab: 'news' | 'guide'
  const [tab, setTab] = useState<'news'|'guide'>('news');

  // news form
  const [nTitle, setNTitle] = useState("");
  const [nSlug, setNSlug] = useState("");
  const [nExcerpt, setNExcerpt] = useState("");
  const [nBody, setNBody] = useState("");
  const [nImage, setNImage] = useState("");
  const [newsImagePath, setNewsImagePath] = useState<string | undefined>(undefined);
  const [nStatus, setNStatus] = useState<'draft'|'published'>('published');
  const [nTags, setNTags] = useState("");
  const nSlugAuto = useMemo(()=> slugify(nTitle), [nTitle]);

  // guide form
  const [gTitle, setGTitle] = useState("");
  const [gSlug, setGSlug] = useState("");
  const [gBody, setGBody] = useState("");
  const [gGame, setGGame] = useState("");
  const [gTags, setGTags] = useState("");
  const [gSeo, setGSeo] = useState<string>("{\n  \"description\": \"\"\n}");
  const [gStatus, setGStatus] = useState<'draft'|'published'>('published');
  const [guideCoverPath, setGuideCoverPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getUser();
      const u = data.user;
      if (!u) { setChecked(true); return; }
      setUser({ id: u.id, email: (u as any)?.email });
      const { data: prof } = await sb.from("profiles").select("is_editor").eq("id", u.id).single();
      setIsEditor(!!prof?.is_editor);
      setChecked(true);
    })();
  }, []);

  async function submitNews(e: React.FormEvent){
    e.preventDefault();
    const slug = (nSlug || nSlugAuto) || slugify(`${Date.now()}-${nTitle}`);
    const tags = nTags.split(",").map(s=>s.trim()).filter(Boolean);
    const { error } = await sb.from("news").upsert({
      title: nTitle,
      slug,
      excerpt: nExcerpt,
      body_html: nBody,
      image_url: nImage || null,
      image_path: newsImagePath ?? null,
      tags,
      published_at: new Date().toISOString(),
      status: nStatus
    }, { onConflict: 'slug' } as any);
    if (error) alert("Save failed"); else alert("Saved news");
  }

  async function submitGuide(e: React.FormEvent){
    e.preventDefault();
    const slug = (gSlug || slugify(gTitle)) || slugify(`${Date.now()}-${gTitle}`);
    let seo: any = {};
    try { seo = JSON.parse(gSeo || '{}'); } catch { alert('SEO JSON invalid'); return; }
    const tags = gTags.split(",").map(s=>s.trim()).filter(Boolean);
    const { error } = await sb.from("guides").upsert({
      title: gTitle,
      slug,
      body_mdx: gBody,
      game: gGame || null,
      tags,
      seo,
      published_at: new Date().toISOString(),
      status: gStatus,
      cover_path: guideCoverPath ?? null
    }, { onConflict: 'slug' } as any);
    if (error) alert("Save failed"); else alert("Saved guide");
  }

  if (checked && !isEditor) return <Navigate to="/" replace />;

  return (
    <div className="wrap" style={{ padding: 20 }}>
      <h1>Editor</h1>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button className={`gx-btn ${tab==='news'?'gx-btn--soft':''}`} onClick={()=>setTab('news')}>News</button>
        <button className={`gx-btn ${tab==='guide'?'gx-btn--soft':''}`} onClick={()=>setTab('guide')}>Guides</button>
      </div>

      {tab === 'news' ? (
        <form onSubmit={submitNews} className="card-glass" style={{ padding: 12, display:'grid', gap: 8 }}>
          <label>Title<input className="nl__input" value={nTitle} onChange={e=>setNTitle(e.target.value)} /></label>
          <label>Slug (optional)<input className="nl__input" value={nSlug} onChange={e=>setNSlug(e.target.value)} placeholder={nSlugAuto} /></label>
          <label>Excerpt<textarea className="nl__input" rows={3} value={nExcerpt} onChange={e=>setNExcerpt(e.target.value)} /></label>
          <label>Body HTML<textarea className="nl__input" rows={6} value={nBody} onChange={e=>setNBody(e.target.value)} /></label>
          <label>Image URL (optional)<input className="nl__input" value={nImage} onChange={e=>setNImage(e.target.value)} placeholder="https://… (leave empty to use uploaded image)" /></label>
          <ImagePicker bucket="media" value={newsImagePath} onChange={(p)=> setNewsImagePath(p)} label="Upload Cover Image" />
          <label>Tags (comma-separated)<input className="nl__input" value={nTags} onChange={e=>setNTags(e.target.value)} /></label>
          <label>Status<select value={nStatus} onChange={e=>setNStatus(e.target.value as any)}><option value="published">published</option><option value="draft">draft</option></select></label>
          <div><button className="gx-btn gx-btn--soft">Save News</button></div>
        </form>
      ) : (
        <form onSubmit={submitGuide} className="card-glass" style={{ padding: 12, display:'grid', gap: 8 }}>
          <label>Title<input className="nl__input" value={gTitle} onChange={e=>setGTitle(e.target.value)} /></label>
          <label>Slug (optional)<input className="nl__input" value={gSlug} onChange={e=>setGSlug(e.target.value)} placeholder={slugify(gTitle)} /></label>
          <label>Game<input className="nl__input" value={gGame} onChange={e=>setGGame(e.target.value)} /></label>
          <label>Tags (comma-separated)<input className="nl__input" value={gTags} onChange={e=>setGTags(e.target.value)} /></label>
          <label>SEO (JSON)<textarea className="nl__input" rows={4} value={gSeo} onChange={e=>setGSeo(e.target.value)} /></label>
          <ImagePicker bucket="media" value={guideCoverPath} onChange={(p)=> setGuideCoverPath(p)} label="Guide Cover Image" />
          <label>Body MDX<textarea className="nl__input" rows={12} value={gBody} onChange={e=>setGBody(e.target.value)} placeholder={"# My Guide\n\nWrite MDX here..."} /></label>
          <label>Status<select value={gStatus} onChange={e=>setGStatus(e.target.value as any)}><option value="published">published</option><option value="draft">draft</option></select></label>
          <div><button className="gx-btn gx-btn--soft">Save Guide</button></div>
        </form>
      )}
    </div>
  );
}
