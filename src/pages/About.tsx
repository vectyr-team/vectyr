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
              TWENTY YEARS.{" "}
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
    </div>
  );
};

export default About;
