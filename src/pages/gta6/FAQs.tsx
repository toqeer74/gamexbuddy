import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAQs: React.FC = () => {
  const faqs = [
    { q: "Is the release date confirmed?", a: "Rockstar has announced a 2025 window. Exact date TBD." },
    { q: "Which platforms?", a: "Official platforms will be listed here once confirmed by Rockstar." },
    { q: "Will GTA6 have cross‑play?", a: "Unconfirmed. We’ll update this page when official statements are available." },
  ];

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>FAQs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i}>
            <p className="font-medium">{f.q}</p>
            <p className="text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FAQs;

