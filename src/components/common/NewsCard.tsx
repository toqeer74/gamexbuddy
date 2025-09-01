import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import RockstarBadge from "./RockstarBadge";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  isOfficial?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, imageUrl, link, isOfficial = false }) => {
  return (
    <Card className="overflow-hidden relative group cursor-pointer rounded-lg shadow-lg
                   transition-all duration-300 ease-in-out
                   hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-background
                   bg-card/50 backdrop-blur-sm border border-white/20">
      <div className="relative w-full h-48 bg-gray-800">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        )}
        {/* Neon hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4
                        group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300">
          <CardTitle className="text-white text-xl font-bold leading-tight">
            <Link to={link} className="hover:text-cyan-300 transition-colors duration-200 neon-text-glow">
              {title}
            </Link>
          </CardTitle>
        </div>
        {isOfficial && (
          <RockstarBadge isOfficial={isOfficial} />
        )}
      </div>
      <CardContent className="p-4">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</CardDescription>
        <Link to={link} className="text-sm text-primary hover:underline font-medium hover:text-cyan-300 transition-colors duration-200">
          Read More
        </Link>
      </CardContent>
    </Card>
  );
};

export default NewsCard;