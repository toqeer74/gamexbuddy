import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, Users, TrendingUp, AlertTriangle } from "lucide-react";

interface PremiumFeature {
  id: number;
  user_id: string;
  feature_type: string;
  is_active: boolean;
  activated_at: string;
  expires_at: string | null;
}

interface PremiumTier {
  name: string;
  price: number;
  icon: any;
  color: string;
  features: string[];
  popular?: boolean;
}

const PREMIUM_TIERS: PremiumTier[] = [
  {
    name: "VIP",
    price: 4.99,
    icon: Star,
    color: "primary",
    features: [
      "Custom profile badge",
      "Priority support",
      "Early access to features",
      "Ad-free experience"
    ],
    popular: true
  },
  {
    name: "Elite",
    price: 9.99,
    icon: Crown,
    color: "yellow",
    features: [
      "All VIP features",
      "Profile highlighted in leaderboards",
      "Exclusive content access",
      "1-on-1 coaching session"
    ]
  },
  {
    name: "Legend",
    price: 14.99,
    icon: Zap,
    color: "purple",
    features: [
      "All Elite features",
      "Featured in hall of fame",
      "Personal branding consultation",
      "Monthly strategy sessions"
    ]
  }
];

export default function PremiumFeatures() {
  const [userPremiumFeatures, setUserPremiumFeatures] = useState<PremiumFeature[]>([]);
  const [selectedTier, setSelectedTier] = useState<PremiumTier | null>(null);

  useEffect(() => {
    loadUserPremiumFeatures();
  }, []);

  const loadUserPremiumFeatures = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("premium_features")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    setUserPremiumFeatures(data || []);
  };

  const purchasePremium = async (tier: PremiumTier) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Use Stripe checkout for real payments
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { user_id: user.id, email: user.email }
    });

    if (error) {
      alert('Payment setup failed. Please try again.');
      return;
    }

    // Redirect to Stripe checkout
    window.location.href = data.url;
  };

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case "posts_highlight": return <TrendingUp className="w-4 h-4" />;
      case "featured_profile": return <Star className="w-4 h-4" />;
      case "custom_badge": return <Crown className="w-4 h-4" />;
      case "early_access": return <Zap className="w-4 h-4" />;
      default: return <Badge className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
          👑 Premium Gaming Experience
        </h1>
        <p className="text-white/70 mt-2">Support GameXBuddy and unlock exclusive features</p>
      </div>

      {/* Current Premium Status */}
      {userPremiumFeatures.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Your Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPremiumFeatures.map(feature => (
                <div key={feature.id} className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  {getFeatureIcon(feature.feature_type)}
                  <div className="flex-1">
                    <p className="text-primary font-medium">
                      {feature.feature_type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-white/60 text-sm">
                      Active since {formatDate(feature.activated_at)}
                      {feature.expires_at && (
                        <span className="ml-2 text-yellow-400">
                          • Expires {formatDate(feature.expires_at)}
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREMIUM_TIERS.map((tier, index) => {
          const IconComponent = tier.icon;
          return (
            <Card
              key={tier.name}
              className={`relative border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50
                ${tier.popular ? 'ring-2 ring-primary/50 border-primary/30' : ''}
                hover:shadow-xl transition-all duration-300 hover:scale-105
              `}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    🔥 Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <div className={`mx-auto w-12 h-12 bg-${tier.color}/20 rounded-full flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${tier.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-white">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mt-2">
                  ${tier.price}
                  <span className="text-sm text-white/60">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-white/80">
                      <div className={`w-1 h-1 bg-${tier.color} rounded-full`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => purchasePremium(tier)}
                  variant={tier.popular ? "neon" : "outline"}
                  className="w-full mt-6"
                >
                  🎉 Get {tier.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
        <CardHeader>
          <CardTitle className="text-primary">🎮 Why Go Premium?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Boost Your Visibility</h4>
                  <p className="text-white/60 text-sm">Get highlighted in leaderboards and featured in community updates</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Priority Support</h4>
                  <p className="text-white/60 text-sm">Get faster responses and dedicated gaming strategy sessions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Early Access</h4>
                  <p className="text-white/60 text-sm">Be the first to test new features and game releases</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-destructive/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Ad-Free Experience</h4>
                  <p className="text-white/60 text-sm">Support GameXBuddy and enjoy uninterrupted gaming content</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Ready to Level Up Your Experience?</h3>
        <p className="text-white/70 mb-6">Join hundreds of premium gamers who support GameXBuddy</p>
        <Button variant="neon" size="lg" className="text-lg px-8">
          🚀 Become Premium Today
        </Button>
      </div>

    </div>
  );
}