import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS, PAGE_META } from "@/config/seo";

/** Fetches business_info from DB, falls back to config defaults. */
export const useBusinessInfo = () => {
  const [data, setData] = useState(BUSINESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase
        .from("business_info")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (row) {
        setData({
          name: row.name,
          legalName: row.legal_name,
          description: row.description,
          url: BUSINESS.url,
          telephone: row.telephone,
          email: row.email,
          address: {
            streetAddress: row.street_address,
            addressLocality: row.address_locality,
            addressRegion: row.address_region,
            postalCode: row.postal_code,
            addressCountry: row.address_country,
          },
          geo: {
            latitude: Number(row.geo_latitude),
            longitude: Number(row.geo_longitude),
          },
          serviceArea: row.service_areas as string[],
          servicesOffered: row.services as string[],
          openingHours: row.opening_hours,
          foundingDate: row.founding_date,
          founder: {
            name: row.founder_name,
            url: row.founder_url,
            linkedin: row.founder_linkedin,
          },
          aggregateRating: {
            ratingValue: Number(row.rating_value),
            reviewCount: row.review_count,
            bestRating: 5,
          },
          sameAs: row.social_links as string[],
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { data, loading };
};

/** Fetches page_meta for a specific page slug, falls back to config defaults. */
export const usePageMeta = (pageKey: string) => {
  const fallback = PAGE_META[pageKey] || { title: "Vectyr", description: "", path: "/" };
  const [meta, setMeta] = useState(fallback);

  useEffect(() => {
    const fetch = async () => {
      const slug = pageKey === "home" ? "home" : pageKey;
      const { data } = await supabase
        .from("page_meta")
        .select("*")
        .eq("page_slug", slug)
        .limit(1)
        .single();

      if (data && data.title) {
        setMeta({
          title: data.title,
          description: data.description,
          path: fallback.path,
        });
      }
    };
    fetch();
  }, [pageKey]);

  return meta;
};
