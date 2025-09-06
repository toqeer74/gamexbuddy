import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ParticleBackground from "../ui/ParticleBackground";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <div className="flex min-h-screen flex-col relative">
        <ParticleBackground />
        <Navbar />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Layout;
