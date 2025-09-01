import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommunityContentCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  type: "meme" | "quiz" | "discussion";
  xp?: number; // Optional XP/level badge
}

const CommunityContentCard: React.FC<CommunityContentCardProps> = ({
  title,
  description,
  imageUrl,
  link,
  type,
  xp,
}) => {
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
      <CardContent className="flex justify-between items-center">
        <Link to={link} className="text-sm text-primary hover:underline">
          View {type === "meme" ? "Meme" : type === "quiz" ? "Quiz" : "Discussion"}
        </Link>
        {xp !== undefined && (
          <Badge variant="secondary" className="bg-green-500 text-white">
            XP: {xp}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityContentCard;