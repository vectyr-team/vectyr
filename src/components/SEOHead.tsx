import { useEffect } from "react";
import { SITE_URL, OG_IMAGE } from "@/config/seo";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

/**
 * Sets document title and injects/updates meta tags for SEO + social sharing.
 * Call once per page at the top of the component tree.
 */
const SEOHead = ({ title, description, path, ogImage = OG_IMAGE }: SEOHeadProps) => {
  const canonicalUrl = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", "website");

    // Twitter
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:card", "summary_large_image");

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [title, description, canonicalUrl, ogImage]);

  return null;
};

export default SEOHead;
