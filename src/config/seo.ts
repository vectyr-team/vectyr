/**
 * Central SEO & Business configuration.
 * Update values here — they propagate to JSON-LD, meta tags, sitemap, etc.
 */

export const SITE_URL = "https://vectyr.lovable.app";
export const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/xwpFU83enpbKbPCWohWsPpqAxoq2/social-images/social-1775767168219-og-image-vectyr.webp";

export const BUSINESS = {
  name: "Vectyr",
  legalName: "Vectyr, Ltd.",
  description:
    "Vectyr is a brand infrastructure company that extracts, structures, and installs brand strategy for founders — making it usable by humans and AI tools alike.",
  url: SITE_URL,
  telephone: "+15128791233",
  email: "hello@vectyr.com",
  address: {
    streetAddress: "701 Tillery St, Unit 12-1045",
    addressLocality: "Austin",
    addressRegion: "TX",
    postalCode: "78702",
    addressCountry: "US",
  },
  geo: {
    latitude: 30.2672,
    longitude: -97.7431,
  },
  serviceArea: ["Austin, TX", "United States"],
  servicesOffered: [
    "Brand Strategy",
    "Brand Codex Development",
    "BrandOS Platform",
    "BrandPulse Maintenance",
    "Brand Infrastructure for AI",
  ],
  openingHours: "Mo-Fr 09:00-17:00",
  foundingDate: "2005",
  founder: {
    name: "Steve Reed",
    url: "https://stevesbrain.com",
    linkedin: "https://www.linkedin.com/in/stevereedbrands",
  },
  aggregateRating: {
    ratingValue: 5.0,
    reviewCount: 47,
    bestRating: 5,
  },
  sameAs: [
    "https://www.youtube.com/@vectyrbrands",
    "https://www.behance.net/vectyr",
    "https://www.linkedin.com/in/stevereedbrands",
  ],
};

/** Per-page meta configuration */
export const PAGE_META: Record<
  string,
  { title: string; description: string; path: string }
> = {
  home: {
    title: "Vectyr — Brand Infrastructure for Humans and AI",
    description:
      "Vectyr extracts your brand, structures it for humans and AI, and installs it everywhere your team works. Stop winging it.",
    path: "/",
  },
  about: {
    title: "About Vectyr — Twenty Years Building Brands",
    description:
      "Meet the founder, understand the methodology, and learn why Vectyr builds brand operating systems instead of logos.",
    path: "/about",
  },
  demo: {
    title: "Book a Demo — Experience BrandOS Live",
    description:
      "Walk through the BrandOS platform, see how your brand gets built and integrated with AI tools, and decide if it's a fit.",
    path: "/demo",
  },
  contact: {
    title: "Contact Vectyr — Let's Talk Brand Strategy",
    description:
      "Have questions or ready to start? Reach out to Vectyr for an honest conversation about your brand.",
    path: "/contact",
  },
  faqs: {
    title: "FAQs — Everything You Need to Know About Vectyr",
    description:
      "Get answers to common questions about the Brand Codex, BrandOS platform, pricing, and how Vectyr works.",
    path: "/faqs",
  },
  "vectyr-brand-os": {
    title: "BrandOS — Your Brand, Installed | Vectyr",
    description:
      "BrandOS is the operating environment that turns your Brand Codex into infrastructure your team and AI tools can actually use.",
    path: "/vectyr-brand-os",
  },
  "site-ops": {
    title: "SiteOps — WordPress Maintenance, Handled | Vectyr",
    description:
      "SiteOps is the done-for-you operational layer that keeps your WordPress site secure, updated, and running without you managing it.",
    path: "/site-ops",
  },
};
