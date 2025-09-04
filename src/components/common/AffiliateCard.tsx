import React from "react";
import SmartImage from "@/components/SmartImage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AffiliateCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  affiliateLink: string;
  buttonText?: string;
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({
  title,
  description,
  imageUrl,
  affiliateLink,
  buttonText = "Buy Now",
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {imageUrl && (
        <SmartImage src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
          <Button>{buttonText}</Button>
        </a>
      </CardContent>
    </Card>
  );
};

export default AffiliateCard;
