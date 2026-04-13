import { BUSINESS, SITE_URL } from "@/config/seo";

/** Renders LocalBusiness JSON-LD schema. Place once (e.g. on homepage). */
export const LocalBusinessJsonLd = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    foundingDate: BUSINESS.foundingDate,
    address: {
      "@type": "PostalAddress",
      ...BUSINESS.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.serviceArea.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vectyr Services",
      itemListElement: BUSINESS.servicesOffered.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
    openingHours: BUSINESS.openingHours,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.aggregateRating.ratingValue,
      reviewCount: BUSINESS.aggregateRating.reviewCount,
      bestRating: BUSINESS.aggregateRating.bestRating,
    },
    founder: {
      "@type": "Person",
      name: BUSINESS.founder.name,
      url: BUSINESS.founder.url,
      sameAs: BUSINESS.founder.linkedin,
    },
    sameAs: BUSINESS.sameAs,
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
