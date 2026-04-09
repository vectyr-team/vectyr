import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-24 pb-12 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-[1300px]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            About Vectyr
          </span>

          <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            THE PEOPLE BEHIND <span className="text-primary">THE SYSTEM.</span>
          </h1>

          <p className="mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
            Vectyr was built by brand strategists who got tired of watching great strategy die in a PDF. We decided to fix the infrastructure instead.
          </p>

          <div className="mt-16 grid gap-px bg-border md:grid-cols-2">
            <div className="bg-card p-8">
              <h3 className="font-body font-semibold text-2xl leading-tight text-foreground">
                Our Mission
              </h3>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                To give every founder a brand system that actually works — one that their team can use, their AI tools can read, and their business can grow into.
              </p>
            </div>
            <div className="bg-card p-8">
              <h3 className="font-body font-semibold text-2xl leading-tight text-foreground">
                Our Approach
              </h3>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                We extract, structure, and install. No fluff, no workshops that lead nowhere. Just a clear brand system built and running in weeks, not months.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link to="/contact">
              <Button size="lg">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
