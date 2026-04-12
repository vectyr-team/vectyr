import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BackendSidebar from "@/components/backend/BackendSidebar";
import PageSettingsEditor from "@/components/backend/PageSettingsEditor";
import FAQsEditor from "@/components/backend/FAQsEditor";

interface PageSetting {
  id: string;
  page_slug: string;
  page_name: string;
  form_embed_code: string | null;
  form_script_url: string | null;
}

const ALL_PAGES = [
  { slug: "index", name: "Home" },
  { slug: "about", name: "About" },
  { slug: "demo", name: "Demo" },
  { slug: "contact", name: "Contact" },
  { slug: "faqs", name: "FAQs" },
];

const Backend = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>("demo");
  const [pageSettings, setPageSettings] = useState<PageSetting[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/backend/login");
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/backend/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) {
      fetchPageSettings();
    }
  }, [session]);

  const fetchPageSettings = async () => {
    const { data } = await supabase
      .from("page_settings")
      .select("*");
    if (data) setPageSettings(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/backend/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm">Loading...</span>
      </div>
    );
  }

  if (!session) return null;

  const currentSettings = pageSettings.find((p) => p.page_slug === selectedPage);
  const currentPage = ALL_PAGES.find((p) => p.slug === selectedPage);
  const hasFormSettings = selectedPage === "demo" || selectedPage === "contact";
  const isFaqsPage = selectedPage === "faqs";

  return (
    <div className="min-h-screen bg-background flex">
      <BackendSidebar
        pages={ALL_PAGES}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="font-headline text-3xl text-foreground mb-1">
            {currentPage?.name || selectedPage}
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            /{selectedPage === "index" ? "" : selectedPage}
          </p>

          {isFaqsPage ? (
            <FAQsEditor />
          ) : hasFormSettings ? (
            <PageSettingsEditor
              pageSlug={selectedPage}
              settings={currentSettings || null}
              onSaved={fetchPageSettings}
            />
          ) : (
            <p className="text-muted-foreground font-body text-sm">
              No configurable settings for this page yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Backend;
