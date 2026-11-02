import LogoMarquee from "@/components/LogoMarquee";
import brandOrDieLogo from "@/assets/bodR-stacked-centered-white.svg";
import heroBackground from "@/assets/hero-background-2.jpg.asset.json";
import orangeStripes from "@/assets/orange-cropped.png.asset.json";
import Header from "@/components/Header";
import ScrollSection from "@/components/ScrollSection";
import BrandCodexAnimation from "@/components/BrandCodexAnimation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { PAGE_META } from "@/config/seo";
import { useBusinessInfo, usePageMeta } from "@/hooks/use-seo-data";
import { useHomeHero } from "@/hooks/use-home-hero";
import Testimonials from "@/components/Testimonials";
import ServiceCards from "@/components/ServiceCards";

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
              className="mt-4 md:mt-8 mx-auto max-w-[310px] sm:max-w-[490px] font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground"
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

            {/* Service cards (managed in admin > Home) */}
            <ServiceCards />
          </div>
        </section>

        {/* Results / Testimonials */}
        <section className="theme-dark relative bg-[#000000] px-6 py-12 md:py-32 overflow-hidden">
          <img
            src="/images/founders.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.9] pointer-events-none"
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
                Let's Do This
              </h2>

              <p className="mt-4 md:mt-6 max-w-xl font-body text-lg leading-relaxed text-muted-foreground">
                If you would rather simple get some clarity by talking to a human being to figure out exactly what you're going to need, what it will cost, and the difference it will make, get on Steve's Calendar.
              </p>

              <div className="mt-10 flex justify-center">
                <a href="https://StevesCalendar.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg">Book Now</Button>
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
