import React from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import data from "@/content/gta6/news.json";
import NewsFeed from "@/components/NewsFeed";
import "@/styles/home.css";

export default function NewsIndex(){
  const items = (data as any[]).slice(0, 10);
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"CollectionPage",
    "name":"Gaming News – GameXBuddy",
    "url": canonical("/news"),
    "isPartOf": canonical("/"),
    "mainEntity": {
      "@type":"ItemList",
      "itemListElement": items.map((n:any, idx:number) => ({
        "@type":"ListItem",
        "position": idx + 1,
        "url": n.url,
        "name": n.title
      }))
    }
  } as const;
  return (
    <>
      <Helmet>
        <title>News | GameXBuddy</title>
        <link rel="canonical" href={canonical("/news")} />
        <meta name="description" content="Official and curated gaming news: GTA 6, Minecraft, PUBG, and more." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <NewsFeed />
    </>
  );
}

