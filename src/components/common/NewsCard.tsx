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
                   hover:scale-[1.02] transition-transform duration-300 ease-in-out
                   hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-background">
      <div className="relative w-full h-48 bg-gray-800">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
          <CardTitle className="text-white text-xl font-bold leading-tight">
            <Link to={link} className="hover:text-cyan-300 transition-colors duration-200">
              {title}
            </Link>
          </CardTitle>
        </div>
        <RockstarBadge isOfficial={isOfficial} />
      </div>
      <CardContent className="p-4">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</CardDescription>
        <Link to={link} className="text-sm text-primary hover:underline font-medium">
          Read More
        </Link>
      </CardContent>
    </Card>
  );
};

export default NewsCard;