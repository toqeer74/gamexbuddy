import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
    </Card>
  );
};

export default NewsCard;