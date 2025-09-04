import React from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";

export default function SeoBreadcrumbs({
  items
}: { items: { name: string; path: string }[] }) {
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement": items.map((it, idx) => ({
      "@type":"ListItem",
      "position": idx + 1,
      "name": it.name,
      "item": canonical(it.path)
    }))
  } as const;
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

