import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MapPage: React.FC = () => {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>Map & Setting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          GTA6 returns to a modern Vice City and surrounding areas. Here we’ll curate official
          screenshots, map reveals, and city district breakdowns once published by Rockstar.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapPage;

