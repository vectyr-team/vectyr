import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HomeHero {
  headline_lead: string;
  headline_accent: string;
  subtitle: string;
  primary_button_label: string;
  primary_button_link: string;
  secondary_button_label: string;
  secondary_button_link: string;
}

const FALLBACK: HomeHero = {
  headline_lead: "Your Brand is Living in Your Head.",
  headline_accent: "Nowhere Else.",
  subtitle:
    "We turn the messy, implicit brand knowledge in a founder's mind into a clean, accessible, AI-ready system that the whole organization can use without constant founder input.",
  primary_button_label: "Book a Demo",
  primary_button_link: "/demo",
  secondary_button_label: "FAQs",
  secondary_button_link: "/faqs",
};

export const useHomeHero = () => {
  const [data, setData] = useState<HomeHero | null>(null);
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
        setData((row as HomeHero) || FALLBACK);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};
