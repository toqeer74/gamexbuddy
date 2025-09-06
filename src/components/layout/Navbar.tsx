import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X, Search, Bell, MessageCircle, User, Youtube, Facebook, Instagram, Twitch, Twitter, Gamepad2, Trophy, Zap, Users, DollarSign, Cpu, Monitor, Gamepad, Smartphone, Apple, PlayCircle } from "lucide-react";
import AuthWidget from "@/components/AuthWidget";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = (elementId: string) => setHoveredElement(elementId);
  const handleMouseLeave = () => setHoveredElement(null);

  // Navigation links
  const navLinks = [
    { to: "/games-database", label: "Games", icon: "🎮" },
    { to: "/gta6", label: "GTA6 Hub", icon: "🎯" },
    { to: "/news-feed", label: "News", icon: "📰" },
    { to: "/community", label: "Community", icon: "👥" },
  ];

  // Social icons with branding colors
  const socialIcons = [
    { icon: Youtube, href: "https://youtube.com/@gamexbuddy", color: "#FF0000", label: "YouTube" },
    { icon: Twitter, href: "https://twitter.com/gamexbuddy", color: "#1DA1F2", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/gamexbuddy", color: "#1877F2", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/gamexbuddy", color: "#E4405F", label: "Instagram" },
    { icon: Twitch, href: "https://twitch.tv/gamexbuddy", color: "#9146FF", label: "Twitch" },
  ];

  // Simple SearchBox component
  const SearchBox = () => (
    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
      <Search className="h-4 w-4" />
    </Button>
  );

  // Simple XPBadge component
  const XPBadge = () => (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30">
      <span className="text-xs font-medium text-cyan-300">XP: 1,250</span>
      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
    </div>
  );

  const mainNavLinks = [
    { to: "/games-database", label: "Games", icon: Gamepad2 },
    { to: "/gta6", label: "GTA6 Hub", icon: Trophy },
    { to: "/news-feed", label: "News", icon: Zap },
  ];

  const gamesDropdown = [
    { to: "/games-database", label: "Games Database", icon: Gamepad2, desc: "Browse catalog" },
    { to: "/deals-database", label: "Game Deals", icon: DollarSign, desc: "Best prices" },
    { to: "/marketplace", label: "Marketplace", icon: Cpu, desc: "Digital assets" },
  ];

  const communityDropdown = [
    { to: "/community", label: "Community", icon: Users, desc: "Forums & chat" },
    { to: "/clans", label: "Clans", icon: Trophy, desc: "Gaming groups" },
    { to: "/leaderboards", label: "Leaderboards", icon: Trophy, desc: "Rankings" },
  ];

  const esportsDropdown = [
    { to: "/tournaments", label: "Tournaments", icon: Trophy, desc: "Competitions" },
    { to: "/streams", label: "Live Streams", icon: PlayCircle, desc: "Watch gamers" },
    { to: "/ai-tools", label: "AI Tools", icon: Zap, desc: "Smart assistant" },
  ];

  const platformNavLinks = [
    { to: "/pc-hub", label: "PC Hub", icon: Monitor },
    { to: "/playstation-hub", label: "PlayStation Hub", icon: Gamepad },
    { to: "/xbox-hub", label: "Xbox Hub", icon: Gamepad },
    { to: "/android-hub", label: "Android Hub", icon: Smartphone },
    { to: "/ios-hub", label: "iOS Hub", icon: Apple },
  ];

  const [trailPositions, setTrailPositions] = useState<Array<{x: number, y: number, id: string}>>([]);

  const createTrail = (x: number, y: number, id: string) => {
    const trailId = `${id}-${Date.now()}`;
    const newTrail = { x, y, id: trailId };
    setTrailPositions(prev => [...prev, newTrail]);

    // Remove trail after animation
    setTimeout(() => {
      setTrailPositions(prev => prev.filter(trail => trail.id !== trailId));
    }, 1000);
  };

  const EnhancedNavLink = ({ to, children, className = "", onClick }: { to: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-all duration-300
                  hover:drop-shadow-[0_0_8px_rgba(0,224,255,0.6)] ${className}`}
      onClick={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        createTrail(rect.left + rect.width / 2, rect.top + rect.height / 2, `nav-${to}`);
        onClick?.();
      }}
    >
      {children}
      <div className="absolute inset-0 bg-cyan-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md blur-sm"></div>
    </Link>
  );

  return (
    <>
      {/* Trail Animation Container */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        {trailPositions.map((trail) => (
          <div
            key={trail.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
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
          @keyframes trail {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(4); }
          }
          .dropdown-trigger:hover .dropdown-icon {
            transform: rotate(180deg);
            color: #00f5ff;
          }
          .nav-glass {
            background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.6) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .neon-border {
            position: relative;
          }
          .neon-border::before {
            content: '';
            position: absolute;
            inset: 0;
            padding: 1px;
            background: linear-gradient(45deg, #ff58b3, #00f5ff, #8f7dff, #ff58b3);
            background-size: 400% 400%;
            animation: gradientShift 3s ease-in-out infinite;
            border-radius: 8px;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
          }
        `}
      </style>

      <header className="sticky top-0 z-50 w-full nav-glass supports-[backdrop-filter]:bg-background/60 border-b border-white/10">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 relative group">
            <img
              src="/Gamexbuddy-logo-v2-transparent.png"
              alt="GameXBuddy"
              width={180}
              height={42}
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,224,255,0.5)] border border-cyan-400/20 rounded-md p-1"
              style={{ objectFit: "contain" }}
              onError={(e) => {
                console.log('Logo failed to load:', e.currentTarget.src);
              }}
            />
            <div className="absolute -inset-2 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-lg"></div>
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center space-x-1">
            {/* Games Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white
                                               hover:drop-shadow-[0_0_8px_rgba(0,224,255,0.6)] transition-all duration-300
                                               group px-3 py-2">
                  <Gamepad2 className="w-4 h-4" />
                  Games
                  <ChevronDown className="ml-1 h-3 w-3 dropdown-icon transition-transform duration-300" />
                  <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900/95 border-white/20 text-white backdrop-blur-xl">
                {gamesDropdown.map((item, index) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors relative group">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-white/60">{item.desc}</div>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white
                                               hover:drop-shadow-[0_0_8px_rgba(0,224,255,0.6)] transition-all duration-300
                                               group px-3 py-2">
                  <Users className="w-4 h-4" />
                  Community
                  <ChevronDown className="ml-1 h-3 w-3 dropdown-icon transition-transform duration-300" />
                  <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900/95 border-white/20 text-white backdrop-blur-xl">
                {communityDropdown.map((item, index) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-white/60">{item.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Esports Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white
                                               hover:drop-shadow-[0_0_8px_rgba(0,224,255,0.6)] transition-all duration-300
                                               group px-3 py-2">
                  <Trophy className="w-4 h-4" />
                  Esports
                  <ChevronDown className="ml-1 h-3 w-3 dropdown-icon transition-transform duration-300" />
                  <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900/95 border-white/20 text-white backdrop-blur-xl">
                {esportsDropdown.map((item, index) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors">
                      <item.icon className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-white/60">{item.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Navigation Links */}
            {mainNavLinks.map((link) => (
              <EnhancedNavLink key={link.to} to={link.to} className="relative">
                <div className="flex items-center gap-1.5">
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </div>
              </EnhancedNavLink>
            ))}

            {/* Premium CTA */}
            <Link to="/premium" className="ml-4">
              <Button variant="ghost" className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30
                                               text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/30 transition-all duration-300
                                               neon-border relative overflow-hidden group">
                <span className="relative z-10 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Go Premium
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </Link>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            <SearchBox />
            <XPBadge />
            <AuthWidget />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900/95 border-white/20 text-white backdrop-blur-xl w-80">
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Mobile Games Section */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5" />
                      Games
                    </h3>
                    {gamesDropdown.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-white/60">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-3">
                    <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Community
                    </h3>
                    {communityDropdown.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-white/60">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <XPBadge />
                    <SearchBox />
                    <AuthWidget />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
