import React from "react";
import { Badge } from "@/components/ui/badge";

interface RockstarBadgeProps {
  isOfficial: boolean;
}

const RockstarBadge: React.FC<RockstarBadgeProps> = ({ isOfficial }) => {
  if (!isOfficial) return null;

  return (
    <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md hover:bg-red-700 transition-colors duration-200">
      Rockstar Official
    </Badge>
  );
};

export default RockstarBadge;