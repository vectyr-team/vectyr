import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQPageJsonLd } from "@/components/JsonLd";
import FAQMarkdown from "@/components/FAQMarkdown";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  heading?: string;
  subheading?: string;
  className?: string;
}

/**
 * Reusable FAQ section with FAQPage JSON-LD schema.
 * Drop onto any page — schema is automatically injected.
 */
const FAQSection = ({
  faqs,
  heading = "Frequently Asked Questions",
  subheading,
  className = "",
}: FAQSectionProps) => {
  if (!faqs.length) return null;

  return (
    <section className={`px-6 py-16 md:py-24 ${className}`} aria-label="Frequently Asked Questions">
      <FAQPageJsonLd faqs={faqs} />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-normal text-foreground mb-4">
          {heading}
        </h2>
        {subheading && (
          <p className="font-body text-base text-muted-foreground leading-relaxed mb-10">
            {subheading}
          </p>
        )}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="font-body text-left text-foreground hover:no-underline py-6 text-lg">
                <h3 className="font-body text-base font-normal">{faq.question}</h3>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed text-base">
                <FAQMarkdown content={faq.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
