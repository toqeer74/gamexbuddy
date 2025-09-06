import React from "react";
import AffiliateLink from "@/components/AffiliateLink";

const stores = [
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    href: "https://www.amazon.com/s?k=gaming+hardware&tag=gamexbuddy",
    description: "PC hardware, consoles, accessories"
  },
  {
    name: "G2A",
    logo: "https://www.g2a.co/logo.svg",
    href: "https://www.g2a.com/category/games-c1",
    description: "Game keys and digital downloads"
  },
  {
    name: "Kinguin",
    logo: "https://www.kinguin.net/images/logo.svg",
    href: "https://www.kinguin.net/category/games",
    description: "Cheap game keys and bundles"
  }
];

export default function AffiliateStores() {
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">Partner Stores</h2>
        <p className="text-muted-foreground mb-6">
          Support GameXBuddy through our carefully selected affiliate partners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.name} className="card-glass p-6 text-center">
              <img src={store.logo} alt={store.name} className="h-12 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">{store.description}</p>
              <AffiliateLink href={store.href} label="store-visit" refTag="partner-store">
                Shop {store.name}
              </AffiliateLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}