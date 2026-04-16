import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/config/seo";

interface SchemaPreviewProps {
  refreshToken?: number;
}

const SchemaPreview = ({ refreshToken = 0 }: SchemaPreviewProps) => {
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"business" | "faq">("business");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [bizRes, faqRes] = await Promise.all([
        supabase
          .from("business_info")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
      ]);

      setBusinessInfo(bizRes.data ?? null);
      setFaqs(faqRes.data ?? []);
      setLoading(false);
    };

    fetchAll();
  }, [refreshToken]);

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const businessSchema = businessInfo
    ? {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: businessInfo.name,
        legalName: businessInfo.legal_name,
        description: businessInfo.description,
        url: SITE_URL,
        telephone: businessInfo.telephone,
        email: businessInfo.email,
        foundingDate: businessInfo.founding_date,
        address: {
          "@type": "PostalAddress",
          streetAddress: businessInfo.street_address,
          addressLocality: businessInfo.address_locality,
          addressRegion: businessInfo.address_region,
          postalCode: businessInfo.postal_code,
          addressCountry: businessInfo.address_country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: businessInfo.geo_latitude,
          longitude: businessInfo.geo_longitude,
        },
        areaServed: (businessInfo.service_areas || []).map((a: string) => ({
          "@type": "Place",
          name: a,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Vectyr Services",
          itemListElement: (businessInfo.services || []).map((s: string) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s },
          })),
        },
        openingHours: businessInfo.opening_hours,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: businessInfo.rating_value,
          reviewCount: businessInfo.review_count,
          bestRating: 5,
        },
        founder: {
          "@type": "Person",
          name: businessInfo.founder_name,
          url: businessInfo.founder_url,
          sameAs: businessInfo.founder_linkedin,
        },
        sameAs: businessInfo.social_links || [],
      }
    : null;

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      }
    : null;

  const tabs = [
    { key: "business" as const, label: "LocalBusiness" },
    { key: "faq" as const, label: "FAQPage" },
  ];

  const activeSchema = activeTab === "business" ? businessSchema : faqSchema;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 rounded transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground bg-card border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-background border border-border rounded-lg p-4 overflow-auto max-h-[600px]">
        {activeSchema ? (
          <pre className="font-mono text-xs text-foreground whitespace-pre-wrap">
            {JSON.stringify(activeSchema, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground text-sm">No data available.</p>
        )}
      </div>

      {activeSchema && (
        <a
          href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Test with Google Rich Results →
        </a>
      )}
    </div>
  );
};

export default SchemaPreview;
