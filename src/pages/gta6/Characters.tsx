import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Characters: React.FC = () => {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>Main Characters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Meet the protagonists and key figures of GTA6. We’ll compile official bios and media here
          as soon as details are confirmed by Rockstar.
        </p>
      </CardContent>
    </Card>
  );
};

export default Characters;

