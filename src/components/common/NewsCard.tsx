import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import RockstarBadge from "./RockstarBadge"; // Import the new badge component

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  isOfficial?: boolean; // New prop for official news
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, imageUrl, link, isOfficial = false }) => {
  return (
    <Card className="overflow-hidden relative hover:scale-[1.02] transition-transform duration-300 ease-in-out">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <CardHeader>
        <CardTitle>
          <Link to={link} className="hover:text-primary">
            {title}
          </Link>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={link} className="text-sm text-primary hover:underline">
          Read More
        </Link>
      </CardContent>
      <RockstarBadge isOfficial={isOfficial} />
    </Card>
  );
};

export default NewsCard;