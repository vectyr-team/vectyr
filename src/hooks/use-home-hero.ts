import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HomeHero {
  headline_lead: string;
  headline_accent: string;
  headline_line1: string;
  headline_line2: string;
  subtitle: string;
  primary_button_label: string;
  primary_button_link: string;
  secondary_button_label: string;
  secondary_button_link: string;
}

const FALLBACK: HomeHero = {
  headline_lead: "You are Better Than Your",
  headline_accent: "Brand Says You Are.",
  headline_line1: "You are <span>Better</span> Than Your",
  headline_line2: "Brand Says You Are.",
  subtitle:
    "Your brand should be making you the obvious choice for your most ideal customers. If it isn't, then that is exactly what we fix.",
  primary_button_label: "Book a Demo",
  primary_button_link: "/demo",
  secondary_button_label: "FAQs",
  secondary_button_link: "/faqs",
};

const CACHE_KEY = "home_hero_cache_v2";
// Cached copy is only trusted briefly, so a stale hero never sticks around
// after content is edited in the backend.
const CACHE_TTL_MS = 10 * 60 * 1000;

const readCache = (): HomeHero | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at?: number; value?: HomeHero };
    if (!parsed?.value || !parsed.at || Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
};

export const useHomeHero = () => {
  const [data, setData] = useState<HomeHero>(() => readCache() ?? FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: row } = await supabase
        .from("home_hero")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (active) {
        if (row) {
          setData(row as HomeHero);
          try {
            window.localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ at: Date.now(), value: row })
            );
          } catch {
            /* ignore */
          }
        }
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};
