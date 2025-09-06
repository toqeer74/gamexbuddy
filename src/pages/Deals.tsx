import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { cheapSharkAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, DollarSign, ShoppingCart, ExternalLink } from "lucide-react";

interface Deal {
  internalName: string;
  title: string;
  metacriticLink: string;
  dealID: string;
  storeID: string;
  gameID: string;
  salePrice: string;
  normalPrice: string;
  isOnSale: boolean;
  savings: string;
  metacriticScore: string;
  steamRating: string;
  releaseDate: number;
  lastChange: number;
  dealRating: string;
  thumb: string;
  store: {
    storeName: string;
    storeID: string;
  };
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await cheapSharkAPI.getDeals({
        pageSize: 20,
        sortBy: 'Savings'
      });
      setDeals(response || []);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      // Fallback data with some sample deals
      setDeals([
        {
          internalName: "GRANDTHEFTAUTOV",
          title: "Grand Theft Auto V",
          metacriticLink: "/game/pc/grand-theft-auto-v",
          dealID: "sample",
          storeID: "1",
          gameID: "271590",
          salePrice: "29.99",
          normalPrice: "59.99",
          isOnSale: true,
          savings: "50.00",
          metacriticScore: "96",
          steamRating: "94",
          releaseDate: 1375296000,
          lastChange: 1638364800,
          dealRating: "10.0",
          thumb: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/capsule_sm_120.jpg?t=1695060747",
          store: {
            storeName: "Steam",
            storeID: "1"
          }
        },
        {
          internalName: "THEDIVISION2",
          title: "Tom Clancy's The Division 2",
          metacriticLink: "/game/pc/tom-clancys-the-division-2",
          dealID: "sample2",
          storeID: "1",
          gameID: "7220",
          salePrice: "19.99",
          normalPrice: "39.99",
          isOnSale: true,
          savings: "50.02",
          metacriticScore: "82",
          steamRating: "75",
          releaseDate: 1542249600,
          lastChange: 1638364800,
          dealRating: "9.5",
          thumb: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/671610/capsule_sm_120.jpg?t=1698436764",
          store: {
            storeName: "Steam",
            storeID: "1"
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavingsPercent = (salePrice: string, normalPrice: string) => {
    const sale = parseFloat(salePrice);
    const normal = parseFloat(normalPrice);
    return ((normal - sale) / normal * 100).toFixed(0);
  };

  const getStoreIcon = (storeName: string) => {
    // Simple store icons based on name
    switch (storeName.toLowerCase()) {
      case 'steam': return '🔥';
      case 'epic games store': return '🎮';
      case 'origin': return '💎';
      case 'ubisoft': return '🦅';
      default: return '🏪';
    }
  };

  return (
    <>
      <Helmet>
        <title>Game Deals | Best Price Comparison | GameXBuddy</title>
        <link rel="canonical" href={canonical("/deals")} />
        <meta name="description" content="Find the best game deals across all platforms. Compare prices and get notified about sales on Steam, Epic Games, Origin, and more." />
      </Helmet>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            💰 Best Game Deals
          </h1>
          <p className="text-white/70 mt-2">Save money on your favorite games across all platforms</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <Card
                key={`${deal.dealID}-${index}`}
                className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-800">
                  {deal.thumb && (
                    <img
                      src={deal.thumb}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white">
                      -{calculateSavingsPercent(deal.salePrice, deal.normalPrice)}%
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      {getStoreIcon(deal.store.storeName)} {deal.store.storeName}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center gap-1 text-white font-bold text-lg">
                      <DollarSign className="w-4 h-4" />
                      {deal.salePrice}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight text-white line-clamp-2">
                    {deal.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-white/70">
                      <DollarSign className="w-3 h-3" />
                      <span className="line-through">${deal.normalPrice}</span>
                      <Badge variant="outline" className="ml-1">
                        Save ${calculateSavingsPercent(deal.salePrice, deal.normalPrice)}
                      </Badge>
                    </div>
                  </div>

                  {deal.metacriticScore && parseInt(deal.metacriticScore) > 0 && (
                    <div className="flex items-center gap-1 text-sm text-white/70">
                      <span>Meta: {deal.metacriticScore}/100</span>
                    </div>
                  )}

                  <Button variant="neon" className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Get Deal
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && deals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/50 text-lg">No deals found</div>
            <p className="text-white/30 mt-2">Check back later for new deals</p>
          </div>
        )}

        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-blue-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Deal Alerts 💸</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-green-400">Price Tracking</strong>
                <p className="text-white/70">Get notified when games you want go on sale</p>
              </div>
              <div>
                <strong className="text-green-400">Wishlist Deals</strong>
                <p className="text-white/70">Save games to your wishlist for automatic alerts</p>
              </div>
              <div>
                <strong className="text-green-400">Best Price Guarantee</strong>
                <p className="text-white/70">Find the lowest price across all platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
