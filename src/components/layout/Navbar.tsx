import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Gamepad2, ChevronDown, Monitor, Gamepad, Smartphone, Apple } from "lucide-react";

const Navbar = () => {
  const neonHoverClasses = "hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] transition-all duration-300";
  const iconNeonClasses = "group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] transition-all duration-300";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/Gamexbuddy-logo-transparent.png"
            alt="GamexBuddy Logo"
            className="h-8"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (t.src.endsWith("Gamexbuddy-logo-transparent.png")) t.src = "/placeholder.svg";
            }}
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/gta6" className={`text-sm font-medium text-white ${neonHoverClasses}`}>
            GTA6 Hub
          </Link>
          <Link to="/guides" className={`text-sm font-medium text-white ${neonHoverClasses}`}>
            Guides
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center gap-1 text-sm font-medium text-white ${neonHoverClasses} group`}>
                Platforms <ChevronDown className={`ml-1 h-4 w-4 ${iconNeonClasses}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-gray-800 border-white/20 text-white">
              <DropdownMenuItem asChild>
                <Link to="/pc-hub" className={`flex items-center gap-2 ${neonHoverClasses}`}>
                  <Monitor className="h-4 w-4" /> PC Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/playstation-hub" className={`flex items-center gap-2 ${neonHoverClasses}`}>
                  <Gamepad className="h-4 w-4" /> PlayStation Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/xbox-hub" className={`flex items-center gap-2 ${neonHoverClasses}`}>
                  <Gamepad className="h-4 w-4" /> Xbox Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/android-hub" className={`flex items-center gap-2 ${neonHoverClasses}`}>
                  <Smartphone className="h-4 w-4" /> Android Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ios-hub" className={`flex items-center gap-2 ${neonHoverClasses}`}>
                  <Apple className="h-4 w-4" /> iOS Hub
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/community" className={`text-sm font-medium text-white ${neonHoverClasses}`}>
            Community
          </Link>
          <Link to="/tools" className={`text-sm font-medium text-white ${neonHoverClasses}`}>
            Tools
          </Link>
          <Link to="/about" className={`text-sm font-medium text-white ${neonHoverClasses}`}>
            About
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-white/10 text-white">
              <nav className="flex flex-col space-y-4 pt-6">
                <Link to="/gta6-hub" className={`text-lg font-medium ${neonHoverClasses}`}>
                  GTA6 Hub
                </Link>
                <div className="flex flex-col space-y-2 pl-4">
                  <span className="text-lg font-medium text-muted-foreground">Platforms</span>
                  <Link to="/pc-hub" className={`text-base font-medium ${neonHoverClasses} pl-2`}>
                    PC Hub
                  </Link>
                  <Link to="/playstation-hub" className={`text-base font-medium ${neonHoverClasses} pl-2`}>
                    PlayStation Hub
                  </Link>
                  <Link to="/xbox-hub" className={`text-base font-medium ${neonHoverClasses} pl-2`}>
                    Xbox Hub
                  </Link>
                  <Link to="/android-hub" className={`text-base font-medium ${neonHoverClasses} pl-2`}>
                    Android Hub
                  </Link>
                <Link to="/ios-hub" className={`text-base font-medium ${neonHoverClasses} pl-2`}>
                  iOS Hub
                </Link>
              </div>
              <Link to="/guides" className={`text-lg font-medium ${neonHoverClasses}`}>
                Guides
              </Link>
              <Link to="/community" className={`text-lg font-medium ${neonHoverClasses}`}>
                Community
              </Link>
                <Link to="/tools" className={`text-lg font-medium ${neonHoverClasses}`}>
                  Tools
                </Link>
                <Link to="/about" className={`text-lg font-medium ${neonHoverClasses}`}>
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
