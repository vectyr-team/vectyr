import { useEffect } from "react";
import Header from "@/components/Header";

const Demo = () => {
  useEffect(() => {
    // Load the external embed script
    const script = document.createElement("script");
    script.src = "https://links.vectyr.com/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-[1300px]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            See It Live
          </span>

          <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            EXPERIENCE <span className="text-primary">BRANDOS.</span>
          </h1>

          <p className="mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
            Walk through the platform, see how your brand gets structured, and understand exactly what you're getting before you commit.
          </p>

          <div className="mt-16">
            <iframe
              src="https://links.vectyr.com/widget/booking/LNPnkvxkpEcnG3noYld1"
              style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
              scrolling="no"
              id="LNPnkvxkpEcnG3noYld1_1775760467597"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
