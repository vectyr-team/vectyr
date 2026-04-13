import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ScrollSection from "@/components/ScrollSection";
import BrandCodexAnimation from "@/components/BrandCodexAnimation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const heroItems = [
  { delay: 0.6 }, // overline
  { delay: 0.8 }, // headline
  { delay: 1.1 }, // paragraph
  { delay: 1.4 }, // button
];

const Index = () => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const heroStyle = (index: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${heroItems[index].delay}s`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative flex md:min-h-[90dvh] flex-col items-center justify-center px-6 pt-36 pb-20 md:pt-20 md:py-0 overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/vectyr-hero-bg.mp4"
          className="absolute inset-0 w-full object-cover scale-105"
          style={{ height: "110%", top: "-5%" }}
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-background/70" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1300px] mx-auto flex items-center justify-between gap-12">
          <div>
            <span
              className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block"
              style={heroStyle(0)}
            >
              BRANDING FOR THE AGE OF AI
            </span>

            <h1
              className="font-headline font-light text-[3.3rem] leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-[625px]"
              style={heroStyle(1)}
            >
              YOUR BRAND IS LIVING IN YOUR HEAD. <span className="text-primary">NOWHERE ELSE.</span>
            </h1>

            <p
              className="mt-4 md:mt-8 max-w-[37rem] font-body text-base md:text-lg font-light leading-relaxed text-[#adadad]"
              style={heroStyle(2)}
            >
              Vectyr extracts your brand from wherever it's hiding, structures it so humans and AI can both actually use
              it, and installs it everywhere your team works. No more briefing vendors from memory. No more generic AI
              output that sounds like everybody else.
            </p>

            <div className="mt-10 flex gap-4" style={heroStyle(3)}>
              <a href="/demo">
                <Button size="lg">Book a Demo</Button>
              </a>
              <a href="/faqs">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          <BrandCodexAnimation visible={heroVisible} />
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="bg-card py-6 md:py-8 px-[20px]">
        <div className="mx-auto max-w-[1300px]">
          <ScrollSection className="grid grid-cols-3">
            {[
              ["Brand", "Extracted"],
              ["Team", "Aligned"],
              ["Drift", "Stopped"],
            ].map((words, i) => (
              <div key={i} className="p-8 px-0 py-0">
                <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] text-muted-foreground text-center">
                  <span className="md:hidden">
                    {words[0]}
                    <br />
                    {words[1]}
                  </span>
                  <span className="hidden md:inline">
                    {words[0]} {words[1]}
                  </span>
                </p>
              </div>
            ))}
          </ScrollSection>
        </div>
      </section>

      {/* The Full Lifecycle */}
      <section className="bg-background px-6 py-12 md:py-32">
        <div className="mx-auto max-w-[1300px]">
          <ScrollSection>
            {/* Overline with line */}
            <div className="flex items-center gap-4 mb-4 md:mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                The Full Lifecycle
              </span>
              <div className="h-px w-16 bg-muted-foreground/40" />
            </div>

            <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              MOST AGENCIES SOLVE ONE PROBLEM AND LEAVE <span className="text-primary">TWO BEHIND</span>
            </h2>

            <p className="mt-4 md:mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
              Having a strategy is step one. Getting your team to use it is step two. Keeping it current is step three.
              Vectyr uniquely solves all three.
            </p>
          </ScrollSection>

          {/* Problem cards */}
          <div className="mt-16 grid gap-px md:grid-cols-3">
            {[
              {
                num: "01",
                title: "No Strategy Exists",
                desc: "The brand lives in the founder's head, or has already fragmented across a team with no alignment. Everyone is doing their best. Nobody is working from the same source of deliberately articulated brand truth.",
                solved: "Brand Codex",
              },
              {
                num: "02",
                title: "Strategy Never Used",
                desc: "Even when a strategy exists, it just sits on a drive as a PDF or a doc waiting for someone to open it, read it, interpret it, and somehow turn it into action. That's not infrastructure, that's homework, and needless friction.",
                solved: "BrandOS Platform",
              },
              {
                num: "03",
                title: "Strategy That Goes Stale",
                desc: "Most brand strategies were built for the moment they were created and never touched again. The business evolves, the market shifts, but the strategy doesn't. Without a system to keep it current, you're back to winging it again.",
                solved: "BrandPulse",
              },
            ].map((card, i) => (
              <ScrollSection
                key={i}
                className={`relative bg-card p-8 flex flex-col justify-between min-h-[280px] border-b-2 border-b-primary border-l border-border/40 scroll-animate-delay-${i + 1}`}
              >
                <div>
                  <span className="font-mono text-sm uppercase tracking-[0.25em] text-[#424242]">
                    {card.num} / Problem
                  </span>
                  <h3 className="font-body font-semibold text-2xl leading-tight text-foreground mt-4">{card.title}</h3>
                  <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
                <p className="mt-4 font-mono uppercase tracking-[0.25em] text-primary text-xs">
                  Solved by: {card.solved}
                </p>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* The System */}
      <section className="relative bg-[#000000] px-6 py-12 md:py-32 overflow-hidden">
        <img
          src="/images/system-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.2] pointer-events-none"
        />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <ScrollSection>
            {/* Overline with line */}
            <div className="flex items-center gap-4 mb-4 md:mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">The System</span>
              <div className="h-px w-16 bg-muted-foreground/40" />
            </div>

            <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              Extracted. BUILT. INSTALLED.
            </h2>

            <p className="mt-4 md:mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
              We build your brand strategy, structure it so your team and your AI tools can both actually use it, and
              install it everywhere it needs to run before we hand anything over. Get a brand system that runs whether
              you're in the room or not.
            </p>
          </ScrollSection>

          {/* Product cards */}
          <div className="mt-16 grid gap-px md:grid-cols-3">
            {[
              {
                badge: "Start Here",
                badgeStyle: "bg-primary text-primary-foreground",
                title: "Brand Codex",
                pricing: "$4,500  /  lifetime BrandOS access",
                desc: "Done-for-you brand strategy. Vectyr runs the extraction, synthesis, and AI installation. You bring the knowledge. We build the rest. One to two sessions of your time. ",
              },
              {
                badge: "Included",
                badgeStyle: "border border-border text-muted-foreground",
                title: "BrandOS",
                pricing: "os.vectyr.com  /  lifetime access",
                desc: "The platform where the Brand Codex lives, gets distributed, and gets accessed by everyone who needs it. Your team, your vendors, your AI tools. No more briefing from memory.",
              },
              {
                badge: "Monthly",
                badgeStyle: "border border-border text-muted-foreground",
                title: "BrandPulse",
                pricing: "$195 per month / no contracts",
                desc: "90-day brand check-ins to examine the performance of the brand. You can submit new info at any time so we can update the Brand Codex and avoid brand entropy and drift.",
              },
            ].map((card, i) => (
              <ScrollSection
                key={i}
                className={`bg-card p-8 flex flex-col scroll-animate-delay-${i + 1} border-l border-border/40`}
              >
                <div>
                  <span
                    className={`inline-block px-3 py-1 font-mono text-sm uppercase tracking-[0.15em] rounded-sm ${card.badgeStyle}`}
                  >
                    {card.badge}
                  </span>
                  <h3 className="font-body font-semibold text-2xl leading-tight text-foreground mt-6">{card.title}</h3>
                  <p className="mt-4 font-mono text-sm text-muted-foreground tracking-wide">{card.pricing}</p>
                  <div className="h-px w-full my-4" style={{ backgroundColor: "#252525" }} />
                  <p className="font-body text-base leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              </ScrollSection>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a href="/demo">
              <Button size="lg">Book a Demo</Button>
            </a>
          </div>
        </div>
      </section>

      {/* The Position */}
      <section className="bg-card px-6 py-12 md:py-32">
        <div className="mx-auto max-w-[1300px] grid gap-8 md:gap-16 lg:grid-cols-[1fr_1.5fr]">
          {/* Left – sticky heading */}
          <ScrollSection className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-4 mb-4 md:mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">OUR RANT</span>
              <div className="h-px w-16 bg-muted-foreground/40" />
            </div>

            <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              "Design first, strategy never" <span className="text-primary">must die</span>
            </h2>
          </ScrollSection>

          {/* Right – long-form copy */}
          <ScrollSection className="font-body text-base leading-relaxed text-muted-foreground space-y-6 scroll-animate-delay-2">
            <p className="text-lg text-foreground font-semibold leading-relaxed">
              The branding industry has been selling you the wrong thing in the wrong order for decades, and it has been
              doing so with a smile and a proposal.
            </p>

            <p>
              Agencies lead with logos. Platforms lead with templates. AI tools lead with speed. Everyone is selling the
              output before anyone has earned the right to produce it. What you end up with is an expensive visual
              identity and no idea what you actually stand for.
            </p>

            <p>
              You've been winging it. Honestly? Hell of a run.&nbsp;But winging it doesn't scale, and somewhere in the
              back of your head you already know that.
            </p>

            <p>
              The brand that lives in your head isn't making it to your team, your vendors, or your AI tools. Every
              dollar you spend on marketing is like driving with the parking brake on.
            </p>

            <p>That's not a people problem, that's an infrastructure problem.</p>

            <p>
              The clients who stay with us for five, ten, twenty years don't come back because the logo was good. They
              come back because decisions got easier, hiring got clearer, and they stopped losing deals to competitors
              they knew they were better than.
            </p>

            <p className="text-foreground font-semibold">
              Vectyr is not for everyone. It's not for founders who want a logo and are willing to call that a brand.
              It's for the founder who has already built something real and is done making excuses for why the outside
              doesn't match the inside.
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* Results / Testimonials */}
      <section className="relative bg-[#000000] px-6 py-12 md:py-32 overflow-hidden">
        <img
          src="/images/founders.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.7] pointer-events-none"
        />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <ScrollSection>
            <div className="flex items-center gap-4 mb-4 md:mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">Results</span>
              <div className="h-px w-16 bg-muted-foreground/40" />
            </div>

            <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              WHAT BUILDERS <span className="text-primary">SAY.</span>
            </h2>
          </ScrollSection>

          <div className="mt-16 grid gap-px md:grid-cols-3">
            {[
              {
                quote:
                  "Vectyr questions, assesses and validates every assumption a company builder makes about their identity and value proposition. They build brand in the confirmed context of the market, customer needs, and the offering.",
                name: "David Clark",
                role: "Tech Startup Founder",
              },
              {
                quote:
                  "We were struggling to define our ideal customer and create a cohesive brand identity. Vectyr's expertise was instrumental in transforming our business. We now have a clear brand identity that resonates with our ideal customer.",
                name: "Tina Hancock",
                role: "Fern Thatcher Co.",
              },
              {
                quote:
                  "Monday I got to use this for the first time and ended up landing a high-paying client. We all wouldn't be surviving without you and your knowledge. You are an important piece of starting a successful business.",
                name: "Adam Layton",
                role: "Energy Home Improvements",
              },
            ].map((card, i) => (
              <ScrollSection
                key={i}
                className={`bg-card p-8 flex flex-col scroll-animate-delay-${i + 1} border-l border-border/40`}
              >
                <Icon icon="tdesign:quote-filled" className="text-primary text-3xl mb-3" />
                <p className="font-body text-base leading-relaxed text-muted-foreground flex-1">{card.quote}</p>
                <div className="mt-6">
                  <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">{card.name}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground opacity-50 mt-[9px]">
                    {card.role}
                  </p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Entry Points */}
      <section className="bg-background px-6 py-12 md:py-32">
        <div className="mx-auto max-w-[1300px]">
          <ScrollSection>
            <div className="flex items-center gap-4 mb-4 md:mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                Entry Points
              </span>
              <div className="h-px w-16 bg-muted-foreground/40" />
            </div>

            <h2 className="font-headline font-light text-[2.8rem] leading-[1.05] tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              MEET US WHERE <span className="text-primary">YOU ARE</span>
            </h2>

            <p className="mt-4 md:mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
              Vectyr has three entry points because forcing every founder through the same door loses the ones who
              aren't ready and slows down the ones who are.
            </p>
          </ScrollSection>

          <div className="mt-16 grid gap-px md:grid-cols-3">
            {[
              {
                dot: "bg-muted-foreground",
                label: "Sorta Curious",
                title: "Pick Steve's Brain",
                url: "https://stevesbrain.com",
                btnText: "Book a Free Call",
                desc: "Free 30-minute brand diagnostic. No pitch or agenda. Steve looks at your situation and gives an honest read. If you're not ready for Vectyr, he'll tell you that too.",
              },
              {
                dot: "bg-primary",
                label: "Research Mode",
                title: "See BrandOS Live",
                url: "https://vectyr.com/demo",
                btnText: "See the Demo",
                desc: "You like the concept, but you want to see it in action before deciding. Walk through BrandOS, ask questions, and get a real look at how the everything works. No pressure.",
              },
              {
                dot: "bg-primary",
                label: "Ready to Move",
                title: "Book Directly",
                url: "https://stevescalendar.com",
                btnText: "Book Now",
                desc: "You know what you want and you're asking whether Vectyr is the right fit. This is direct calendar access for serious buyers who are done doing research.",
              },
            ].map((card, i) => (
              <ScrollSection
                key={i}
                className={`bg-card p-8 flex flex-col scroll-animate-delay-${i + 1} border-l border-border/40`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className={`inline-block h-2 w-2 rounded-full ${card.dot}`} />
                  <span className="font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground/50">
                    {card.label}
                  </span>
                </div>
                <h3 className="font-body font-semibold text-2xl leading-tight text-foreground">{card.title}</h3>
                <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground flex-1">{card.desc}</p>
                <a href={card.url} className="mt-6 self-start">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {card.btnText}
                  </Button>
                </a>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-40" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="mx-auto max-w-[1300px] flex flex-col items-center text-center">
          <ScrollSection className="flex flex-col items-center">
            <h2
              className="font-headline font-light leading-[0.95] tracking-normal text-5xl md:text-6xl lg:text-7xl max-w-[830px]"
              style={{ color: "#090909" }}
            >
              YOUR Business IS BETTER THAN WHAT THE MARKET <span className="text-primary">CURRENTLY SEES.</span>
            </h2>

            <p className="mt-4 md:mt-8 max-w-xl font-body text-lg leading-relaxed" style={{ color: "#6B6B6B" }}>
              The gap between what you've built and how the market perceives it is your brand infrastructure. We build
              that infrastructure.
            </p>

            <a href="/demo" className="mt-10">
              <Button size="lg">Experience the Demo</Button>
            </a>
          </ScrollSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
