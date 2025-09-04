import fs from "node:fs";
const SITE = process.env.VITE_SITE_URL || "https://gamexbuddy.com";

const routes = [
  "/", "/news", "/guides", "/tools", "/community", "/gta6",
  "/pc-hub", "/playstation-hub", "/xbox-hub", "/android-hub", "/ios-hub"
];

const news = JSON.parse(fs.readFileSync("src/content/gta6/news.json","utf8"));
let guides = [];
try {
  guides = JSON.parse(fs.readFileSync("src/content/guides.json","utf8"));
} catch {}

const guideSlugs = (guides.length ? guides : []).map(g => `/guides/${g.slug}`);
const dynamic = [
  ...news.map(n => `/news#${encodeURIComponent(n.id)}`),
  ...guideSlugs
];

const urls = [...routes, ...dynamic];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${SITE.replace(/\/$/,"")}${u}</loc></url>`).join("\n")}\n</urlset>`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/sitemap.xml", xml);
console.log("sitemap.xml generated with", urls.length, "urls");
