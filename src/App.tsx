import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import Analytics from "@/components/Analytics";
import RouteHandler from "@/components/RouteHandler";
const Index = lazy(() => import("./pages/Index"));
const Gta6Hub = lazy(() => import("./pages/Gta6Hub"));
const Gta6Layout = lazy(() => import("./pages/gta6/Gta6Layout"));
const Gta6Index = lazy(() => import("./pages/gta6/Index"));
const NewsMirror = lazy(() => import("./pages/gta6/NewsMirror"));
const ReleaseDate = lazy(() => import("./pages/gta6/ReleaseDate"));
const Editions = lazy(() => import("./pages/gta6/Editions"));
const MapPage = lazy(() => import("./pages/gta6/Map"));
const Characters = lazy(() => import("./pages/gta6/Characters"));
const FAQs = lazy(() => import("./pages/gta6/FAQs"));
const MinecraftHub = lazy(() => import("./pages/MinecraftHub"));
const PubgHub = lazy(() => import("./pages/PubgHub"));
const FortniteHub = lazy(() => import("./pages/FortniteHub"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const PriceTracker = lazy(() => import("./pages/tools/PriceTracker"));
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
const NewsIndexDb = lazy(() => import("./pages/news/NewsIndexDb"));
const NewsTag = lazy(() => import("./pages/news/NewsTag"));
const NewsDetail = lazy(() => import("./pages/news/NewsDetail"));
const GuideMDXDetail = lazy(() => import("./pages/guides/GuideMDXDetail"));
const ModerationQueue = lazy(() => import("./pages/admin/ModerationQueue"));
const PlusSuccess = lazy(() => import("./pages/PlusSuccess"));
const Settings = lazy(() => import("./pages/Settings"));
const ReviewDetail = lazy(() => import("./pages/reviews/ReviewDetail"));
const Search = lazy(() => import("./pages/Search"));
const Editor = lazy(() => import("./pages/admin/Editor"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
import NewsFeedSkeleton from "@/components/NewsFeedSkeleton";
import GuideSkeleton from "@/components/GuideSkeleton";
import { USE_DB_NEWS } from "@/config/flags";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Analytics />
        <Layout>
          <Suspense fallback={<div style={{padding:20}}>Loading…</div>}>
          <RouteHandler />
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
              <Route path="news/:slug" element={<NewsMirror />} />
            </Route>
            <Route path="/minecraft-hub" element={<MinecraftHub />} />
            <Route path="/pubg-hub" element={<PubgHub />} />
            <Route path="/fortnite-hub" element={<FortniteHub />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/price-tracker" element={<PriceTracker />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/pc-hub" element={<PCHub />} />
            <Route path="/playstation-hub" element={<PlayStationHub />} />
            <Route path="/xbox-hub" element={<XboxHub />} />
            <Route path="/android-hub" element={<AndroidHub />} />
            <Route path="/ios-hub" element={<IosHub />} /> {/* Changed element from iOSHub to IosHub */}
            <Route path="/news" element={<Suspense fallback={<NewsFeedSkeleton />}>{USE_DB_NEWS ? <NewsIndexDb /> : <NewsIndex />}</Suspense>} />
            <Route path="/news/:slug" element={<Suspense fallback={<NewsFeedSkeleton />}><NewsDetail /></Suspense>} />
            <Route path="/news/tag/:tag" element={<Suspense fallback={<NewsFeedSkeleton />}><NewsTag /></Suspense>} />
            <Route path="/guides" element={<Suspense fallback={<GuideSkeleton />}><GuidesIndex /></Suspense>} />
            <Route path="/guides/:slug" element={<Suspense fallback={<GuideSkeleton />}><GuideMDXDetail /></Suspense>} />
            <Route path="/guides/json/:slug" element={<Suspense fallback={<GuideSkeleton />}><GuideDetail /></Suspense>} />
            <Route path="/guides/mdx/:slug" element={<Suspense fallback={<GuideSkeleton />}><GuideMDXDetail /></Suspense>} />
            <Route path="/admin/moderation" element={<ModerationQueue />} />
            <Route path="/admin/editor" element={<Editor />} />
            <Route path="/plus/success" element={<PlusSuccess />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reviews/:slug" element={<ReviewDetail />} />
            <Route path="/u/:username" element={<ProfilePage />} />
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
