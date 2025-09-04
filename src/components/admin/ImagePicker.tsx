import React, { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import { getSignedUrl } from "@/lib/signedImage";

export default function ImagePicker({
  bucket = "media",
  value,
  onChange,
  label = "Cover Image",
  makePublic = false,
}: {
  bucket?: string;
  value?: string;
  onChange: (path: string, previewUrl?: string) => void;
  label?: string;
  makePublic?: boolean;
}) {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!value) { setPreview(undefined); return; }
      if (makePublic) {
        const { data } = sb.storage.from(bucket).getPublicUrl(value);
        setPreview(data.publicUrl);
      } else {
        setPreview(await getSignedUrl(bucket, value));
      }
    })();
  }, [bucket, value, makePublic]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const path = `${Date.now()}-${f.name}`.replace(/\s+/g, "_");
      const { error } = await sb.storage.from(bucket).upload(path, f, { upsert: true, contentType: f.type });
      if (error) throw error;
      let previewUrl: string | undefined = undefined;
      if (makePublic) {
        const { data } = sb.storage.from(bucket).getPublicUrl(path);
        previewUrl = data.publicUrl;
      } else {
        previewUrl = await getSignedUrl(bucket, path);
      }
      onChange(path, previewUrl);
      setPreview(previewUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setBusy(false);
      (e.target as any).value = "";
    }
  }

  return (
    <div className="card-glass" style={{ padding: 12, display:"grid", gap:8 }}>
      <label><strong>{label}</strong></label>
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: "100%", borderRadius: 8 }} />}
      <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
      {value && <small style={{ opacity:.7 }}>Path: {value}</small>}
    </div>
  );
}

