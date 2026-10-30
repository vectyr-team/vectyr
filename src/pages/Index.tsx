import LogoMarquee from "@/components/LogoMarquee";
import brandOrDieLogo from "@/assets/bodR-stacked-centered-white.svg";
import heroBackground from "@/assets/hero-background-2.jpg.asset.json";
import orangeStripes from "@/assets/orange-cropped.png.asset.json";
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

const Index = () => {
  const { data: businessInfo } = useBusinessInfo();
  const pageMeta = usePageMeta("home");
  const { data: hero, loading: heroLoading } = useHomeHero();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <LocalBusinessJsonLd business={businessInfo} />

        {/* Hero */}
        <section className="theme-dark relative flex md:min-h-[90dvh] flex-col items-center justify-center px-6 pt-[194px] pb-[130px] md:pt-20 md:py-0 overflow-hidden bg-background" style={{ backgroundColor: "hsl(0 0% 0%)" }}>
          {/* Background image */}
          <img
            src={heroBackground.url}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
          />
          {/* Background logos */}
          <LogoMarquee />

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1300px] mx-auto flex flex-col items-center text-center">
            <h1 className="mx-auto">
              <img
                src={brandOrDieLogo}
                alt="Brand or Die®"
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
              className="mt-4 md:mt-8 max-w-[490px] font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground"
              style={{ visibility: heroLoading ? "hidden" : "visible" }}
            >
              {hero.subtitle}
            </p>
          </div>
          <img
            src={orangeStripes.url}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-50 w-[42vw] md:w-[20vw] max-w-[320px] h-auto"
          />
        </section>

        {/* Benefits Strip */}
        <section className="relative z-20 bg-card py-6 md:py-8 px-[20px] shadow-elevated">
          <div className="mx-auto max-w-[1300px]">
            <ScrollSection className="grid grid-cols-3">
              {["CONSULTING", "STRATEGY", "EXECUTION"].map((label, i) => (
                <div key={i} className="p-8 px-0 py-0">
                  <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] text-muted-foreground text-center">
                    <span>{label}</span>
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
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">Services</span>
                <div className="h-px w-16 bg-muted-foreground/40" />
              </div>

              <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
                What Problem Do You
                <br />
                <span className="text-primary">Need Solved?</span>
              </h2>
            </ScrollSection>

            {/* Service cards */}
            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "lucide:repeat",
                  title: "Ongoing Creative Help",
                  desc: "A fractional creative department that handles your design, campaigns, and ad management month to month, with no long-term contract.",
                },
                {
                  icon: "lucide:compass",
                  title: "Brand Strategy",
                  desc: "We pull what you know out of your head and into a Brand Intelligence System your whole team, your vendors, and your freelancers can run on.",
                },
                {
                  icon: "lucide:users",
                  title: "Understand Customers",
                  desc: "Interviews with your customers become a detailed profile of how they experience the problem you solve, in their own words.",
                },
                {
                  icon: "lucide:pen-tool",
                  title: "Logo & Visual Identity",
                  desc: "A responsive logo and a complete identity system with clear rules, so your brand looks right everywhere it shows up.",
                },
                {
                  icon: "lucide:monitor",
                  title: "Website Design",
                  desc: "Custom sites built around what your business needs, dialed into your audience with SEO and AEO basics included from day one.",
                },
                {
                  icon: "lucide:message-circle",
                  title: "Brand Consulting",
                  desc: "Hourly sessions for branding questions, problem-solving, or a stubborn design issue, in blocks of one hour or several.",
                },
              ].map((card, i) => (
                <ScrollSection key={i} className="bg-card p-8 flex flex-col border-l border-border/40">
                  <Icon icon={card.icon} className="text-primary text-3xl" aria-hidden="true" />
                  <h3 className="mt-6 font-body font-semibold text-xl md:text-2xl leading-tight text-foreground normal-case tracking-normal">
                    {card.title}
                  </h3>
                  <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">{card.desc}</p>
                  <div className="mt-auto pt-5">
                    <Button asChild variant="outline" size="sm">
                      <a href="/contact" aria-label={`How it works: ${card.title}`}>How it Works</a>
                    </Button>
                  </div>
                </ScrollSection>
              ))}
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
