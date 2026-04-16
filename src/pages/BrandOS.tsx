import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";
import { Button } from "@/components/ui/button";
import bodXWatermark from "@/assets/bodX-watermark.svg";

const features = [
  "Lifetime access included with every Brand Codex build (no extra cost)",
  "Role-based access control so everyone sees only what they should",
  "Centralized brand assets and AI installation files everyone can use",
  "Version control and team notifications so everybody stays up to date",
  "Built-in effortless distribution for humans eyes and AI tools alike",
  "BrandPulse subscribers keep their brand strategy sharp and current",
];

const problems = [
  "The freelancer can't remember everything you told them.",
  "The content creator is going rogue.",
  "The AI tool generates output from a blank context window.",
  "Everyone is doing their best, but no one is working from the same instantly accessible source of truth.",
];

const howSteps = [
  "Your completed Brand Codex is published as the single source of truth, a complete knowledgebase, inside BrandOS.",
  "You invite team members, vendors, and contractors by role with access scoped to exactly what they need.",
  "Brand assets, guidelines, templates, and AI installation files are centralized and one click away for everybody on the team.",
  "Version control tracks every published update with labels and check-in status. Notifications keep the team aligned when things change.",
  "Anyone can pull the exact brand context needed for their AI tool directly from the platform with no separate briefing required.",
];

const BrandOS = () => {
  const pageMeta = usePageMeta("brand-os");
  return (
    <div className="flex flex-col min-h-screen bg-card">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />

        {/* Hero */}
        <section className="relative px-6 pt-32 pb-16 md:pt-52 md:pb-28 overflow-hidden">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            src="/videos/vectyr-hero-bg.mp4"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-background/70" />

          <div className="relative z-10 mx-auto max-w-[1300px]">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">The Platform</span>

            <h1 className="font-headline font-normal text-5xl leading-[0.95] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mb-8">
              Brand<span className="text-primary">OS</span>
            </h1>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground max-w-2xl">
              BrandOS puts your brand where it actually matters: inside the tools your team uses every day, inside the
              AI prompts that generate your next piece of content, and inside the briefings your vendors read before
              they start work.
            </p>

            <p className="font-body text-base md:text-lg font-semibold text-foreground mt-6 max-w-2xl">
              That is what installed looks like.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <Link to="/demo">
                <Button size="lg">See BrandOS in Action</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="relative px-6 py-16 md:py-32 bg-background overflow-hidden">
          <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                  The Problem
                </span>
                <span className="w-12 h-px bg-muted-foreground" />
              </div>

              <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl">
                Your Brand Strategy Exists. <span className="text-primary">It Doesn't Get Used.</span>
              </h2>
            </div>

            <div className="space-y-6 md:pt-8">
              <div className="space-y-4">
                {problems.map((p, i) => (
                  <p
                    key={i}
                    className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="border-l-4 border-primary bg-foreground/5 p-6 md:p-8">
                <p className="font-mono text-base md:text-lg leading-snug text-foreground">
                  Brand entropy wins by default.
                </p>
              </div>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                BrandOS ends that. It is the operating environment built specifically around your Brand Codex. It turns
                a single authoritative document into something every human and every AI tool can access and use
                correctly without you having to explain it again.
              </p>
            </div>
          </div>
        </section>

        {/* How BrandOS Works */}
        <section className="px-6 py-16 md:py-32 bg-card">
          <div className="mx-auto max-w-[1300px]">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                How It Works
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl mb-16">
              From Codex To <span className="text-primary">Infrastructure.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {howSteps.map((step, i) => (
                <div key={i} className="space-y-3">
                  <span className="font-mono text-2xl text-foreground/20 block">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <p className="font-body text-base md:text-lg font-semibold text-foreground mt-10 max-w-2xl">
              The result: consistency stops being something you police and starts being something that simply happens.
            </p>
          </div>
        </section>

        {/* What Makes BrandOS Different */}
        <section className="relative px-6 py-16 md:py-32 bg-background overflow-hidden">
          <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                  The Difference
                </span>
                <span className="w-12 h-px bg-muted-foreground" />
              </div>

              <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl">
                Not a Filing Cabinet.
                <br />
                <span className="text-primary">An Infrastructure Layer.</span>
              </h2>
            </div>

            <div className="space-y-6 md:pt-8">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Most platforms store assets and call it brand management. BrandOS distributes a living strategy.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                It was built from the ground up around the Brand Codex structure. Other tools assume you already have a
                documented brand and just need a nicer folder. BrandOS assumes the real work is making that strategy
                accessible to the people and tools that actually produce your brand every day.
              </p>

              <div className="border-l-4 border-primary bg-foreground/5 p-6 md:p-8">
                <p className="font-mono text-base md:text-lg leading-snug text-foreground">
                  It is not a digital filing cabinet. It is the infrastructure layer between your strategy and the work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="px-6 py-16 md:py-32 bg-card">
          <div className="mx-auto max-w-[1300px] max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                Who It's For
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl mb-8">
              Built for Every <span className="text-primary">Brand.</span>
            </h2>

            <div className="space-y-6 max-w-[700px]">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Every AI tool you're using right now is producing output from a blank context window. It doesn't know
                what your brand sounds like, what it stands for, or who it's for, so it guesses. BrandOS gives every
                tool and every person who touches your brand the same source of truth to work from.
              </p>
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                That matters if it's just you. It matters more the second anyone else is involved, because without it,
                your employees, freelancers, contractors, and AI tools are each building a slightly different version of
                your brand in real time.
              </p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="px-6 py-16 md:py-32 bg-background">
          <div className="mx-auto max-w-[1300px]">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                What You Get
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl mb-12">
              Everything <span className="text-primary">Included.</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-px bg-border/0">
              {features.map((feat, i) => (
                <div key={i} className="bg-card p-6 md:p-8 flex items-start gap-4">
                  <span className="text-primary mt-1 shrink-0">✓</span>
                  <p className="font-body text-base font-light leading-relaxed text-muted-foreground">{feat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 bg-white md:py-[100px]">
          <div className="mx-auto flex flex-col items-center text-center" style={{ maxWidth: 710 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "#6B6B6B" }}>
                Get Started
              </span>
              <span className="w-12 h-px" style={{ backgroundColor: "#6B6B6B" }} />
            </div>

            <h2
              className="font-headline font-normal text-4xl leading-[0.95] tracking-normal sm:text-5xl md:text-7xl mb-4"
              style={{ color: "#090909" }}
            >
              Stop Being the Only Person Who Knows. <span className="text-primary">Install It.</span>
            </h2>

            <div className="space-y-2 max-w-lg mx-auto">
              <p className="font-body text-base md:text-lg font-light" style={{ color: "#6B6B6B" }}>
                Your brand should run without you having to check it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <Link to="/demo">
                <Button size="lg">See BrandOS in Action</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrandOS;
