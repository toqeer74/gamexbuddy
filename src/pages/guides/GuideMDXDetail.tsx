import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";
import { getSignedUrl } from "@/lib/signedImage";

// Note: Avoid top-level imports of @mdx-js to prevent build failure
// when deps are not installed. We lazy-load at runtime.

export default function GuideMDXDetail(){
  const { slug = "" } = useParams();
  const [g, setG] = useState<any>(null);
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [mdxError, setMdxError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

  useEffect(()=>{
    let active = true;
    (async () => {
      const { data } = await sb.from("guides").select("*").eq("slug", slug).single();
      if (!active) return;
      setG(data);
      if (data?.cover_path) {
        try { setCoverUrl(await getSignedUrl("media", data.cover_path)); } catch { setCoverUrl(undefined); }
      } else { setCoverUrl(undefined); }
      if (data?.body_mdx) {
        try {
          // Dynamic import to keep optional
          const runtime = await import("react/jsx-runtime");
          const mdx = await import("@mdx-js/mdx");
          // @ts-ignore - no types unless user installs @types
          const mod = await mdx.run(data.body_mdx, { ...runtime });
          if (!active) return;
          setMDXContent(() => mod.default as any);
        } catch (e:any) {
          if (!active) return;
          setMdxError(e?.message || "Failed to parse MDX. Install @mdx-js/mdx and @mdx-js/react.");
        }
      }
    })();
    return () => { active = false; };
  },[slug]);

  if (!g) return <div className="wrap">Loading…</div>;
  return (
    <div className="wrap" style={{ padding:"32px 20px" }}>
      <Helmet>
        <title>{g.title} | Guides | GameXBuddy</title>
        <link rel="canonical" href={canonical(`/guides/${slug}`)} />
        <meta name="description" content={g?.seo?.description || ""} />
      </Helmet>
      <h1 className="title-xl">{g.title}</h1>
      {coverUrl && (
        <img src={coverUrl} alt="" style={{ width:"100%", maxHeight:420, objectFit:"cover", borderRadius:12, margin:"12px 0" }} />
      )}
      {mdxError && <p style={{ color:"#c00" }}>{mdxError}</p>}
      {MDXContent ? <MDXContent /> : (!mdxError ? <p>Parsing…</p> : null)}
    </div>
  );
}
