import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Editions: React.FC = () => {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>Editions & Pre‑Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Expect multiple editions (Standard, Deluxe, Ultimate). Once official, we’ll list exact contents,
          prices, and regional availability. We’ll also include trusted retailer links with clear labels.
        </p>
      </CardContent>
    </Card>
  );
};

export default Editions;

