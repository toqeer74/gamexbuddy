import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Gamepad2, ChevronDown, Monitor, Gamepad, Smartphone, Apple } from "lucide-react";
import AuthWidget from "@/components/AuthWidget";
import SearchBox from "@/components/SearchBox";

const Navbar = () => {
  const neonHoverClasses = "hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] transition-all duration-300";
  const iconNeonClasses = "group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] transition-all duration-300";
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(()=>{ setOpen(false); }, [loc.pathname]);
  const isActive = (to:string) => loc.pathname === to;

  const mainNavLinks = [
    { to: "/gta6", label: "GTA6 Hub" },
    { to: "/news", label: "News" },
    { to: "/guides", label: "Guides" },
  ];

  const platformNavLinks = [
    { to: "/pc-hub", label: "PC Hub", icon: Monitor },
    { to: "/playstation-hub", label: "PlayStation Hub", icon: Gamepad },
    { to: "/xbox-hub", label: "Xbox Hub", icon: Gamepad },
    { to: "/android-hub", label: "Android Hub", icon: Smartphone },
    { to: "/ios-hub", label: "iOS Hub", icon: Apple },
  ];

  const secondaryNavLinks = [
    { to: "/community", label: "Community" },
    { to: "/tools", label: "Tools" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src="/Gamexbuddy-logo-v2-neon-transparent.png" alt="GamexBuddy" width={220} height={52} style={{ objectFit: "contain" }} />
        </a>
        <nav className="hidden md:flex items-center space-x-4">
          {mainNavLinks.map(i => (
            <Link key={i.to} to={i.to} className={`navlink text-sm font-medium text-white ${neonHoverClasses} ${isActive(i.to) ? 'navlink--active' : ''}`}>{i.label}</Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center gap-1 text-sm font-medium text-white ${neonHoverClasses} group`}>
                Platforms <ChevronDown className={`ml-1 h-4 w-4 ${iconNeonClasses}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-gray-800 border-white/20 text-white">
              {platformNavLinks.map(i => (
                <DropdownMenuItem key={i.to} asChild>
                  <Link to={i.to} className={`flex items-center gap-2 ${neonHoverClasses}`}>
                    <i.icon className="h-4 w-4" /> {i.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {secondaryNavLinks.map(i => (
            <Link key={i.to} to={i.to} className={`navlink text-sm font-medium text-white ${neonHoverClasses} ${isActive(i.to) ? 'navlink--active' : ''}`}>{i.label}</Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <SearchBox />
          <AuthWidget />
        </div>
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-white/10 text-white">
              <nav className="flex flex-col space-y-4 pt-6">
                {mainNavLinks.map(i => (
                  <Link key={i.to} to={i.to} className={`text-lg font-medium ${neonHoverClasses}`} onClick={()=>setOpen(false)}>{i.label}</Link>
                ))}
                <div className="flex flex-col space-y-2 pl-4">
                  <span className="text-lg font-medium text-muted-foreground">Platforms</span>
                  {platformNavLinks.map(i => (
                    <Link key={i.to} to={i.to} className={`text-base font-medium ${neonHoverClasses} pl-2`} onClick={()=>setOpen(false)}>
                      {i.label}
                    </Link>
                  ))}
                </div>
                {secondaryNavLinks.map(i => (
                  <Link key={i.to} to={i.to} className={`text-lg font-medium ${neonHoverClasses}`} onClick={()=>setOpen(false)}>{i.label}</Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
