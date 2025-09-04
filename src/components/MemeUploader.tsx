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
      const up = await uploadMeme(file, uid);
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

