import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";

const Demo = () => {
  const pageMeta = usePageMeta("demo");
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://links.vectyr.com/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />

        <section className="px-6 pt-32 pb-12 md:pt-44 md:pb-24">
          <div className="mx-auto max-w-[1300px]">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">BrandHelix.ai Demo</span>

            <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
              Experience <span className="text-primary">BrandHelix.ai</span>
            </h1>

            <p className="mt-4 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground mb-[20px]">
              Walk through the platform, see how your brand gets built, how your whole team can access your
              Brand-Powered AI, and see if it's a good fit.
            </p>

            <div className="mt-6 md:mt-8">
              <iframe
                src="https://links.vectyr.com/widget/booking/LNPnkvxkpEcnG3noYld1"
                style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
                scrolling="no"
                id="LNPnkvxkpEcnG3noYld1_1775760467597"
                title="Book a BrandHelix.ai Demo"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
