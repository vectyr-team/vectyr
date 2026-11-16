import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePageMeta } from "@/hooks/use-seo-data";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Demo = () => {
  const pageMeta = usePageMeta("call");
  const embedRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const scripts: HTMLScriptElement[] = [];
    const load = async () => {
      try {
        const { data, error: loadError } = await supabase.rpc("get_discovery_call_embed");
        if (!active) return;
        if (loadError) throw loadError;
        const container = embedRef.current;
        if (!container) return;
        const settings = data?.[0];
        const template = document.createElement("template");
        template.innerHTML = settings?.form_embed_code || "";
        const embeddedScripts = Array.from(template.content.querySelectorAll("script"));
        embeddedScripts.forEach((script) => script.remove());
        template.content.querySelectorAll("iframe").forEach((frame) => {
          frame.style.width = "100%";
          frame.style.maxWidth = "100%";
          if (!frame.title) frame.title = "Discovery Call";
        });
        container.replaceChildren(template.content.cloneNode(true));
        const appendScript = (source: HTMLScriptElement) => {
          const script = document.createElement("script");
          Array.from(source.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
          script.textContent = source.textContent;
          scripts.push(script);
          container.appendChild(script);
        };
        embeddedScripts.forEach(appendScript);
        if (settings?.form_script_url && !embeddedScripts.some((script) => script.src === settings.form_script_url)) {
          const script = document.createElement("script");
          script.src = settings.form_script_url;
          appendScript(script);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();

    return () => {
      active = false;
      scripts.forEach((script) => script.remove());
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />

        <section className="px-6 pt-32 pb-12 md:pt-44 md:pb-24">
          <div className="mx-auto max-w-[1300px]">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">LET'S TALK</span>

            <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
              Discovery <span className="text-primary">Call</span>
            </h1>

            <p className="mt-4 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground mb-[20px]">
              Got a brand, website, or marketing problem that won’t go away? Book a discovery call with Steve Reed at Vectyr and let’s figure out the fix together.
            </p>

            <div className="mt-6 md:mt-8">
              {loading && <Skeleton className="h-[700px] w-full" />}
              {error && <p role="alert" className="text-muted-foreground">The calendar couldn’t load. Please refresh and try again.</p>}
              <div ref={embedRef} className={loading ? "hidden" : "w-full"} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
