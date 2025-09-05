import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export default function SEOHead({
  title = "GameXBuddy - Gaming Hub with AI and Earning Features",
  description = "Join GameXBuddy for gaming guides, deals, memes, earning modules, AI-powered tools, and community features. Earn points while gaming!",
  keywords = ['gaming', 'guides', 'deals', 'gaming community', 'earnings', 'AI gaming'],
  image,
  url,
  type = 'website',
  author = 'GameXBuddy',
  publishedTime,
  modifiedTime,
  section,
  tags
}: SEOHeadProps) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const imageUrl = image || `${window.location.origin}/Gamexbuddy-logo-v2-transparent.png`;

  // GameXBuddy brand colors for structured data
  const brandColors = ['#ff2bd6', '#00f5ff', '#8b5cf6', '#ff006e'];

  const siteName = 'GameXBuddy';
  const twitterHandle = '@gamexbuddy';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${siteName} Gaming Community`} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* GameXBuddy Brand Colors */}
      <meta name="theme-color" content="#ff2bd6" />
      <meta name="msapplication-TileColor" content="#ff2bd6" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      <meta property="twitter:image:alt" content={`${siteName} Gaming Community`} />
      <meta property="twitter:creator" content={twitterHandle} />
      <meta property="twitter:site" content={twitterHandle} />

      {/* Article Specific */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content={section || "Gaming"} />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Gaming Specific Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": window.location.origin,
          "logo": {
            "@type": "ImageObject",
            "url": imageUrl,
            "width": 512,
            "height": 512
          },
          "description": description,
          "sameAs": [
            "https://twitter.com/gamexbuddy",
            "https://discord.gg/gamexbuddy"
          ],
          "brand": {
            "@type": "Brand",
            "name": siteName,
            "color": brandColors.join(", ")
          },
          "offers": {
            "@type": "Offer",
            "category": "Gaming Community",
            "description": "Earn points through gaming activities"
          }
        })}
      </script>

      {/* Gaming WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteName,
          "url": window.location.origin,
          "description": description,
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": imageUrl
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "mainEntity": {
            "@type": "ItemList",
            "name": "Gaming Content",
            "description": "Gaming guides, deals, memes, and community content"
          }
        })}
      </script>

    </Helmet>
  );
}

// Hook for easy SEO integration
export const useSEO = (props: SEOHeadProps) => {
  return <SEOHead {...props} />;
};