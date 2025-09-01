import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReleaseDate: React.FC = () => {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>GTA6 Release Date</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Rockstar has announced GTA6 is targeting a 2025 release window. This page will be updated
          with confirmed regional timings, editions, and preload details as official information drops.
        </p>
        <p className="text-sm text-muted-foreground">
          We avoid rumors. Only official sources will be mirrored here.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReleaseDate;

