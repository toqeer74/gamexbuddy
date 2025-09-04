import React, { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { sb } from "@/lib/supabase";
import { getSignedUrls } from "@/lib/signedImage";
import GuideCardDb from "@/components/GuideCardDb";

export default function GuideCarouselDb() {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "start", dragFree: true });
  const [items, setItems] = useState<Array<{ slug: string; title: string; excerpt?: string; cover_path?: string | null }>>([]);
  const [covers, setCovers] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("guides")
        .select("slug, title, cover_path, published_at, status")
        .eq("status", "published")
        .order("published_at", { ascending: false } as any)
        .limit(12);
      setItems((data || []) as any);
    })();
  }, []);

  const paths = useMemo(() => (items.map(i => i.cover_path).filter(Boolean) as string[]), [items]);

  useEffect(() => {
    (async () => {
      if (!paths.length) { setCovers({}); return; }
      const map = await getSignedUrls("media", paths, 600);
      setCovers(map);
    })();
  }, [paths]);

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Gear & Gaming Guides</h2>
        <div className="guide-carousel" ref={emblaRef}>
          <div className="embla__container" style={{ display: "flex", gap: 16 }}>
            {items.map(g => (
              <div className="embla__slide" key={g.slug} style={{ flex: "0 0 280px" }}>
                <GuideCardDb
                  title={g.title}
                  slug={g.slug}
                  cover_path={g.cover_path}
                  coverUrl={g.cover_path ? covers[g.cover_path] : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

