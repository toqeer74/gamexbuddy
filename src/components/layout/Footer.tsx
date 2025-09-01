import React from "react";
import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MessageSquare, Twitter, Send } from "lucide-react"; // Changed Discord to MessageSquare, Telegram to Send

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold mb-2">GamexBuddy</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
          <Link to="/gta6-hub" className="hover:text-primary transition-colors">GTA6 Hub</Link>
          <Link to="/minecraft-hub" className="hover:text-primary transition-colors">Minecraft</Link>
          <Link to="/pubg-hub" className="hover:text-primary transition-colors">PUBG</Link>
          <Link to="/community" className="hover:text-primary transition-colors">Community</Link>
          <Link to="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>

        <div className="flex space-x-6">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]">
            <MessageSquare size={24} /> {/* Changed to MessageSquare */}
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
            <Twitter size={24} />
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors drop-shadow-[0_0_8px_rgba(14,165,233,0.7)]">
            <Send size={24} /> {/* Changed to Send */}
          </a>
        </div>
      </div>
      <MadeWithDyad />
    </footer>
  );
};

export default Footer;