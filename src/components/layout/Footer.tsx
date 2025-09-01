import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} GamexBuddy. All rights reserved.</p>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;