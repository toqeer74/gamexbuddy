import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { canonical } from "@/lib/seo";
import data from "@/content/gta6/news.json";
import NewsFeed from "@/components/NewsFeed";
import "@/styles/home.css";

export default function NewsTag(){
  const { tag = "" } = useParams<{ tag: string }>();
  const tagSlug = String(tag).toLowerCase();
  const items = (data as any[])
    .filter(n => (n.tags||[]).map((t:string)=>String(t).toLowerCase()).includes(tagSlug))
    .slice(0, 10);

  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"CollectionPage",
    "name": `${String(tagSlug).toUpperCase()} News – GameXBuddy`,
    "url": canonical(`/news/tag/${encodeURIComponent(tagSlug)}`),
    "mainEntity": {
      "@type":"ItemList",
      "itemListElement": items.map((n:any, idx:number) => ({
        "@type":"ListItem", "position": idx + 1, "url": n.url, "name": n.title
      }))
    }
  } as const;

  return (
    <>
      <Helmet>
        <title>News: {tagSlug} | GameXBuddy</title>
        <link rel="canonical" href={canonical(`/news/tag/${encodeURIComponent(tagSlug)}`)} />
        <meta name="description" content={`Latest ${tagSlug} updates, trailers, and official announcements.`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <NewsFeed />
    </>
  );
}

