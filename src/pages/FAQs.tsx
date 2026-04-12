import { useEffect, useState, ReactNode } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

const linkifyText = (text: string): ReactNode[] => {
  const urlRegex = /(https?:\/\/[^\s,)]+|(?:os\.vectyr\.com))/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          {part}
        </a>
      );
    }
    // Reset regex lastIndex
    urlRegex.lastIndex = 0;
    return part;
  });
};

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
      if (data) setFaqs(data);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-4 block">
          Frequently Asked Questions
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-normal text-foreground mb-12">
          Everything You Need to Know
        </h1>

        {loading ? (
          <p className="text-muted-foreground font-body text-sm">Loading...</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border">
                <AccordionTrigger className="font-body text-left text-foreground hover:no-underline py-6 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                  {linkifyText(faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>

      <section className="bg-card px-6 py-24 md:py-32 pt-0">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <h2 className="font-headline text-3xl md:text-5xl font-normal text-foreground">Still Have Questions?</h2>
          <p className="mt-4 max-w-xl font-body text-base text-muted-foreground leading-relaxed">
            Book a free demo of Vectyr BrandOS and get an honest read on your brand situation to get total clarity on
            whether it's a fit or not.
          </p>
          <a href="/demo" className="mt-8">
            <Button size="lg">Book a Demo</Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
