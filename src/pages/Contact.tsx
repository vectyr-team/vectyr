import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageMetaInlineEditor from "@/components/PageMetaInlineEditor";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";

const Contact = () => {
  const pageMeta = usePageMeta("contact");
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
    <div className="flex flex-col min-h-screen bg-card">
      <Header />
      <main className="flex-1">
      <SEOHead {...pageMeta} />

      <section className="px-6 pt-32 pb-12 md:pt-44 md:pb-24">
        <div className="mx-auto max-w-[1300px] text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            Contact
          </span>

          <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            LET'S <span className="text-primary">TALK.</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto font-body text-lg font-light leading-relaxed text-muted-foreground">
            Whether you're ready to start or just have questions, we're here. If you'd rather send an email, use the form below, if you want to see a cool demo and talk to a real human being on video chat <a href="/demo" className="text-primary underline hover:text-primary/80 transition-colors">click here</a>.
          </p>

          <div className="mt-6 md:mt-8 max-w-2xl mx-auto">
            <iframe
              src="https://links.vectyr.com/widget/form/0hTygOR1iqFhayLJoVHm"
              style={{ width: "100%", height: "460px", border: "none", borderRadius: "0px" }}
              id="inline-0hTygOR1iqFhayLJoVHm"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Basic Contact"
              data-height="460"
              data-layout-iframe-id="inline-0hTygOR1iqFhayLJoVHm"
              data-form-id="0hTygOR1iqFhayLJoVHm"
              title="Basic Contact"
            />
          </div>
        </div>
      </section>
      </main>
      <PageMetaInlineEditor pageSlug="contact" pageLabel="Contact" pagePath="/contact" />
      <Footer />
    </div>
  );
};

export default Contact;
