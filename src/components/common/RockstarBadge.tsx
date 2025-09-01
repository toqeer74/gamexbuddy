import React from "react";
import { Badge } from "@/components/ui/badge";

interface RockstarBadgeProps {
  isOfficial: boolean;
}

const RockstarBadge: React.FC<RockstarBadgeProps> = ({ isOfficial }) => {
  if (!isOfficial) return null;

  return (
    <Badge variant="secondary" className="absolute top-3 right-3 bg-red-600 text-white hover:bg-red-700">
      Rockstar Official
    </Badge>
  );
};

export default RockstarBadge;