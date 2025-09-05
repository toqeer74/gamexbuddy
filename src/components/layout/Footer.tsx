// src/components/layout/Footer.tsx
import { Youtube, Facebook, Instagram, Twitch, Twitter, Github } from "lucide-react";

// If you have a shared Logo component from the header, use that instead:
// import Logo from "@/components/branding/Logo";

const socials = [
  { name: "YouTube",  href: "https://youtube.com/@gamexbuddy",  color: "#FF0000", Icon: Youtube },
  { name: "TikTok",   href: "https://tiktok.com/@gamexbuddy",   color: "#000000" }, // fallback letter
  { name: "Facebook", href: "https://facebook.com/gamexbuddy",  color: "#1877F2", Icon: Facebook },
  { name: "Instagram",href: "https://instagram.com/gamexbuddy", color: "#E1306C", Icon: Instagram },
  { name: "Reddit",   href: "https://reddit.com/r/gamexbuddy",  color: "#FF4500" },
  { name: "X",        href: "https://x.com/gamexbuddy",         color: "#000000", Icon: Twitter },
  { name: "Twitch",   href: "https://twitch.tv/gamexbuddy",     color: "#9146FF", Icon: Twitch },
  { name: "GitHub",   href: "https://github.com/toqeer74",      color: "#ffffff", Icon: Github },
];

export default function Footer() {
  return (
    <footer className="gx-footer mt-16">
      {/* moving neon rail (subtle) */}
      <div className="gx-footer-rail" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 3 columns */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            {/* Use your exact header logo here */}
            {/* <Logo className="h-10" /> */}
            <img src="/Gamexbuddy-logo-v2-neon-transparent.png" alt="GameXBuddy" className="h-10 object-contain" />
            <p className="text-sm text-white/75 max-w-sm">
              The ultimate gaming hub with guides, deals, earning modules, and community tools.
            </p>

            <a href="/newsletter" className="inline-flex gx-btn px-5 py-2 rounded-xl">
              Join Newsletter
            </a>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-lg font-extrabold mb-3">Explore</h4>
            <ul className="grid gap-2 text-sm">
              <li><a className="gx-link" href="/gta6">GTA6 Hub</a></li>
              <li><a className="gx-link" href="/earn">Earn Points</a></li>
              <li><a className="gx-link" href="/news">Gaming News</a></li>
              <li><a className="gx-link" href="/community">Community</a></li>
              <li><a className="gx-link" href="/guides">Guides & Tips</a></li>
            </ul>
          </div>

          {/* Col 3: Tools + Socials */}
          <div>
            <h4 className="text-lg font-extrabold mb-3">Tools</h4>
            <ul className="grid gap-2 text-sm mb-5">
              <li><a className="gx-link" href="/tools/price-tracker">Price Tracker</a></li>
              <li><a className="gx-link" href="/tools/pc-requirements">PC Requirements</a></li>
              <li><a className="gx-link" href="/deals">Game Deals</a></li>
              <li><a className="gx-link" href="/meme-wall">Meme Wall</a></li>
              <li><a className="gx-link" href="/wallpapers">Wallpapers</a></li>
            </ul>

            <h4 className="text-lg font-extrabold mb-3">Connect</h4>
            <div className="flex flex-wrap items-center gap-3">
              {socials.map(({ name, href, color, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="gx-social"
                  style={{ ["--_brand" as any]: color }}
                  rel="noopener"
                  target="_blank"
                  title={name}
                >
                  {Icon ? <Icon size={18}/> : <span className="font-bold text-xs">{name[0]}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* legal row */}
        <div className="gx-footer-legal mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
          <span>© {new Date().getFullYear()} GameXBuddy. All rights reserved.</span>
          <nav className="flex items-center gap-4">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

