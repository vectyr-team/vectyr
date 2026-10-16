import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { useBusinessInfo, usePageMeta } from "@/hooks/use-seo-data";
import HeroChat from "@/components/HeroChat";

const Index = () => {
  const { data: businessInfo } = useBusinessInfo();
  const pageMeta = usePageMeta("home");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <LocalBusinessJsonLd business={businessInfo} />

        {/* Hero */}
        <section className="theme-dark relative flex min-h-dvh flex-col items-center px-6 pt-28 bg-background">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            src="/videos/vectyr-hero-bg.mp4"
            className="fixed inset-0 w-full object-cover scale-105 opacity-40 md:opacity-100"
            style={{ height: "110%", top: "-5%" }}
          />

          {/* Overlay for text readability */}
          <div className="fixed inset-0 bg-background/70" />

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1300px] mx-auto flex flex-col items-center text-center">
            <HeroChat />
          </div>
        </section>

      </main>

    </div>
  );
};

export default Index;
