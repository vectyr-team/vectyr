import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/vectyr-hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-background/60" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1300px] mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            Built for Humans and AI
          </span>

          <h1 className="font-headline text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            YOUR BRAND IS LIVING IN<br />YOUR HEAD. <span className="text-primary">NOWHERE ELSE.</span>
          </h1>

          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
            Vectyr extracts your brand from wherever it's hiding, structures it so humans and AI can both actually use it, and installs it everywhere your team works. No more briefing vendors from memory. No more AI output that sounds like your competitor.
          </p>

          <div className="mt-10 flex gap-4">
            <Button size="lg">Get BrandOS</Button>
            <Button size="lg" variant="outline">Book a Demo</Button>
          </div>
        </div>
      </section>

      {/* Villain / Brand Entropy */}
      <section className="border-t border-border bg-card px-6 py-24">
        <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-2">
          {/* Left – quote */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 block">
              The Villain &nbsp;/&nbsp; Brand Entropy
            </span>
            <blockquote className="font-body text-2xl italic leading-relaxed text-foreground md:text-3xl">
              "Your brand doesn't collapse. It becomes a little less recognizable every week, a little more generic, until one day you look at what the market sees and barely{" "}
              <span className="text-primary">recognize it.</span>"
            </blockquote>
          </div>

          {/* Right – stats grid */}
          <div className="grid grid-cols-2 gap-px bg-border">
            {[
              { value: "$4,500", desc: "Flat fee. Brand Codex built and installed." },
              { value: "1–2", desc: "Sessions of your time. Everything else is ours." },
              { value: "$195", desc: "Per month. BrandPulse keeps it current." },
              { value: "∞", desc: "Lifetime access to BrandOS. No renewal required." },
            ].map((item, i) => (
              <div key={i} className="bg-card p-8">
                <p className="font-headline text-4xl text-foreground md:text-5xl">{item.value}</p>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
