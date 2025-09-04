import React from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import SmartImage from "@/components/SmartImage";
import { useParams, Link } from "react-router-dom";
import mirrors from "@/content/mirrors.json";

type Item = { slug:string; title:string; date:string; url:string; excerpt:string; image?:string };

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function NewsMirror(){
  const { slug } = useParams();
  const all = (mirrors as Item[]);
  const item = all.find(i => i.slug === slug);
  if(!item){
    return (
      <div className="wrap" style={{ padding: '40px 0' }}>
        <h1 className="h2">Article not found</h1>
        <p><Link to="/news">Back to news</Link></p>
      </div>
    );
  }
  const articleLd = {
    "@context":"https://schema.org",
    "@type":"Article",
    "headline": item.title,
    "description": item.excerpt,
    "image": [item.image || canonical("/og-default.png")],
    "datePublished": item.date,
    "author": { "@type":"Organization", "name":"Rockstar Games" },
    "mainEntityOfPage": item.url
  } as const;

  return (
    <section className="section">
      <div className="wrap">
        <Helmet>
          <title>{item.title} | GTA 6 News Mirror</title>
          <link rel="canonical" href={canonical(`/gta6/news/${item.slug}`)} />
          <meta name="description" content={item.excerpt} />
          <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        </Helmet>
        <SeoBreadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
          { name: item.title, path: `/gta6/news/${item.slug}` }
        ]} />
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, opacity: .8, marginBottom: 10 }}>
          <Link to="/">Home</Link> / <Link to="/news">News</Link> / <span>{item.title}</span>
        </nav>
        <h1 className="h2">{item.title}</h1>
        <div style={{opacity:.8}}><time>{fmt(item.date)}</time></div>
        {item.image && <SmartImage src={item.image} alt={item.title} style={{width:'100%', maxHeight:360, objectFit:'cover', borderRadius:12, margin:'12px 0'}}/>}
        <p style={{ marginTop: 12 }}>{item.excerpt}</p>
        <div className="gx-actions" style={{paddingTop:12}}>
          <a className="gx-btn gx-btn--soft" href={item.url} target="_blank" rel="noopener noreferrer">Read original source</a>
        </div>
      </div>
    </section>
  );
}
