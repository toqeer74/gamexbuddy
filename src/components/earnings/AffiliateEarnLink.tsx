import { awardPointsAndRefresh } from "@/lib/points";

export function AffiliateEarnLink({
  sku,
  href,
  children,
  points = 5,
}: {
  sku: string;
  href: string;
  children: React.ReactNode;
  points?: number;
}) {
  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      await awardPointsAndRefresh("affiliate_click", sku, points);
    } catch {}
    window.open(href, "_blank", "noopener,noreferrer");
  }
  return (
    <a className="gx-link" href={href} onClick={onClick} rel="nofollow">
      {children}
    </a>
  );
}

export default AffiliateEarnLink;

