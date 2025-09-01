import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle2, Flame } from "lucide-react"; // Import icons

interface CommunityContentCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  type: "meme" | "quiz" | "discussion";
  xp?: number; // Optional XP/level badge
  isTrending?: boolean; // New prop for trending posts
  authorAvatarUrl?: string; // New prop for author avatar
  authorName?: string; // New prop for author name
}

const CommunityContentCard: React.FC<CommunityContentCardProps> = ({
  title,
  description,
  imageUrl,
  link,
  type,
  xp,
  isTrending = false,
  authorAvatarUrl,
  authorName = "Anonymous Gamer",
}) => {
  return (
    <Card className="overflow-hidden relative group cursor-pointer rounded-lg shadow-lg
                   hover:scale-[1.02] transition-transform duration-300 ease-in-out
                   bg-white/10 backdrop-blur-sm border border-white/20
                   hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 hover:ring-offset-background
                   drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]">
      {isTrending && (
        <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md flex items-center gap-1 z-10
                          drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]">
          <Flame className="h-3 w-3" /> Trending
        </Badge>
      )}
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
      )}
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        {authorAvatarUrl ? (
          <img src={authorAvatarUrl} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <UserCircle2 className="h-8 w-8 text-muted-foreground" />
        )}
        <div>
          <CardTitle className="text-lg font-bold leading-tight text-white">
            <Link to={link} className="hover:text-primary transition-colors duration-200">
              {title}
            </Link>
          </CardTitle>
          <p className="text-xs text-gray-300">by {authorName}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex flex-col justify-between">
        <CardDescription className="text-sm text-gray-400 line-clamp-2 mb-3">{description}</CardDescription>
        <div className="flex justify-between items-center">
          <Link to={link} className="text-sm text-cyan-300 hover:underline font-medium">
            View {type === "meme" ? "Meme" : type === "quiz" ? "Quiz" : "Discussion"}
          </Link>
          {xp !== undefined && (
            <Badge className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md
                              drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]">
              XP: {xp}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityContentCard;