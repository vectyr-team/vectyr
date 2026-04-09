import { Link } from "react-router-dom";
import Header from "@/components/Header";
import steveTall from "@/assets/steve-tall.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-[#151616]">
      <Header />

      <section className="px-6 pt-40 pb-12 md:pt-52 md:pb-24">
        <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
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
              Most agencies start with the logo. We start with the operating system.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]">
              The strategy that tells your team, your vendors, and your AI tools exactly who you are, what you stand for, and how to communicate it without calling you first. We've watched good businesses lose to worse ones for two decades because the market rewards the brand that earns trust fastest, not the product that deserves it most.
            </p>

            <p className="font-body text-xl md:text-2xl font-semibold leading-snug text-foreground">
              BrandOS exists because that is a solvable problem, and nobody else was solving it the right way.
            </p>
          </div>
        </div>
      </section>

      {/* The Indictment */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                The Indictment
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-light text-5xl leading-[0.95] tracking-normal text-foreground sm:text-6xl md:text-7xl">
              THE INDUSTRY HAS BEEN SELLING YOU THE WRONG{" "}
              <span className="text-primary">THING.</span>
            </h2>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <p className="font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]">
              Most branding agencies will show you a beautiful portfolio, talk about storytelling and brand essence, take your money, and hand you a logo and a style guide. Three months later you'll have a prettier version of the same problem, because the thing that was broken wasn't your logo.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]">
              It was the absence of a strategic foundation underneath everything. Nobody diagnosed it. Nobody fixed it. They just made it look better, sent the invoice, and moved on to the next client.
            </p>

            {/* Pull quote */}
            <div className="border-l-4 border-primary bg-foreground/5 p-6 md:p-8">
              <p className="font-mono text-base md:text-lg leading-snug text-foreground">
                Design is the output. Strategy is the engine. Every agency that skips the engine is setting their clients up to fail slower.
              </p>
            </div>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]">
              The businesses that win aren't the ones with the best logos. They're the ones with the clearest positioning, the deepest understanding of their customer, and the most consistent expression of that understanding across every touchpoint.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]">
              <span className="font-semibold text-foreground">That's what Vectyr delivers.</span> Not a prettier version of what you have. A complete brand operating system, built from the actual reality of your business, distributed to your team, your vendors, and your AI tools, and maintained so it doesn't drift the moment you stop watching it.
            </p>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]">
              Built through extraction, not assumption. Delivered as infrastructure, not a document. Maintained so it doesn't decay. That is the standard we built this around, and it is the thing this industry has been unwilling to provide because the old model is more profitable.
            </p>
          </div>
        </div>
      </section>
      {/* The Founder */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                The Founder
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-light text-5xl leading-[0.95] tracking-normal text-foreground sm:text-6xl md:text-7xl mb-10">
              TWENTY YEARS<br />
              BUILDING BRANDS.<br />
              <span className="text-primary">ONE CONVICTION.</span>
            </h2>

            <div className="space-y-6">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Steve Reed has spent over two decades working with growth-stage businesses, specialty trades, professional firms, product companies, and service businesses, watching the same problem repeat itself. Great companies losing to worse ones because their brand didn't reflect what they'd actually built.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                He started Vectyr to solve that problem at the root, not the surface. Not logos. Not campaigns. Not redesigns that produce prettier versions of the same misalignment. <span className="font-semibold text-foreground">Complete brand operating systems, built from the actual reality of the business, delivered as infrastructure, maintained so they don't drift.</span>
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                The BrandOS methodology is the result of twenty years of pattern recognition across hundreds of brands: what works, what doesn't, and what every business needs in place before anything else can perform. It is not a framework borrowed from a book. It is the thing Steve wished every client had before he started working with them.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Steve is also the creator of the Customer Perception Profile, the proprietary psychological framework at the core of the Brand Codex methodology, published in <em>Cake Jerky</em>. He is a named methodology author, not just a practitioner with an opinion. That distinction matters when you're trusting someone with the most important document your business will ever have.
              </p>

              <div className="flex flex-col gap-3 mt-4 border-l-4 border-primary pl-4">
                <a
                  href="https://stevesbrain.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Thirty minutes with Steve, no pitch →
                </a>
                <a
                  href="https://buy.cakejerky.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Buy his book, Cake Jerky →
                </a>
                <a
                  href="https://www.linkedin.com/in/stevereed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-base font-semibold text-foreground hover:text-primary transition-colors"
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
              <p className="font-body text-base font-bold text-foreground">Steve Reed</p>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
                Founder, Vectyr &nbsp;/&nbsp; Austin, TX
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
