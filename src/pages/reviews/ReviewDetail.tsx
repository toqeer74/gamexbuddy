import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";

export default function ReviewDetail(){
  const { slug = "" } = useParams();
  const [r, setR] = useState<any>(null);

  useEffect(()=>{
    sb.from("reviews").select("*").eq("game", slug).single().then(({data})=> setR(data));
  },[slug]);

  if (!r) return <div className="wrap">Loading…</div>;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": { "@type":"VideoGame", "name": r.game },
    "reviewRating": { "@type":"Rating", "ratingValue": r.rating, "bestRating":"10" },
    "author": { "@type":"Person", "name": r.author_name || "GXB Staff" }
  };

  return (
    <div className="wrap" style={{ padding:24 }}>
      <Helmet>
        <title>{r.game} Review | GamexBuddy</title>
        <link rel="canonical" href={canonical(`/reviews/${slug}`)} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <h1>{r.game} Review — {r.rating}/10</h1>
      {r.pros?.length ? <ul>{r.pros.map((p:string,i:number)=><li key={i}>✅ {p}</li>)}</ul> : null}
      {r.cons?.length ? <ul>{r.cons.map((p:string,i:number)=><li key={i}>⚠️ {p}</li>)}</ul> : null}
      <div style={{ whiteSpace:"pre-wrap" }}>{r.body_mdx || r.body}</div>
    </div>
  );
}

