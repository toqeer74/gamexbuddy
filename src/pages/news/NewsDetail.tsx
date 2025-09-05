import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";
import { getSignedUrl } from "@/lib/signedImage";
import { useEarnOnRead } from "@/hooks/useEarnOnRead";

export default function NewsDetail(){
  const { slug = "" } = useParams();
  const [n, setN] = useState<any>(null);
  const [img, setImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    sb.from("news").select("*").eq("slug", slug).single().then(async ({ data })=> {
      if (!active) return;
      setN(data);
      if (data?.image_path) {
        const url = await getSignedUrl("media", data.image_path);
        if (active) setImg(url);
      } else if (data?.image_url) {
        setImg(data.image_url);
      } else setImg(undefined);
    });
    return () => { active = false; };
  }, [slug]);

  // Award once when user actually reads (uses slug as event_ref)
  useEarnOnRead(slug || "");

  if (!n) return <div className="wrap">Loading…</div>;
  return (
    <div className="wrap" style={{ padding:"32px 20px" }}>
      <Helmet>
        <title>{n.title} | News | GameXBuddy</title>
        <link rel="canonical" href={canonical(`/news/${slug}`)} />
        <meta name="description" content={n.excerpt || ""} />
      </Helmet>
      <h1 className="title-xl">{n.title}</h1>
      {img && <img src={img} alt="" style={{ width:"100%", maxHeight:420, objectFit:"cover", borderRadius:12 }} />}
      <div dangerouslySetInnerHTML={{ __html: n.body_html || "" }} />
    </div>
  );
}
