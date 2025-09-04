import React, { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import PCCheckerCard from "@/components/PCCheckerCard";
import QuizStarter from "@/components/QuizStarter";
import WallpaperSkeleton from "@/components/WallpaperSkeleton";
const WallpaperGrid = lazy(() => import("@/components/WallpaperGrid"));
import AdSlot from "@/components/ads/AdSlot";
import BuyPlusButton from "@/components/billing/BuyPlusButton";
import { sb } from "@/lib/supabase";

export default function ToolsPage(){
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getUser();
      const uid = data.user?.id;
      if (uid) {
        setUser({ id: uid, email: (data.user as any)?.email });
        const { data: prof } = await sb.from("profiles").select("is_premium").eq("id", uid).single();
        setIsPremium(!!prof?.is_premium);
      }
    })();
  }, []);
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"WebApplication",
    "name":"GameXBuddy Tools",
    "url": canonical("/tools"),
    "applicationCategory":"EntertainmentApplication",
    "operatingSystem":"All",
    "featureList":[
      "PC spec checker", "Gaming quizzes", "4K wallpaper downloads"
    ]
  } as const;
  return (
    <div className="wrap" style={{padding:"48px 20px"}}>
      <Helmet>
        <title>Tools – PC Checker, Quiz, Wallpapers | GameXBuddy</title>
        <link rel="canonical" href={canonical("/tools")} />
        <meta name="description" content="Handy gamer tools: PC requirements checker, fun quizzes, and wallpaper vault." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {!isPremium && (
        <div style={{ marginBottom: 16 }}>
          <AdSlot placement="tools_top" size="728x90" />
        </div>
      )}
      <h1 className="h2">Utility Tools</h1>
      <div style={{display:"grid",gap:18, gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
        <PCCheckerCard/><QuizStarter/>
        <Suspense fallback={<WallpaperSkeleton />}>
          <WallpaperGrid/>
        </Suspense>
        {isPremium ? (
          <div className="card-glass" style={{ padding:16 }}>🎁 Premium PC Checker Pro (placeholder)</div>
        ) : (
          <div className="card-glass" style={{ padding:16, display:"grid", gap:8 }}>
            <div>Unlock ad-free browsing and premium tools with <strong>GamexBuddy Plus</strong>.</div>
            <BuyPlusButton userId={user?.id} email={user?.email} />
          </div>
        )}
      </div>
    </div>
  );
}
