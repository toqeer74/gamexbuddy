import { sb } from "@/lib/supabase";

type CacheEntry = { url: string; exp: number };
const cache = new Map<string, CacheEntry>();

function key(bucket: string, path: string, expires: number, width?: number, height?: number) {
  return `${bucket}:${path}:${expires}:${width ?? 0}:${height ?? 0}`;
}

export async function getAvatarUrl(path?: string, expires = 600) {
  if (!path) return undefined;
  return getSignedUrl("avatars", path, expires);
}

// Backward-compatible signature: (bucket, path, expires?, width?)
// New optional: height as 5th arg
export async function getSignedUrl(bucket: string, path?: string, expires = 600, width?: number, height?: number) {
  if (!path) return undefined;
  const k = key(bucket, path, expires, width, height);
  const now = Date.now();
  const hit = cache.get(k);
  if (hit && hit.exp > now) return hit.url;

  const opts = (width || height) ? { transform: { width, height } } : undefined as any;
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(path, expires, opts);
  if (error || !data?.signedUrl) return undefined;
  const url = data.signedUrl;
  cache.set(k, { url, exp: now + expires * 1000 - 2000 });
  return url;
}

export async function getSignedUrls(bucket: string, paths: string[], expires = 600, width?: number, height?: number): Promise<Record<string, string | undefined>> {
  const out: Record<string, string | undefined> = {};
  const toFetch: string[] = [];
  const now = Date.now();

  for (const p of paths) {
    const k = key(bucket, p, expires, width, height);
    const hit = cache.get(k);
    if (hit && hit.exp > now) out[p] = hit.url; else toFetch.push(p);
  }

  if (toFetch.length) {
    // Try batch API when no transform (width/height) is requested
    const anyClient: any = sb.storage.from(bucket) as any;
    if (typeof anyClient.createSignedUrls === "function" && !(width || height)) {
      const { data, error } = await anyClient.createSignedUrls(toFetch, expires);
      if (!error && Array.isArray(data)) {
        for (const item of data) {
          const url: string | undefined = item?.signedUrl || undefined;
          out[item.path] = url;
          if (url) {
            const k2 = key(bucket, item.path, expires, width, height);
            cache.set(k2, { url, exp: now + expires * 1000 - 2000 });
          }
        }
      }
    }
    // Fallback singles for any unresolved or when transform is required
    await Promise.all(toFetch.map(async (p) => {
      if (out[p] !== undefined && !(width || height)) return; // already filled by batch
      out[p] = await getSignedUrl(bucket, p, expires, width, height);
    }));
  }
  return out;
}
