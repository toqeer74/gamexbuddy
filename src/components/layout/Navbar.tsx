import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Gamepad2, ChevronDown, Monitor, Gamepad, Smartphone, Apple } from "lucide-react"; // Changed Playstation, Xbox to Gamepad

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">GamexBuddy</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/gta6-hub" className="text-sm font-medium hover:text-primary">
            GTA6 Hub
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                Platforms <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/pc-hub" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> PC Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/playstation-hub" className="flex items-center gap-2">
                  <Gamepad className="h-4 w-4" /> PlayStation Hub {/* Using Gamepad */}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/xbox-hub" className="flex items-center gap-2">
                  <Gamepad className="h-4 w-4" /> Xbox Hub {/* Using Gamepad */}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/android-hub" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Android Hub
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ios-hub" className="flex items-center gap-2">
                  <Apple className="h-4 w-4" /> iOS Hub
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/community" className="text-sm font-medium hover:text-primary">
            Community
          </Link>
          <Link to="/tools" className="text-sm font-medium hover:text-primary">
            Tools
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 pt-6">
                <Link to="/gta6-hub" className="text-lg font-medium hover:text-primary">
                  GTA6 Hub
                </Link>
                <div className="flex flex-col space-y-2 pl-4">
                  <span className="text-lg font-medium text-muted-foreground">Platforms</span>
                  <Link to="/pc-hub" className="text-base font-medium hover:text-primary pl-2">
                    PC Hub
                  </Link>
                  <Link to="/playstation-hub" className="text-base font-medium hover:text-primary pl-2">
                    PlayStation Hub
                  </Link>
                  <Link to="/xbox-hub" className="text-base font-medium hover:text-primary pl-2">
                    Xbox Hub
                  </Link>
                  <Link to="/android-hub" className="text-base font-medium hover:text-primary pl-2">
                    Android Hub
                  </Link>
                  <Link to="/ios-hub" className="text-base font-medium hover:text-primary pl-2">
                    iOS Hub
                  </Link>
                </div>
                <Link to="/community" className="text-lg font-medium hover:text-primary">
                  Community
                </Link>
                <Link to="/tools" className="text-lg font-medium hover:text-primary">
                  Tools
                </Link>
                <Link to="/about" className="text-lg font-medium hover:text-primary">
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