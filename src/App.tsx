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
import AboutPage from "./pages/AboutPage"; // Import the new AboutPage
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
            <Route path="/about" element={<AboutPage />} /> {/* Add the new AboutPage route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;