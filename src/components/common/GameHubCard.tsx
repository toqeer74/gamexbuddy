import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GameHubCardProps {
  title: string;
  imageUrl: string; // Now used for background
  link: string;
  icon?: React.ReactNode; // Optional icon if no image is preferred
}

const GameHubCard: React.FC<GameHubCardProps> = ({ title, imageUrl, link, icon }) => {
  return (
    <Link to={link} className="block perspective-1000">
      <Card
        className="relative w-64 h-64 flex flex-col items-center justify-end p-4 text-center overflow-hidden
                   bg-cover bg-center group rounded-lg shadow-lg
                   transition-all duration-300 ease-in-out
                   hover:shadow-xl hover:shadow-primary/30
                   hover:rotate-y-3 hover:rotate-x-3 hover:scale-105
                   hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-background
                   drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.9)]"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300"></div>
        <CardHeader className="relative z-10 flex flex-col items-center justify-center p-0 pt-4">
          {icon && ( // Render icon only if provided and no background image is sufficient
            <div className="mb-2 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
              {icon}
            </div>
          )}
          <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 drop-shadow-lg">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 p-0 pb-4 mt-4">
          <Button
            variant="outline"
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm
                       group-hover:bg-primary group-hover:text-primary-foreground
                       group-hover:border-primary transition-all duration-300"
          >
            Explore Hub
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameHubCard;