import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "@iconify/react";

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  quote: string;
  rating: number;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 mb-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        icon="lucide:star"
        className={`w-4 h-4 text-primary ${i < rating ? "fill-primary" : "opacity-25"}`}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, name, title, quote, rating")
        .order("sort_order", { ascending: true });
      if (active && data) setItems(data as Testimonial[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((t) => (
        <figure
          key={t.id}
          className="flex flex-col border border-black03 bg-black02/80 backdrop-blur-sm p-6 md:p-7"
        >
          <Stars rating={t.rating} />
          <blockquote className="font-body text-sm md:text-[15px] leading-relaxed text-lightgray flex-1">
            {t.quote}
          </blockquote>
          <figcaption className="mt-6 pt-5 border-t border-black03">
            <div className="font-body text-sm text-lightgray">{t.name}</div>
            {t.title && (
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                {t.title}
              </div>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default Testimonials;