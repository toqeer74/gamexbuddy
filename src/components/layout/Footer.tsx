import React from "react";
import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MessageSquare, Twitter, Send, Youtube } from "lucide-react"; // Import Youtube icon

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8">
      {/* Animated Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500
                      bg-[length:200%_auto] animate-synthwave-pulse"></div>

      <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold mb-2">GamexBuddy</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm font-medium text-center md:text-left">
          <div>
            <h3 className="font-bold text-primary mb-2">Explore Hubs</h3>
            <ul className="space-y-1">
              <li><Link to="/gta6-hub" className="hover:text-cyan-300 transition-colors">GTA6 Hub</Link></li>
              <li><Link to="/pc-hub" className="hover:text-cyan-300 transition-colors">PC Hub</Link></li>
              <li><Link to="/playstation-hub" className="hover:text-cyan-300 transition-colors">PlayStation Hub</Link></li>
              <li><Link to="/xbox-hub" className="hover:text-cyan-300 transition-colors">Xbox Hub</Link></li>
              <li><Link to="/android-hub" className="hover:text-cyan-300 transition-colors">Android Hub</Link></li>
              <li><Link to="/ios-hub" className="hover:text-cyan-300 transition-colors">iOS Hub</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-primary mb-2">Community</h3>
            <ul className="space-y-1">
              <li><Link to="/community" className="hover:text-purple-300 transition-colors">Forums</Link></li>
              <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">Discord</a></li>
              <li><a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">Telegram</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-primary mb-2">Resources</h3>
            <ul className="space-y-1">
              <li><Link to="/tools" className="hover:text-pink-300 transition-colors">Tools</Link></li>
              <li><a href="#" className="hover:text-pink-300 transition-colors">Guides</a></li> {/* Placeholder */}
              <li><a href="#" className="hover:text-pink-300 transition-colors">Blog</a></li> {/* Placeholder */}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-primary mb-2">About</h3>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:text-yellow-300 transition-colors">About GamexBuddy</Link></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Contact</a></li> {/* Placeholder */}
            </ul>
          </div>
        </div>

        <div className="flex space-x-6 mt-6 md:mt-0">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.7)] hover:drop-shadow-[0_0_15px_rgba(59,130,246,1)]">
            <MessageSquare size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] hover:drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
            <Twitter size={24} />
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors drop-shadow-[0_0_8px_rgba(14,165,233,0.7)] hover:drop-shadow-[0_0_15px_rgba(14,165,233,1)]">
            <Send size={24} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.7)] hover:drop-shadow-[0_0_15px_rgba(220,38,38,1)]">
            <Youtube size={24} />
          </a>
        </div>
      </div>
      <MadeWithDyad />
    </footer>
  );
};

export default Footer;