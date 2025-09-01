import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
const Index = lazy(() => import("./pages/Index"));
const Gta6Hub = lazy(() => import("./pages/Gta6Hub"));
const Gta6Layout = lazy(() => import("./pages/gta6/Gta6Layout"));
const Gta6Index = lazy(() => import("./pages/gta6/Index"));
const ReleaseDate = lazy(() => import("./pages/gta6/ReleaseDate"));
const Editions = lazy(() => import("./pages/gta6/Editions"));
const MapPage = lazy(() => import("./pages/gta6/Map"));
const Characters = lazy(() => import("./pages/gta6/Characters"));
const FAQs = lazy(() => import("./pages/gta6/FAQs"));
const MinecraftHub = lazy(() => import("./pages/MinecraftHub"));
const PubgHub = lazy(() => import("./pages/PubgHub"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PCHub = lazy(() => import("./pages/PCHub"));
const PlayStationHub = lazy(() => import("./pages/PlayStationHub"));
const XboxHub = lazy(() => import("./pages/XboxHub"));
const AndroidHub = lazy(() => import("./pages/AndroidHub"));
const IosHub = lazy(() => import("./pages/IosHub")); // Changed import from iOSHub to IosHub
const NotFound = lazy(() => import("./pages/NotFound"));
const GuideDetail = lazy(() => import("./pages/guides/GuideDetail"));
const GuidesIndex = lazy(() => import("./pages/guides/GuidesIndex"));
const NewsIndex = lazy(() => import("./pages/news/NewsIndex"));
const NewsTag = lazy(() => import("./pages/news/NewsTag"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div style={{padding:20}}>Loading…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gta6-hub" element={<Gta6Index />} />
            <Route path="/gta6" element={<Gta6Layout />}>
              <Route index element={<Gta6Index />} />
              <Route path="release-date" element={<ReleaseDate />} />
              <Route path="editions" element={<Editions />} />
              <Route path="map" element={<MapPage />} />
              <Route path="characters" element={<Characters />} />
              <Route path="faqs" element={<FAQs />} />
            </Route>
            <Route path="/minecraft-hub" element={<MinecraftHub />} />
            <Route path="/pubg-hub" element={<PubgHub />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pc-hub" element={<PCHub />} />
            <Route path="/playstation-hub" element={<PlayStationHub />} />
            <Route path="/xbox-hub" element={<XboxHub />} />
            <Route path="/android-hub" element={<AndroidHub />} />
            <Route path="/ios-hub" element={<IosHub />} /> {/* Changed element from iOSHub to IosHub */}
            <Route path="/news" element={<NewsIndex />} />
            <Route path="/news/tag/:tag" element={<NewsTag />} />
            <Route path="/guides" element={<GuidesIndex />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
