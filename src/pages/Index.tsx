import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { useBusinessInfo, usePageMeta } from "@/hooks/use-seo-data";
import { useHomeHero } from "@/hooks/use-home-hero";
import brandOrDieLogo from "@/assets/bodR-stacked-centered-white.svg";

const heroItems = [
  { delay: 0.6 }, // overline
  { delay: 0.8 }, // headline
  { delay: 1.1 }, // paragraph
  { delay: 1.4 }, // button
];

const Index = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const { data: businessInfo } = useBusinessInfo();
  const pageMeta = usePageMeta("home");
  const { loading: heroLoading } = useHomeHero();

  useEffect(() => {
    if (heroLoading) return;
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, [heroLoading]);

  const heroStyle = (index: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${heroItems[index].delay}s`,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <LocalBusinessJsonLd business={businessInfo} />

        {/* Hero */}
        <section className="theme-dark relative flex min-h-dvh flex-col items-center justify-center px-6 pt-36 pb-20 md:pt-20 md:py-0 overflow-hidden bg-background">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            src="/videos/vectyr-hero-bg.mp4"
            className="absolute inset-0 w-full object-cover scale-105 opacity-40 md:opacity-100"
            style={{ height: "110%", top: "-5%" }}
          />

          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-background/70" />

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1300px] mx-auto flex flex-col items-center text-center">
            <h1 className="w-full max-w-[580px] mx-auto" style={heroStyle(1)}>
              <img
                src={brandOrDieLogo}
                alt="Brand or Die"
                className="block w-full h-auto"
                width={812}
                height={408}
                fetchPriority="high"
              />
            </h1>

          </div>
        </section>

      </main>

    </div>
  );
};

export default Index;
