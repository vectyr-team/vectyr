import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS, PAGE_META } from "@/config/seo";
import { withTimeout } from "@/lib/supabase-guards";

const QUERY_TIMEOUT_MS = 8000;

/** Fetches business_info from DB, falls back to config defaults. */
export const useBusinessInfo = () => {
  const [data, setData] = useState(BUSINESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetch = async () => {
      try {
        const { data: row, error } = await withTimeout(
          supabase
            .from("business_info")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          QUERY_TIMEOUT_MS,
          "Timed out loading business info"
        );

        if (error) throw error;

        if (row && isActive) {
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
      } catch {
        // Keep config defaults when backend reads fail or stall.
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetch();

    return () => {
      isActive = false;
    };
  }, []);

  return { data, loading };
};

/** Fetches page_meta for a specific page slug, falls back to config defaults. */
export const usePageMeta = (pageKey: string) => {
  const fallback = PAGE_META[pageKey] || { title: "Vectyr", description: "", path: "/" };
  const [meta, setMeta] = useState<{
    title: string;
    description: string;
    path: string;
    ogImage?: string;
  }>(fallback);

  useEffect(() => {
    let isActive = true;

    const fetch = async () => {
      try {
        const slug = pageKey === "home" ? "home" : pageKey;
        const { data, error } = await withTimeout(
          supabase.from("page_meta").select("*").eq("page_slug", slug).limit(1).maybeSingle(),
          QUERY_TIMEOUT_MS,
          "Timed out loading page meta"
        );

        if (error) throw error;

        if (data && isActive) {
          const og = data.og_image as string | null | undefined;
          setMeta({
            title: data.title || fallback.title,
            description: data.description || fallback.description,
            path: fallback.path,
            ogImage: og?.trim() ? og.trim() : undefined,
          });
        }
      } catch {
        // Keep config defaults when backend reads fail or stall.
      }
    };

    void fetch();

    return () => {
      isActive = false;
    };
  }, [pageKey]);

  return meta;
};
