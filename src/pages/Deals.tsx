import AffiliateEarnLink from "@/components/earnings/AffiliateEarnLink";

const sampleDeals = [
  { sku: "gta6-std-pc", title: "GTA 6 (PC) - Standard", price: "$59.99", href: "https://example.com/gta6-pc" },
  { sku: "rdr2-pc", title: "RDR2 (PC)", price: "$19.99", href: "https://example.com/rdr2" },
  { sku: "nitro-1m", title: "Discord Nitro 1M", price: "$4.99", href: "https://example.com/nitro" },
];

export default function Deals() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="gx-card p-6">
        <h1 className="text-2xl font-extrabold">Deals & Editor Picks</h1>
        <p className="text-sm text-white/70 mt-1">Clicking a deal awards +5 XP once per item.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {sampleDeals.map((d) => (
          <div key={d.sku} className="gx-card p-5">
            <div className="font-bold">{d.title}</div>
            <div className="text-white/80 mt-1">{d.price}</div>
            <div className="mt-3">
              <AffiliateEarnLink sku={d.sku} href={d.href}>View Deal →</AffiliateEarnLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

