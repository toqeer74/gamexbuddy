import React, { useEffect } from "react";

function setTag(attr: string, name: string, content: string) {
  const selector = attr === 'name' ? `meta[name="${name}"]` : `meta[property="${name}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({
  title: T,
  description: D,
  image,
  url,
  path
}: { title?: string; description?: string; image?: string; url?: string, path?: string }) {
  let title = T;
  let description = D;

  if (path) {
    if (path.startsWith('/news')) {
      title = 'News';
      description = 'Latest news and updates';
    } else if (path.startsWith('/guides')) {
      title = 'Guides';
      description = 'In-depth guides and tutorials';
    } else if (path.startsWith('/community')) {
      title = 'Community';
      description = 'Join the community and discussions';
    } else if (path.startsWith('/tools')) {
      title = 'Tools';
      description = 'Helpful tools and resources';
    }
  }

  useEffect(() => {
    if (title) document.title = title;
    if (description) setTag('name', 'description', description);
    if (title) setTag('property', 'og:title', title);
    if (description) setTag('property', 'og:description', description);
    if (image) setTag('property', 'og:image', image);
    if (url) setTag('property', 'og:url', url);
    setTag('property', 'og:type', 'website');
    if (title) setTag('name', 'twitter:title', title);
    if (description) setTag('name', 'twitter:description', description);
    if (image) setTag('name', 'twitter:image', image);
    setTag('name', 'twitter:card', 'summary_large_image');
  }, [title, description, image, url]);
  return null;
}
