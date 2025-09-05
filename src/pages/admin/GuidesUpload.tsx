import React from "react";
import AdminGuard from "@/pages/admin/Guard";
import { sb } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthProvider";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function GuidesUpload() {
  const { user } = useAuth();
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!title) return;
    setSlug(s => s || slugify(title));
  }, [title]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (busy) return;
    if (!file) { setMessage("Pick an .mdx file to upload"); return; }
    if (!title) { setMessage("Title is required"); return; }
    const finalSlug = slug || slugify(title);
    if (!finalSlug) { setMessage("Slug is required"); return; }

    try {
      setBusy(true);
      const path = `${finalSlug}/${Date.now()}.mdx`;
      const { error: upErr } = await sb.storage.from("guides").upload(path, file, {
        contentType: "text/markdown",
        upsert: false,
      });
      if (upErr) throw upErr;

      const tagArr = tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      const { error: insErr } = await sb.from("guides").insert({
        title,
        slug: finalSlug,
        description,
        mdx_path: path,
        tags: tagArr,
      });
      if (insErr) throw insErr;
      setMessage("Uploaded and saved! View it at /guides/" + finalSlug);
      setFile(null);
    } catch (e: any) {
      setMessage(e?.message || "Failed to upload guide");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminGuard>
      <div className="wrap" style={{ padding: 20 }}>
        <h1 className="title-xl">Upload Guide (MDX)</h1>
        <form onSubmit={onSubmit} style={{ maxWidth: 720, display: 'grid', gap: 12 }}>
          <label>
            <div>Title</div>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Guide title" />
          </label>
          <label>
            <div>Slug</div>
            <input className="input" value={slug} onChange={e=>setSlug(slugify(e.target.value))} placeholder="auto-from-title" />
          </label>
          <label>
            <div>Description</div>
            <textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short summary" rows={3} />
          </label>
          <label>
            <div>Tags (comma separated)</div>
            <input className="input" value={tags} onChange={e=>setTags(e.target.value)} placeholder="gta6, pc, how-to" />
          </label>
          <label>
            <div>MDX File</div>
            <input type="file" accept=".mdx,.md" onChange={e=>setFile(e.target.files?.[0] || null)} />
          </label>
          <div>
            <button className="btn" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
          </div>
          {message && <div style={{ opacity: .9 }}>{message}</div>}
        </form>
      </div>
    </AdminGuard>
  );
}

