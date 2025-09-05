import React, { useEffect, useState } from "react";
import { uploadMeme } from "@/lib/upload";
import { createPost, incrementXP } from "@/lib/communityApi";
import { supabase } from "@/lib/supabaseClient";

export default function MemeUploader(){
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUid(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUid(s?.user?.id ?? null));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if (!uid || !file) return;
    setBusy(true);
    try {
      const processed = await compressImage(file, 1600, 0.82);
      const up = await uploadMeme(processed || file, uid);
      if ((up as any).error) throw (up as any).error;
      const url = (up as any).url as string;
      const { error } = await createPost({ type: "meme", title: file.name, image_url: url } as any);
      if (error) throw error;
      await incrementXP(uid, 20);
      setFile(null);
      alert("Meme posted!");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally { setBusy(false); }
  }

  async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<File | null> {
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = URL.createObjectURL(file);
      });
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, w, h);
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
      if (!blob) return null;
      return new File([blob], file.name.replace(/\.(png|webp|gif)$/i, '.jpg'), { type: 'image/jpeg' });
    } catch { return null; }
  }

  return (
    <form onSubmit={onSubmit} className="card-glass" style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} aria-label="Choose meme image" disabled={!uid || busy} />
      <button className="gx-btn gx-btn--soft" type="submit" disabled={!uid || !file || busy}>
        {busy ? "Uploading…" : "Post Meme"}
      </button>
      {!uid && <span style={{ opacity:.7 }}>Sign in to upload</span>}
    </form>
  );
}
