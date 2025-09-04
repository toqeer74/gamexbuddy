import React, { useEffect, useState } from "react";
import { getSignedUrl } from "@/lib/signedImage";

export default function GuideCardDb({
  title,
  slug,
  excerpt,
  cover_path,
  coverUrl
}: { title: string; slug: string; excerpt?: string; cover_path?: string | null; coverUrl?: string }){
  const [cover, setCover] = useState<string | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (coverUrl) { if (alive) setCover(coverUrl); return; }
      if (!cover_path) { if (alive) setCover(undefined); return; }
      const url = await getSignedUrl("media", cover_path, 600);
      if (alive) setCover(url);
    })();
    return () => { alive = false; };
  }, [cover_path, coverUrl]);

  return (
    <a href={`/guides/${slug}`} className="card-glass guide-card" style={{ display:'block' }}>
      {cover && (
        <img
          src={cover}
          alt=""
          className="guide-card__cover"
          style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }}
          loading="lazy"
        />
      )}
      <div className="guide-card__body" style={{ padding: 12 }}>
        <h3 className="line-clamp-2" style={{ fontWeight: 700 }}>{title}</h3>
        {excerpt && <p className="line-clamp-3" style={{ opacity: 0.8 }}>{excerpt}</p>}
      </div>
    </a>
  );
}
