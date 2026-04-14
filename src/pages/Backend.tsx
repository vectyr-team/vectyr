import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BackendSidebar from "@/components/backend/BackendSidebar";
import PageSettingsEditor from "@/components/backend/PageSettingsEditor";
import FAQsEditor from "@/components/backend/FAQsEditor";
import BusinessInfoEditor from "@/components/backend/BusinessInfoEditor";
import MetaTagsEditor from "@/components/backend/MetaTagsEditor";
import SchemaPreview from "@/components/backend/SchemaPreview";
import AdminManager from "@/components/backend/AdminManager";
import TeamEditor from "@/components/backend/TeamEditor";

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

const SEO_SECTIONS: Record<string, { title: string; subtitle: string }> = {
  "seo-business": { title: "Business Info", subtitle: "JSON-LD Schema Data" },
  "seo-meta": { title: "Meta Tags", subtitle: "Per-Page SEO" },
  "seo-schema": { title: "Schema Preview", subtitle: "JSON-LD Validation" },
  "admin-users": { title: "Admin Users", subtitle: "Manage Access" },
};

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
    const { data } = await supabase.from("page_settings").select("*");
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

  const isSeoSection = selectedPage.startsWith("seo-") || selectedPage.startsWith("admin-");
  const isTeamSection = selectedPage === "team";
  const seoSection = SEO_SECTIONS[selectedPage];
  const currentSettings = pageSettings.find((p) => p.page_slug === selectedPage);
  const currentPage = ALL_PAGES.find((p) => p.slug === selectedPage);
  const hasFormSettings = selectedPage === "demo" || selectedPage === "contact";
  const isFaqsPage = selectedPage === "faqs";

  const renderContent = () => {
    if (isSeoSection) {
      switch (selectedPage) {
        case "seo-business":
          return <BusinessInfoEditor />;
        case "seo-meta":
          return <MetaTagsEditor />;
        case "seo-schema":
          return <SchemaPreview />;
        case "admin-users":
          return <AdminManager />;
        default:
          return null;
      }
    }

    if (isTeamSection) return <TeamEditor />;

    if (isFaqsPage) return <FAQsEditor />;

    if (hasFormSettings) {
      return (
        <PageSettingsEditor
          pageSlug={selectedPage}
          settings={currentSettings || null}
          onSaved={fetchPageSettings}
        />
      );
    }

    return (
      <p className="text-muted-foreground font-body text-sm">
        No configurable settings for this page yet.
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BackendSidebar
        pages={ALL_PAGES}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        onLogout={handleLogout}
      />

      <main className="flex-1 px-6 pb-8 md:pt-12 md:px-12 md:pb-12 overflow-y-auto pt-[72px]">
        <div className="max-w-2xl">
          <h1 className="font-headline text-foreground mb-1 text-5xl">
            {isSeoSection ? seoSection?.title : isTeamSection ? "Team" : currentPage?.name || selectedPage}
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            {isSeoSection ? seoSection?.subtitle : isTeamSection ? "Manage Team Members" : `/${selectedPage === "index" ? "" : selectedPage}`}
          </p>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Backend;
