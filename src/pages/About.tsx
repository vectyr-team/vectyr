import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ctaBg from "@/assets/cta-bg.jpg";
import bodXWatermark from "@/assets/bodX-watermark.svg";
import Header from "@/components/Header";
import steveTall from "@/assets/steve-tall.jpg";
import aboutHeroBg from "@/assets/about-hero-bg.jpg";
import cakeJerkyCpp from "@/assets/cake-jerky-cpp.jpg.asset.json";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";

const About = () => {
  const pageMeta = usePageMeta("about");
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
      <SEOHead {...pageMeta} />

      <section className="theme-dark relative px-6 pt-28 pb-8 md:pt-52 md:pb-24 min-h-[80vh] flex items-center overflow-hidden">
        <img src={aboutHeroBg} alt="" className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left column */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
              About Vectyr
            </span>

            <h1 className="font-headline font-light text-5xl leading-[0.95] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              TWENTY YEARS.<br />
              <span className="text-primary">ONE ANSWER.</span>
            </h1>
          </div>

          {/* Right column */}
          <div className="space-y-8 md:pt-8">
            <p className="font-body text-xl md:text-2xl font-semibold leading-snug text-foreground">
              Most agencies start with the logo. We start with the data and the strategy.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              The strategy that tells your team, your vendors, and your AI tools exactly who you are, what you stand for, and how to say it without routing every decision back through you. For two decades we've watched good businesses lose to worse ones, because the market rewards whoever earns trust fastest and the better product rarely gets there first.
            </p>

            <p className="font-body italic text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              BrandHelix exists because that is a solvable problem, and nobody else was solving it the right way.
            </p>
          </div>
        </div>
      </section>

      {/* The Indictment */}
      <section className="relative px-6 py-16 md:py-32 bg-card overflow-hidden">
        <img src={bodXWatermark} alt="" className="absolute z-0 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[300vw] min-h-[300vh] md:min-w-0 md:min-h-0 md:w-full md:h-full md:top-0 md:left-0 md:translate-x-0 md:translate-y-0 md:inset-0 object-contain" style={{ opacity: 0.03 }} />
        <div className="relative z-10 mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                The Indictment
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-light text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl">
              THE INDUSTRY HAS BEEN SELLING YOU THE WRONG{" "}
              <span className="text-primary">THING.</span>
            </h2>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              Most branding agencies will show you a beautiful portfolio, talk about storytelling and brand essence, take your money, and hand you a logo and a style guide. Three months later you'll have a prettier version of the same problem, because the thing that was broken wasn't your logo.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              It was the absence of a strategic foundation underneath everything. Nobody diagnosed it. Nobody fixed it. They just made it look better, sent the invoice, and moved on to the next client.
            </p>

            {/* Pull quote */}
            <div className="border-l-4 border-primary bg-foreground/5 p-6 md:p-8">
              <p className="font-mono text-base md:text-lg leading-snug text-foreground">
                Design is the output. Strategy is the engine. Every agency that skips the engine is setting their clients up to fail slower.
              </p>
            </div>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              The businesses that win aren't the ones with the best logos. They're the ones with the clearest positioning, the deepest understanding of their customer, and the most consistent expression of that understanding across every touchpoint.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">That's what Vectyr delivers.</span> Not a prettier version of what you have. A complete brand operating system, built from the actual reality of your business, distributed to your team, your vendors, and your AI tools, and maintained so it doesn't drift the moment you stop watching it.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              Built through extraction, not assumption. Delivered as infrastructure, not a document. Maintained so it doesn't decay. That is the standard we built this around, and it is the thing this industry has been unwilling to provide because the old model is more profitable.
            </p>
          </div>
        </div>
      </section>
      {/* The Founder */}
      <section className="bg-surface-white px-6 py-16 md:py-32">
        <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                The Founder
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-light text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl mb-10">
              TWENTY YEARS<br />
              BUILDING BRANDS.<br />
              <span className="text-primary">ONE CONVICTION.</span>
            </h2>

            <div className="space-y-6">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Steve Reed has spent more than two decades inside growth-stage businesses, specialty trades, professional firms, product companies, and service businesses, watching the same problem repeat itself: great companies losing to worse ones because their brand never reflected what they had actually built.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                He started Vectyr to fix that at the root. Not another logo, campaign, or redesign that produces a prettier version of the same misalignment, but the real work of finding what makes a business different, rebuilding the brand to match the caliber of what it delivers, and sourcing the voice from the customer's own language.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                That thinking became BrandHelix, Vectyr's main product and the result of twenty years of pattern recognition across hundreds of brands. BrandHelix is a Brand-Powered AI. It rebuilds a business's brand, then builds it into an AI chat the whole team can talk to, one that already holds the brand, the customer psychology, and the strategy before a word or an image goes out.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Every other AI a team opens starts from nothing and hands back the same generic work. This one runs on the brand, so the business sounds like itself without the founder approving every draft.
              </p>

              <div className="flex flex-col gap-3 mt-4">
                <a
                  href="https://stevesbrain.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-l-4 border-primary pl-4 font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Thirty minutes with Steve, no pitch →
                </a>
                <a
                  href="https://www.linkedin.com/in/stevereedbrands/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-l-4 border-primary pl-4 font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>
          </div>

          {/* Right column — photo */}
          <div className="flex flex-col items-start gap-4 md:pt-8">
            <img
              src={steveTall}
              alt="Steve Reed, Founder of Vectyr"
              className="w-full max-w-md object-cover rounded"
            />
            <div className="max-w-md">
              <p className="font-body text-lg font-bold text-foreground">Steve Reed</p>
              <p className="font-mono text-xs uppercase tracking-[0.25em] leading-relaxed text-muted-foreground mt-1">
                FOUNDER, VECTYR<br />AUSTIN, TX
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cake Jerky / Customer Perception Profile */}
      <section className="px-6 py-16 md:py-32 bg-card">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
            <span className="hidden md:block w-12 h-px bg-muted-foreground" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
              The Customer Perception Profile
            </span>
            <span className="w-12 h-px bg-muted-foreground" />
          </div>

          <h2 className="font-headline font-light text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-6xl text-center text-balance mb-12 md:mb-20">
            THE FRAMEWORK DIDN'T COME FROM A BOOK. <span className="text-primary">IT BECAME ONE.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <img
              src={cakeJerkyCpp.url}
              alt="Cake Jerky book alongside a laptop showing the BrandHelix Customer Perception Profile"
              className="w-full rounded object-cover"
              loading="lazy"
            />

            <div className="space-y-6">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                The customer psychology that runs inside every BrandHelix brand has a name: the Customer Perception Profile. Steve built it for real brand work with real clients and real stakes, then published it in <em>Cake Jerky</em> because the results were too consistent to keep proprietary.
              </p>
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Six psychological elements that map why a customer actually buys, not just who they are on paper. It is the reasoning layer BrandHelix runs on, and the reason a Vectyr brand sounds like it understands the customer better than the customer expected to be understood.
              </p>

              <div className="pt-2">
                <a href="https://buy.cakejerky.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg">Buy Cake Jerky</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="px-6 py-16 md:py-32 bg-surface-white">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
              How We Work
            </span>
            <span className="w-12 h-px bg-muted-foreground" />
          </div>

          <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl mb-8">
            LINES WE DON'T CROSS<br />
            <span className="text-primary">FOR REVENUE.</span>
          </h2>

          <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground max-w-2xl mb-16">
            Every agency has values. Most of them are decorative. These are the ones that have actually cost us money, and we'd do it the same way again.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                num: "01",
                title: "We Don't Take Clients We Can't Get Behind",
                body: "Not for cash flow. Not for a referral relationship. Not under pressure from a slow month. If we can't genuinely care about what you're building, we are not the right partner, and we'll say so directly. The wrong client relationship is worse for both sides than no relationship at all.",
              },
              {
                num: "02",
                title: "We Don't Sell Design Without Strategy",
                body: "If the positioning isn't solid, the logo doesn't get made. Clients who want to start with execution are not our clients. The order of operations is non-negotiable because it's the only order that produces work that actually holds up when the market pushes back on it.",
              },
              {
                num: "03",
                title: "We Tell You What You Need to Hear",
                body: "We tell clients what they need to hear, not what they came in wanting to hear. If their positioning is weak, we surface it. If their target customer is wrong, we say so. Comfortable lies produce expensive problems. Uncomfortable truths produce results, and that is the only version of this relationship worth having.",
              },
              {
                num: "04",
                title: "No Templates. Everything Built From the Actual Business",
                body: "Every client's Brand Genome is extracted from the actual reality of their business: their market position, their customer psychology, their competitive landscape, their culture. Nothing is assumed. Nothing is reused. The system was built for you, which means it couldn't belong to any other company, because it came from inside yours.",
              },
            ].map((card) => (
              <div key={card.num} className="bg-background border-t border-border p-8 md:p-10">
                <span className="font-mono text-3xl text-foreground/20 mb-4 block">
                  {card.num}
                </span>
                <h3 className="font-body font-semibold text-lg md:text-xl text-foreground mb-4">
                  {card.title}
                </h3>
                <p className="font-body text-sm md:text-base font-light leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative px-6 py-20 md:py-48 bg-black theme-dark overflow-hidden">
        <img src={ctaBg} alt="" className="absolute inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1600px] text-center">
          <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-[5rem] max-w-none md:max-w-[770px] md:mx-auto mb-8">
            YOU'VE BUILT SOMETHING REAL. YOUR BRAND SHOULD <span className="text-primary">SAY SO.</span>
          </h2>

          <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-12">
            Let's close that gap for you, we do it every day. The best way to start is to let us show you what we do and how it can change the game for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/demo">
              <Button size="lg">Book Demo</Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
