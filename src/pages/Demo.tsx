import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-[1300px]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            See It Live
          </span>

          <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            EXPERIENCE <span className="text-primary">BRANDOS.</span>
          </h1>

          <p className="mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
            Walk through the platform, see how your brand gets structured, and understand exactly what you're getting before you commit.
          </p>

          <div className="mt-16 bg-card p-12">
            <h3 className="font-body font-medium text-2xl leading-tight text-foreground">
              Book Your Demo
            </h3>
            <p className="mt-4 max-w-xl font-body text-sm font-light leading-relaxed text-muted-foreground">
              A 30-minute walkthrough of BrandOS tailored to your business. No pitch deck, no pressure. Just a real look at the system and how it applies to you.
            </p>
            <div className="mt-8">
              <a href="https://vectyr.com/demo">
                <Button size="lg">Schedule a Demo</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
