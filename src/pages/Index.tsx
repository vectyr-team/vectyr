import LogoMarquee from "@/components/LogoMarquee";
import brandOrDieLogo from "@/assets/bodR-stacked-centered-white.svg";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ScrollSection from "@/components/ScrollSection";
import BrandCodexAnimation from "@/components/BrandCodexAnimation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { PAGE_META } from "@/config/seo";
import { useBusinessInfo, usePageMeta } from "@/hooks/use-seo-data";
import { useHomeHero } from "@/hooks/use-home-hero";
import Testimonials from "@/components/Testimonials";

const heroItems = [
  { delay: 0.6 }, // overline
  { delay: 0.8 }, // headline
  { delay: 1.1 }, // paragraph
  { delay: 1.4 }, // button
];

const Index = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const { data: businessInfo } = useBusinessInfo();
  const pageMeta = usePageMeta("home");
  const { data: hero, loading: heroLoading } = useHomeHero();

  useEffect(() => {
    if (heroLoading) return;
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, [heroLoading]);

  const heroStyle = (index: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${heroItems[index].delay}s`,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <LocalBusinessJsonLd business={businessInfo} />

        {/* Hero */}
        <section className="theme-dark relative flex md:min-h-[90dvh] flex-col items-center justify-center px-6 pt-36 pb-20 md:pt-20 md:py-0 overflow-hidden bg-background" style={{ backgroundColor: "hsl(0 0% 0%)" }}>
          {/* Background logos */}
          <LogoMarquee />

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1300px] mx-auto flex flex-col items-center text-center">
            <h1 className="mx-auto" style={heroStyle(1)}>
              <img
                src={brandOrDieLogo}
                alt="Brand or Die"
                className="mx-auto h-auto w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px]"
              />
              <span className="sr-only">
                {" "}
                {[hero.headline_line1 || hero.headline_lead, hero.headline_line2 || hero.headline_accent]
                  .filter(Boolean)
                  .join(" ")
                  .replace(/<\/?span>/gi, "")}
              </span>
            </h1>

            <p
              className="mt-4 md:mt-8 max-w-[37rem] font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground"
              style={heroStyle(2)}
            >
              {hero.subtitle}
            </p>

            <div className="mt-10 flex flex-row gap-4 justify-center" style={heroStyle(3)}>
              <a href={hero.primary_button_link}>
                <Button size="lg">{hero.primary_button_label}</Button>
              </a>
              <a href={hero.secondary_button_link}>
                <Button size="lg" variant="outline">
                  {hero.secondary_button_label}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="relative z-20 bg-card py-6 md:py-8 px-[20px] shadow-elevated">
          <div className="mx-auto max-w-[1300px]">
            <ScrollSection className="grid grid-cols-3">
              {[
                ["Finally", "Documented"],
                ["Team", "Accessible"],
                ["Never", "Obsolete"],
              ].map((words, i) => (
                <div key={i} className="p-8 px-0 py-0">
                  <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] text-muted-foreground text-center">
                    <span className="md:hidden">
                      {words[0]}
                      <br />
                      {words[1]}
                    </span>
                    <span className="hidden md:inline">
                      {words[0]} {words[1]}
                    </span>
                  </p>
                </div>
              ))}
            </ScrollSection>
          </div>
        </section>

        {/* The System */}
        <section className="relative bg-background px-6 py-12 md:py-32 overflow-hidden">
          <img
            src="/images/system-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.06] pointer-events-none"
          />
          <div className="relative z-10 mx-auto max-w-[1300px]">
            <ScrollSection>
              {/* Overline with line */}
              <div className="flex items-center gap-4 mb-4 md:mb-10">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">The Fix</span>
                <div className="h-px w-16 bg-muted-foreground/40" />
              </div>

              <div className="grid gap-8 md:gap-16 md:grid-cols-2 items-start">
                <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                  Three Problems
                  <br />
                  <span className="text-primary">Solved For Good.</span>
                </h2>
                <div className="md:pt-4">
                  <p className="font-body text-lg font-light leading-relaxed text-muted-foreground">
                    Every business with a brand problem has the same three problems in sequence. Most agencies out there
                    attempt to solve the first problem while leaving two more behind.{" "}
                    <span className="font-semibold text-foreground">At Vectyr, we solve all three.</span>
                  </p>
                </div>
              </div>
            </ScrollSection>

            {/* Product cards */}
            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              {[
                {
                  problem: "Problem 01",
                  problemDesc:
                    "Nothing defined. The brand never existed as a defined system, or it's scattered across too many heads with no alignment.",
                  title: "Brand Genome",
                  desc: "Your brand's DNA. Vectyr runs the extraction, sequencing, and full team integration. You bring the knowledge, we add more, and build the rest. One to two sessions of your time.",
                },
                {
                  problem: "Problem 02",
                  problemDesc:
                    "Information sitting in a document doesn't get read. In the age of AI, brand knowledge needs to be more accessible.",
                  title: "BrandHelix.ai",
                  desc: "The platform where the brand intelligence lives, gets distributed to everyone who needs it. Your team, your vendors, everyone. No more briefing from fuzzy memory.",
                },
                {
                  problem: "Problem 03",
                  problemDesc:
                    "Every strategy can go stale when something changes. There's no system to keep it current as the business evolves.",
                  title: "Continuity",
                  desc: "180-day brand check-ins to examine performance. You can submit new info at any time so we can update the Brand Genome and avoid any brand drift.",
                },
              ].map((card, i) => (
                <ScrollSection
                  key={i}
                  className={`bg-card p-8 flex flex-col scroll-animate-delay-${i + 1} border-l border-border/40`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{card.problem}</p>
                  <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">{card.problemDesc}</p>

                  <div className="h-px w-full my-8 bg-border" />

                  <h3 className="font-body font-semibold text-xl md:text-2xl leading-tight text-foreground normal-case tracking-normal flex items-center gap-3">
                    <Icon icon="lucide:check" className="text-primary shrink-0" />
                    {card.title}
                  </h3>
                  <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">{card.desc}</p>
                </ScrollSection>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-4">
              <a href="/demo">
                <Button size="lg">Book a Demo</Button>
              </a>
              <a href="/faqs">
                <Button size="lg" variant="outline">
                  FAQs
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Results / Testimonials */}
        <section className="theme-dark relative bg-[#000000] px-6 py-12 md:py-32 overflow-hidden">
          <img
            src="/images/founders.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.7] pointer-events-none"
          />
          <div className="relative z-10 mx-auto max-w-[1300px]">
            <ScrollSection>
              <div className="flex items-center gap-4 mb-4 md:mb-10">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">Results</span>
                <div className="h-px w-16 bg-muted-foreground/40" />
              </div>

              <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
                What Founders <span className="text-primary">Say.</span>
              </h2>
            </ScrollSection>

            <div className="mt-16">
              <Testimonials />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 md:py-40 bg-card">
          <div className="mx-auto max-w-[1300px] flex flex-col items-center text-center">
            <ScrollSection className="flex flex-col items-center">
              <h2
                className="font-headline font-light leading-[0.95] tracking-normal text-4xl md:text-5xl lg:text-6xl max-w-[830px] text-foreground"
              >
                Stop being
                <br />
                <span className="text-primary">the only person</span>
                <br />
                who knows.
              </h2>

              <p className="mt-4 md:mt-6 max-w-xl font-body text-lg leading-relaxed text-muted-foreground">
                Get every person on your team working from the same single source of truth. This is the system that you're missing and it's costing you more than you think. Change it once and for all.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a href="/demo">
                  <Button size="lg">Experience the Demo</Button>
                </a>
                <a href="/faqs">
                  <Button size="lg" variant="outline">
                    FAQs
                  </Button>
                </a>
              </div>
            </ScrollSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
