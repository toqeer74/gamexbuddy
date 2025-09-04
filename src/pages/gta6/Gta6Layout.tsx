import React from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import data from "@/content/gta6/news.json";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";

const tabs = [
  { to: "/gta6/release-date", label: "Release Date" },
  { to: "/gta6/editions", label: "Editions" },
  { to: "/gta6/map", label: "Map & Setting" },
  { to: "/gta6/characters", label: "Characters" },
  { to: "/gta6/faqs", label: "FAQs" },
];

const Gta6Layout: React.FC = () => {
  return (
    <div className="container py-8">
      <Helmet>
        <title>GTA 6 Hub | GameXBuddy</title>
        <link rel="canonical" href={canonical("/gta6")} />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"CollectionPage",
          "name":"GTA 6 Hub",
          "url": canonical("/gta6"),
          "mainEntity": {
            "@type":"ItemList",
            "itemListElement": (data as any[]).filter(n=>n.official).slice(0,10).map((n:any,idx:number)=>({
              "@type":"ListItem","position":idx+1,"url":n.url,"name":n.title
            }))
          }
        })}</script>
      </Helmet>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">GTA6 Hub</h1>
        <Link to="/" className="text-sm text-primary hover:underline">Back to Home</Link>
      </div>

      <Card className="bg-white/5 border-white/10 mb-6">
        <div className="flex flex-wrap gap-2 p-3">
          <NavLink
            to="/gta6"
            end
            className={({ isActive }) => `px-3 py-1.5 rounded-md text-sm ${isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-white/10"}`}
          >
            Overview
          </NavLink>
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `px-3 py-1.5 rounded-md text-sm ${isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-white/10"}`}
            >
              {t.label}
            </NavLink>
          ))}
        </div>
      </Card>

      <Outlet />
    </div>
  );
};

export default Gta6Layout;
