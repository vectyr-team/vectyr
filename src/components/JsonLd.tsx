import { SITE_URL } from "@/config/seo";

interface BusinessData {
  name: string;
  legalName: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { latitude: number; longitude: number };
  serviceArea: string[];
  servicesOffered: string[];
  openingHours: string;
  foundingDate: string;
  founder: { name: string; url: string; linkedin: string };
  aggregateRating: { ratingValue: number; reviewCount: number; bestRating: number };
  sameAs: string[];
}

/** Renders LocalBusiness JSON-LD schema from provided data. */
export const LocalBusinessJsonLd = ({ business }: { business: BusinessData }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: SITE_URL,
    telephone: business.telephone,
    email: business.email,
    foundingDate: business.foundingDate,
    address: {
      "@type": "PostalAddress",
      ...business.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: business.serviceArea.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${business.name} Services`,
      itemListElement: business.servicesOffered.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
    openingHours: business.openingHours,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.aggregateRating.ratingValue,
      reviewCount: business.aggregateRating.reviewCount,
      bestRating: business.aggregateRating.bestRating,
    },
    founder: {
      "@type": "Person",
      name: business.founder.name,
      url: business.founder.url,
      sameAs: business.founder.linkedin,
    },
    sameAs: business.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/** Renders FAQPage JSON-LD from an array of Q&A pairs. */
export const FAQPageJsonLd = ({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) => {
  if (!faqs.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
