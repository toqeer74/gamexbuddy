import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Gamepad2 } from "lucide-react";

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
          <Link to="/minecraft-hub" className="text-sm font-medium hover:text-primary">
            Minecraft
          </Link>
          <Link to="/pubg-hub" className="text-sm font-medium hover:text-primary">
            PUBG
          </Link>
          <Link to="/community" className="text-sm font-medium hover:text-primary">
            Community
          </Link>
          <Link to="/tools" className="text-sm font-medium hover:text-primary">
            Tools
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
                <Link to="/minecraft-hub" className="text-lg font-medium hover:text-primary">
                  Minecraft
                </Link>
                <Link to="/pubg-hub" className="text-lg font-medium hover:text-primary">
                  PUBG
                </Link>
                <Link to="/community" className="text-lg font-medium hover:text-primary">
                  Community
                </Link>
                <Link to="/tools" className="text-lg font-medium hover:text-primary">
                  Tools
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