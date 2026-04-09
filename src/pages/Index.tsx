import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center overflow-hidden">
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
        <div className="relative z-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            Built for Humans and AI
          </span>

          <h1 className="font-headline text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
            YOUR BRAND IS LIVING IN YOUR HEAD. NOWHERE ELSE.
          </h1>

          <p className="mt-8 mx-auto max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
            Vectyr extracts your brand from wherever it's hiding, structures it so humans and AI can both actually use it, and installs it everywhere your team works. No more briefing vendors from memory. No more AI output that sounds like your competitor.
          </p>

          <Button size="lg" className="mt-10 rounded-full px-8 text-base font-semibold">
            Book a Demo
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
