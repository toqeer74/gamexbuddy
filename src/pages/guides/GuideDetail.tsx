import React from "react";
import { useParams, Link } from "react-router-dom";
import guides from "@/content/guides.json";

type Guide = {
  slug: string;
  title: string;
  intro: string;
  items: Array<{
    name: string;
    image?: string;
    price?: string;
    pros?: string[];
    cons?: string[];
    affiliateUrl?: string;
    rating?: number;
  }>;
};

export default function GuideDetail(){
  const { slug } = useParams<{ slug: string }>();
  const all = guides as Guide[];
  const g = all.find(x => x.slug === slug);

  if (!g) return (
    <div className="wrap" style={{ padding: '40px 0' }}>
      <h1 className="h2">Guide not found</h1>
      <p>We couldn’t find this guide. See all on the homepage or <Link to="/">go back</Link>.</p>
    </div>
  );

  // Determine spec columns present across items
  const specOrder = ["weight", "battery", "panel", "hz"] as const;
  const specKeys = Array.from(
    new Set(
      g.items.flatMap((it: any) => Object.keys(it.specs || {}))
    )
  ).filter(k => specOrder.includes(k as any)) as Array<typeof specOrder[number]>;

  return (
    <div className="section">
      <div className="wrap">
        <nav style={{ fontSize: 13, opacity: .8, marginBottom: 10 }}>
          <Link to="/">Home</Link> / <Link to="/guides">Guides</Link> / <span>{g.title}</span>
        </nav>
        <h1 className="h2">{g.title}</h1>
        <p style={{ opacity:.9, marginBottom: 16 }}>{g.intro}</p>

        <div className="cmp">
          <table className="cmp-table">
            <thead>
              <tr>
                <th>Product</th>
                {specKeys.map(k => (<th key={k}>{k.toUpperCase()}</th>))}
                <th>Pros</th>
                <th>Cons</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {g.items.map((it: any) => (
                <tr key={it.name}>
                  <td>
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      {it.image && <img src={it.image} alt="" style={{ width:72, height:48, objectFit:'cover', borderRadius:8 }} />}
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ fontWeight:800 }}>{it.name}</div>
                          {it.verdict && <span className="badge badge--verdict">{it.verdict}</span>}
                        </div>
                        {it.rating && <div style={{ fontSize:12, opacity:.85 }}>Rating: {it.rating.toFixed(1)} / 5</div>}
                      </div>
                    </div>
                  </td>
                  {specKeys.map(k => (
                    <td key={k}>{(it.specs && it.specs[k]) || '-'}</td>
                  ))}
                  <td>{(it.pros||[]).join(', ')}</td>
                  <td>{(it.cons||[]).join(', ')}</td>
                  <td>{it.price || '-'}</td>
                  <td>
                    {it.affiliateUrl ? (
                      <a className="gx-btn" href={it.affiliateUrl} target="_blank" rel="noopener noreferrer">Check Price</a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
