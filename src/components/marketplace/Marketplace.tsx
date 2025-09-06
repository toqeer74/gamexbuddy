import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap, Shield, Star } from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  type: "account" | "mod" | "skin" | "boost";
  price: number;
  seller: string;
  rating: number;
  verified: boolean;
  image: string;
}

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    // Mock marketplace items
    const mockItems: MarketplaceItem[] = [
      {
        id: "1",
        title: "GTA 6 Premium Account - Level 50",
        type: "account",
        price: 49.99,
        seller: "VerifiedTrader",
        rating: 4.8,
        verified: true,
        image: "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "2",
        title: "Ultra Performance Mod Pack",
        type: "mod",
        price: 19.99,
        seller: "ModMaster",
        rating: 4.9,
        verified: true,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "3",
        title: "Exclusive Character Skins Bundle",
        type: "skin",
        price: 9.99,
        seller: "SkinCreator",
        rating: 4.6,
        verified: false,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "4",
        title: "XP Boost Service - 5000 XP",
        type: "boost",
        price: 14.99,
        seller: "BoostPro",
        rating: 4.7,
        verified: true,
        image: "https://images.unsplash.com/photo-1551827250-66c0f47ce9b8?q=80&w=400&auto=format&fit=crop"
      }
    ];
    setItems(mockItems);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "account": return <Zap className="w-4 h-4" />;
      case "mod": return <Shield className="w-4 h-4" />;
      case "skin": return <Star className="w-4 h-4" />;
      case "boost": return <ShoppingCart className="w-4 h-4" />;
      default: return <ShoppingCart className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Marketplace | Safe Gaming Assets & Accounts | GameXBuddy</title>
        <link rel="canonical" href={canonical("/marketplace")} />
        <meta name="description" content="Buy and sell verified gaming accounts, mods, skins, and booster services safely with GameXBuddy's secure marketplace." />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🎮 Gaming Marketplace
          </h1>
          <p className="text-white/70 mt-2">Trade digital assets safely with verified sellers</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button variant="outline" disabled>All</Button>
          <Button variant="outline" disabled>Mods</Button>
          <Button variant="outline" disabled>Accounts</Button>
          <Button variant="outline" disabled>Skins</Button>
          <Button variant="outline" disabled>Boosts</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    {item.type}
                  </Badge>
                  {item.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✅ Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm leading-tight min-h-[2.5rem]">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-bold">${item.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-white/70">{item.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-white/60 mb-3">Sold by {item.seller}</div>
                <Button variant="neon" size="sm" className="w-full">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Marketplace Rules & Safety</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>✅ Safe Trading</strong>
                <p className="text-white/70">Escrow protection on all transactions</p>
              </div>
              <div>
                <strong>✅ Verified Sellers</strong>
                <p className="text-white/70">Background checks & trust scores</p>
              </div>
              <div>
                <strong>✅ Instant Delivery</strong>
                <p className="text-white/70">Digital assets delivered immediately</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}