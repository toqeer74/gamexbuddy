import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Youtube, Facebook, Instagram, Twitch, Twitter, Github, Mail, Gamepad2, Trophy, Users, Zap, DollarSign, PlayCircle, Heart } from "lucide-react";

const socials = [
  { name: "YouTube", href: "https://youtube.com/@gamexbuddy", color: "#FF0000", Icon: Youtube },
  { name: "TikTok", href: "https://tiktok.com/@gamexbuddy", color: "#000000" },
  { name: "Facebook", href: "https://facebook.com/gamexbuddy", color: "#1877F2", Icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/gamexbuddy", color: "#E1306C", Icon: Instagram },
  { name: "Reddit", href: "https://reddit.com/r/gamexbuddy", color: "#FF4500" },
  { name: "X", href: "https://x.com/gamexbuddy", color: "#ffffff", Icon: Twitter },
  { name: "Twitch", href: "https://twitch.tv/gamexbuddy", color: "#9146FF", Icon: Twitch },
  { name: "GitHub", href: "https://github.com/toqeer74", color: "#ffffff", Icon: Github },
];

const footerLinks = {
  games: [
    { to: "/games-database", label: "Game Database", icon: Gamepad2 },
    { to: "/gta6", label: "GTA 6 Hub", icon: Trophy },
    { to: "/deals-database", label: "Game Deals", icon: DollarSign },
    { to: "/marketplace", label: "Marketplace", icon: DollarSign },
  ],
  community: [
    { to: "/community", label: "Community", icon: Users },
    { to: "/clans", label: "Gaming Clans", icon: Users },
    { to: "/leaderboards", label: "Leaderboards", icon: Trophy },
    { to: "/forum", label: "Forum", icon: Users },
  ],
  esports: [
    { to: "/tournaments", label: "Tournaments", icon: Trophy },
    { to: "/streams", label: "Live Streams", icon: PlayCircle },
    { to: "/ai-tools", label: "AI Tools", icon: Zap },
  ],
  tools: [
    { to: "/news-feed", label: "Gaming News", icon: Zap },
    { to: "/earn", label: "Earn Points", icon: DollarSign },
    { to: "/premium", label: "Go Premium", icon: Zap },
  ]
};

export default function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trailPositions, setTrailPositions] = useState<Array<{x: number, y: number, id: string}>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const createTrail = (x: number, y: number, id: string) => {
    const trailId = `${id}-${Date.now()}`;
    const newTrail = { x, y, id: trailId };
    setTrailPositions(prev => [...prev, newTrail]);

    // Remove trail after animation
    setTimeout(() => {
      setTrailPositions(prev => prev.filter(trail => trail.id !== trailId));
    }, 1000);
  };

  return (
    <>
      {/* Trail Animation Container */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        {trailPositions.map((trail) => (
          <div
            key={trail.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"
            style={{
              left: trail.x,
              top: trail.y,
              animation: 'trail 1s ease-out forwards'
            }}
          />
        ))}
      </div>

      <style>
        {`
          .footer-rail {
            position: relative;
            height: 1px;
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(255, 88, 179, 0.3) 20%,
              rgba(0, 245, 255, 0.6) 50%,
              rgba(143, 125, 255, 0.3) 80%,
              transparent 100%
            );
            overflow: hidden;
          }

          .footer-rail::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(255, 88, 179, 0.8) 20%,
              rgba(0, 245, 255, 1) 50%,
              rgba(143, 125, 255, 0.8) 80%,
              transparent 100%
            );
            animation: footerShine 3s ease-in-out infinite;
          }

          @keyframes footerShine {
            0%, 100% { left: -100%; }
            50% { left: 100%; }
          }

          .social-glow {
            transition: all 0.3s ease;
            filter: drop-shadow(0 0 8px rgba(88, 224, 255, 0.4));
          }

          .social-glow:hover {
            transform: scale(1.1);
            filter: drop-shadow(0 0 16px currentColor);
          }

          .footer-link {
            position: relative;
            transition: all 0.3s ease;
          }

          .footer-link:hover {
            color: #00f5ff !important;
            transform: translateX(4px);
          }

          .footer-link::before {
            content: '';
            position: absolute;
            left: -12px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #ff58b3, #00f5ff);
            transition: width 0.3s ease;
          }

          .footer-link:hover::before {
            width: 8px;
          }

          @keyframes trail {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(4); }
          }
        `}
      </style>

      <footer className="relative mt-20 overflow-hidden">
        {/* Animated Neon Rail */}
        <div className="footer-rail"></div>

        <div className="relative bg-gradient-to-b from-gray-900/80 to-black/95 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
              {/* Brand Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="space-y-4">
                  <Link to="/" className="inline-block">
                    <img
                      src="/Gamexbuddy-logo-v2-transparent.png"
                      alt="GameXBuddy"
                      className="h-12 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300
                               drop-shadow-[0_0_12px_rgba(0,224,255,0.3)]"
                    />
                  </Link>
                  <p className="text-white/80 leading-relaxed max-w-sm">
                    The ultimate gaming platform with comprehensive game database, live streams,
                    community features, and AI-powered gaming assistance.
                  </p>
                </div>

                {/* Newsletter Signup */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    Stay Updated
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50
                               focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                    />
                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium
                                   hover:from-cyan-400 hover:to-blue-400 transform hover:scale-105 transition-all duration-300
                                   shadow-lg hover:shadow-cyan-500/25">
                      Join
                    </button>
                  </div>
                </div>
              </div>

              {/* Games Column */}
              <div className="space-y-6">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  Games
                </h4>
                <ul className="space-y-3">
                  {footerLinks.games.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer-link flex items-center gap-2 text-white/70 hover:text-cyan-400">
                        <link.icon className="w-4 h-4 text-cyan-400/60" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Column */}
              <div className="space-y-6">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Community
                </h4>
                <ul className="space-y-3">
                  {footerLinks.community.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer-link flex items-center gap-2 text-white/70 hover:text-cyan-400">
                        <link.icon className="w-4 h-4 text-cyan-400/60" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-cyan-400" />
                    Esports
                  </h4>
                  <ul className="space-y-3 mt-3">
                    {footerLinks.esports.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className="footer-link flex items-center gap-2 text-white/70 hover:text-cyan-400">
                          <link.icon className="w-4 h-4 text-cyan-400/60" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tools Column */}
              <div className="space-y-6">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Tools & Features
                </h4>
                <ul className="space-y-3">
                  {footerLinks.tools.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer-link flex items-center gap-2 text-white/70 hover:text-cyan-400">
                        <link.icon className="w-4 h-4 text-cyan-400/60" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Social Media */}
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Follow Us
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {socials.map(({ name, href, color, Icon }) => (
                      <a
                        key={name}
                        href={href}
                        aria-label={name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-glow group flex items-center justify-center w-12 h-12 rounded-full
                                 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20
                                 hover:border-current hover:bg-current/10 transition-all duration-300
                                 shadow-lg hover:shadow-current/25 relative overflow-hidden"
                        style={{
                          color,
                          filter: `drop-shadow(0 0 8px ${color}40)`,
                        }}
                        onMouseEnter={(e) => {
                          setHoveredSocial(name);
                          const rect = e.currentTarget.getBoundingClientRect();
                          createTrail(rect.left + rect.width / 2, rect.top + rect.height / 2, `social-${name}`);
                        }}
                        onMouseLeave={() => setHoveredSocial(null)}
                        title={name}
                      >
                        {/* Neon glow effect */}
                        <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20
                                      transition-opacity duration-300 blur-sm scale-150"></div>

                        {Icon ? (
                          <Icon size={20} className="group-hover:scale-110 transition-transform duration-300 relative z-10" />
                        ) : (
                          <span className="font-bold text-sm group-hover:scale-110 transition-transform duration-300 relative z-10">
                            {name[0]}
                          </span>
                        )}

                        {/* Individual brand neon animation */}
                        <style>
                          {`
                            .social-glow:hover {
                              animation: neonPulse${name.replace(/[^a-zA-Z]/g, '')} 1.5s ease-in-out infinite;
                            }
                            @keyframes neonPulse${name.replace(/[^a-zA-Z]/g, '')} {
                              0%, 100% { box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor; }
                              50% { box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor; }
                            }
                          `}
                        </style>

                        {/* Tooltip */}
                        {hoveredSocial === name && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                                        px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap z-20">
                            {name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2
                                          border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-white/60 text-sm">
                  © {new Date().getFullYear()} GameXBuddy. Made with ❤️ for gamers worldwide.
                </div>

                <nav className="flex flex-wrap items-center gap-6 text-sm">
                  <Link to="/about" className="text-white/60 hover:text-cyan-400 transition-colors duration-300">
                    About
                  </Link>
                  <Link to="/privacy" className="text-white/60 hover:text-cyan-400 transition-colors duration-300">
                    Privacy
                  </Link>
                  <Link to="/terms" className="text-white/60 hover:text-cyan-400 transition-colors duration-300">
                    Terms
                  </Link>
                  <Link to="/contact" className="text-white/60 hover:text-cyan-400 transition-colors duration-300">
                    Contact
                  </Link>
                  <Link to="/sitemap" className="text-white/60 hover:text-cyan-400 transition-colors duration-300">
                    Sitemap
                  </Link>
                </nav>
              </div>

              {/* Fun Stats */}
              <div className="mt-8 flex flex-wrap justify-center gap-8 text-center">
                <div className="text-white/40">
                  <div className="text-sm font-medium">Games Available</div>
                  <div className="text-lg font-bold text-cyan-400">500K+</div>
                </div>
                <div className="text-white/40">
                  <div className="text-sm font-medium">Active Players</div>
                  <div className="text-lg font-bold text-cyan-400">10K+</div>
                </div>
                <div className="text-white/40">
                  <div className="text-sm font-medium">Tournaments</div>
                  <div className="text-lg font-bold text-cyan-400">50+</div>
                </div>
                <div className="text-white/40">
                  <div className="text-sm font-medium">Countries</div>
                  <div className="text-lg font-bold text-cyan-400">120+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

