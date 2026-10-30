import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { usePageMeta } from "@/hooks/use-seo-data";
import { withTimeout } from "@/lib/supabase-guards";
import FAQMarkdown from "@/components/FAQMarkdown";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const pageMeta = usePageMeta("faqs");

  useEffect(() => {
    let isActive = true;

    const fetchFaqs = async () => {
      try {
        const { data, error } = await withTimeout(
          supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
          8000,
          "Timed out loading FAQs"
        );

        if (error) throw error;
        if (isActive) setFaqs(data ?? []);
      } catch {
        if (isActive) {
          setFaqs([]);
          setLoadError(true);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetchFaqs();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <FAQPageJsonLd faqs={faqs} />
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-4 block">
            Frequently Asked Questions
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-normal text-foreground mb-12">
            Everything You Need to Know
          </h1>

          {loading ? (
            <p className="text-muted-foreground font-body text-sm">Loading...</p>
          ) : loadError ? (
            <p className="text-muted-foreground font-body text-sm">Unable to load FAQs right now.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-border"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <AccordionTrigger className="font-body text-left text-foreground hover:no-underline py-6 text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed text-base">
                    <FAQMarkdown content={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <section className="px-6 py-16 md:py-[80px] bg-card">
          <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
            <h2 className="font-headline text-2xl md:text-4xl font-normal text-foreground">Still Have Questions?</h2>
            <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-muted-foreground">
              Book a free demo of Vectyr BrandOS and get an honest read on your brand situation to get total clarity on
              whether it's a fit or not.
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

export default FAQs;
