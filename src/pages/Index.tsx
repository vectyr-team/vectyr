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

          <h1 className="font-headline font-normal text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
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
      <section className="bg-card px-6 py-24">
        <div className="mx-auto grid max-w-[1300px] items-center gap-16 lg:grid-cols-2">
          {/* Left – quote */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 block">
              THE VILLAIN / BRAND ENTROPY
            </span>
            <blockquote className="font-body text-xl font-light italic leading-relaxed text-foreground md:text-2xl">
              "Your brand doesn't collapse all at onece. It becomes a little less recognizable every week, a little more generic, until one day you look at what the market sees and barely{" "}
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

      {/* The Full Lifecycle */}
      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-[1300px]">
          {/* Overline with line */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              The Full Lifecycle
            </span>
            <div className="h-px w-16 bg-muted-foreground/40" />
          </div>

          <h2 className="font-headline font-normal text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
            MOST AGENCIES SOLVE ONE PROBLEM AND LEAVE TWO BEHIND
          </h2>

          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
            Having a strategy is step one. Getting your team to use it is step two. Keeping it current is step three. Vectyr solves all three.
          </p>

          {/* Problem cards */}
          <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
            {[
              {
                num: "01",
                title: "No Strategy Exists",
                desc: "The brand lives in the founder's head, or has already fragmented across a team with no alignment. Everyone is doing their best. Nobody is working from the same document.",
                solved: "Brand Codex",
              },
              {
                num: "02",
                title: "Strategy Never Used",
                desc: "Even when a strategy exists, it lives in a folder nobody opens. Unavailable to the freelancer at 9pm. Invisible to the AI tool writing tomorrow's social post. Unknown to the new hire who started last week.",
                solved: "BrandOS Platform",
              },
              {
                num: "03",
                title: "Strategy That Goes Stale",
                desc: "The moment the business changes, the market shifts, or a new competitor arrives, the previous strategy can go obsolete. Most founders have no way to know when that's happened or what to do about it.",
                solved: "BrandPulse",
              },
            ].map((card, i) => (
              <div key={i} className="relative bg-card p-8 flex flex-col justify-between min-h-[320px] border-b-2 border-primary">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {card.num} / Problem
                  </span>
                  <h3 className="font-body font-medium text-2xl leading-tight text-foreground mt-4">
                    {card.title}
                  </h3>
                  <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                    {card.desc}
                  </p>
                </div>
                <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  Solved by: {card.solved}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The System */}
      <section className="relative bg-[#000000] px-6 py-24 overflow-hidden">
        <img src="/images/system-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.2] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          {/* Overline with line */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              The System
            </span>
            <div className="h-px w-16 bg-muted-foreground/40" />
          </div>

          <h2 className="font-headline font-normal text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
            BUILT. INSTALLED. RUNNING.
          </h2>

          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
            Three products, one complete solution. Your brand doesn't sit in a folder, it lives everywhere, it runs, it never goes stale.
          </p>

          {/* Product cards */}
          <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
            {[
              {
                badge: "Start Here",
                badgeStyle: "bg-primary text-primary-foreground",
                title: "Brand Codex",
                pricing: "$4,500 flat  /  includes lifetime BrandOS access",
                desc: "Done-for-you brand strategy. Vectyr runs the extraction, synthesis, and AI installation. You bring the knowledge. We build the rest. One to two sessions of your time. Everything else is handled.",
              },
              {
                badge: "Included",
                badgeStyle: "border border-border text-muted-foreground",
                title: "BrandOS",
                pricing: "os.vectyr.com  /  lifetime access",
                desc: "The platform where the Brand Codex lives, gets distributed, and gets accessed by everyone who needs it. Your team, your vendors, your AI tools. One place. One source. No more briefing from memory.",
              },
              {
                badge: "Monthly",
                badgeStyle: "border border-border text-muted-foreground",
                title: "BrandPulse",
                pricing: "$195 per month  /  no long contracts",
                desc: "Quarterly brand review. Drift caught before it compounds. Brand Performance Indicator report after every cycle. One advisory credit per quarter for fast gut-checks between scheduled calls. The brand keeps running.",
              },
            ].map((card, i) => (
              <div key={i} className="bg-card p-8 flex flex-col">
                <div>
                  <span className={`inline-block px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] rounded-sm ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                  <h3 className="font-body font-medium text-2xl leading-tight text-foreground mt-6">
                    {card.title}
                  </h3>
                  <p className="mt-4 font-mono text-xs text-muted-foreground tracking-wide">
                    {card.pricing}
                  </p>
                  <div className="h-px w-full bg-border/30 my-6" />
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
