import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import { DefinedTermSetJsonLd } from "@/components/JsonLd";
import { usePageMeta } from "@/hooks/use-seo-data";
import { withTimeout } from "@/lib/supabase-guards";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  sort_order: number;
}

const Glossary = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const pageMeta = usePageMeta("glossary");

  useEffect(() => {
    let isActive = true;

    const fetchTerms = async () => {
      try {
        const { data, error } = await withTimeout(
          supabase.from("glossary_terms").select("*").order("sort_order", { ascending: true }),
          8000,
          "Timed out loading glossary terms"
        );

        if (error) throw error;
        if (isActive) setTerms(data ?? []);
      } catch {
        if (isActive) {
          setTerms([]);
          setLoadError(true);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetchTerms();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-card text-foreground">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <DefinedTermSetJsonLd terms={terms} />
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-4 block">Glossary</span>
          <h1 className="font-headline text-5xl md:text-7xl font-normal text-foreground mb-12">Vectyr Terminology</h1>

          {loading ? (
            <p className="text-muted-foreground font-body text-sm">Loading...</p>
          ) : loadError ? (
            <p className="text-muted-foreground font-body text-sm">Unable to load glossary terms right now.</p>
          ) : terms.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No terms yet.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {terms.map((t, i) => (
                <AccordionItem
                  key={t.id}
                  value={t.id}
                  className="border-border opacity-0 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <AccordionTrigger className="font-body text-left text-foreground hover:no-underline py-6 text-lg">
                    {t.term}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                    {t.definition}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <section className="px-6 py-16 md:py-[80px]" style={{ backgroundColor: "#F5F5F5" }}>
          <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-normal" style={{ color: "#090909" }}>
              See a Demo of BrandOS
            </h2>
            <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: "#6B6B6B" }}>
              Book a free demo of Vectyr BrandOS and see how these concepts come together in a real brand operating
              system.
            </p>
            <a href="/demo" className="mt-8">
              <Button size="lg">Book a Demo</Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Glossary;
