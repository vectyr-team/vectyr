import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-seo-data";
import { withTimeout } from "@/lib/supabase-guards";
import { Skeleton } from "@/components/ui/skeleton";

const Terms = () => {
  const [title, setTitle] = useState("Terms of Service");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const pageMeta = usePageMeta("terms");

  useEffect(() => {
    let isActive = true;

    const fetchPage = async () => {
      try {
        const { data, error } = await withTimeout(
          supabase.from("legal_pages").select("*").eq("page_slug", "terms").maybeSingle(),
          8000,
          "Timed out loading terms of service"
        );
        if (error) throw error;
        if (data && isActive) {
          setTitle(data.title || "Terms of Service");
          setContent(data.content || "");
        }
      } catch {
        // keep defaults
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetchPage();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-card text-foreground">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          
          <h1 className="font-headline text-5xl md:text-7xl font-normal text-foreground mb-12">{title}</h1>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className={i % 4 === 0 ? "h-6 w-1/3" : "h-4 w-full"} />
              ))}
            </div>
          ) : content.trim() ? (
            <div
              className="font-body text-muted-foreground leading-relaxed space-y-4
                [&_h2]:font-body [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:mt-10 [&_h2]:mb-3
                [&_h3]:font-body [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-2
                [&_a]:text-primary [&_a]:underline
                [&_strong]:text-foreground
                [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  a: ({ href, children }) =>
                    href?.startsWith("mailto:") ? <span>{children}</span> : <a href={href}>{children}</a>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground font-body text-sm">These terms have not been published yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
