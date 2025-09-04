import { sb } from "@/lib/supabase";

export async function uploadMeme(file: File, userId: string) {
  const path = `${userId}/${Date.now()}-${file.name}`.replace(/\s+/g, "-");
  const { error: upErr } = await sb.storage.from("memes").upload(path, file, { upsert: false });
  if (upErr) return { error: upErr } as const;

  const { data: signed, error: urlErr } = await sb.storage.from("memes").createSignedUrl(path, 60 * 60 * 24 * 7);
  if (urlErr) return { error: urlErr } as const;

  return { url: signed.signedUrl } as const;
}

