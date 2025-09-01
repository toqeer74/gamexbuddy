import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Gta6Hub from "./pages/Gta6Hub";
import MinecraftHub from "./pages/MinecraftHub";
import PubgHub from "./pages/PubgHub";
import CommunityPage from "./pages/CommunityPage";
import ToolsPage from "./pages/ToolsPage";
import AboutPage from "./pages/AboutPage";
import PCHub from "./pages/PCHub";
import PlayStationHub from "./pages/PlayStationHub";
import XboxHub from "./pages/XboxHub";
import AndroidHub from "./pages/AndroidHub";
import IosHub from "./pages/IosHub"; // Changed import from iOSHub to IosHub
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gta6-hub" element={<Gta6Hub />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;