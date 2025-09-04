export const SITE_URL = (import.meta.env.VITE_SITE_URL as string) || "https://gamexbuddy.com";

export const canonical = (path = "/") => {
  const base = SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};

