import Header from "@/components/Header";

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
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 block">
              The Indictment ————
            </span>

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
              <p className="font-headline text-xl md:text-2xl leading-snug text-foreground uppercase">
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
    </div>
  );
};

export default About;
