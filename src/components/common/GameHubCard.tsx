import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GameHubCardProps {
  title: string;
  imageUrl: string;
  link: string;
  icon?: React.ReactNode;
}

const GameHubCard: React.FC<GameHubCardProps> = ({ title, imageUrl, link, icon }) => {
  return (
    <Link to={link} className="block">
      <Card className="w-64 h-64 flex flex-col items-center justify-between p-4 text-center hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out group">
        <CardHeader className="flex flex-col items-center justify-center p-0 pt-4">
          {icon ? (
            <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          ) : (
            <img src={imageUrl} alt={title} className="w-24 h-24 object-contain mb-4 group-hover:scale-110 transition-transform duration-300" />
          )}
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            Explore Hub
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameHubCard;