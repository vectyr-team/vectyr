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

// Always load live content. The hero stays hidden until it arrives, then animates in.
// Fallback is only used if the request fails or takes longer than this.
const FALLBACK_AFTER_MS = 4000;

export const useHomeHero = () => {
  const [data, setData] = useState<HomeHero>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    try {
      window.localStorage.removeItem("home_hero_cache_v2");
      window.localStorage.removeItem("home_hero_cache");
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => active && setLoading(false), FALLBACK_AFTER_MS);
    (async () => {
      const { data: row } = await supabase
        .from("home_hero")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (row) setData(row as HomeHero);
      clearTimeout(timer);
      setLoading(false);
    })();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return { data, loading };
};
