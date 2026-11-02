import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HomeService {
  id: string;
  icon: string;
  image_url: string;
  title: string;
  summary: string;
  modal_title: string;
  modal_description: string;
  cta_link: string;
  sort_order: number;
}

export const useHomeServices = () => {
  const [data, setData] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: rows } = await supabase
        .from("home_services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!active) return;
      setData((rows as HomeService[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
};
