import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BackendSidebar from "@/components/backend/BackendSidebar";
import PageSettingsEditor from "@/components/backend/PageSettingsEditor";
import FAQsEditor from "@/components/backend/FAQsEditor";
import GlossaryEditor from "@/components/backend/GlossaryEditor";
import BusinessInfoEditor from "@/components/backend/BusinessInfoEditor";
import PageMetaSection from "@/components/backend/PageMetaSection";
import SchemaPreview from "@/components/backend/SchemaPreview";
import AdminManager from "@/components/backend/AdminManager";
import TeamEditor from "@/components/backend/TeamEditor";
import HomeHeroEditor from "@/components/backend/HomeHeroEditor";
import ChatWidgetEditor from "@/components/backend/ChatWidgetEditor";
import { clearStoredAuthSession, withTimeout } from "@/lib/supabase-guards";

interface PageSetting {
  id: string;
  page_slug: string;
  page_name: string;
  form_embed_code: string | null;
  form_script_url: string | null;
}

const SESSION_TIMEOUT_MS = 5000;
const REQUEST_TIMEOUT_MS = 8000;

const ALL_PAGES: { slug: string; name: string; metaSlug: string; path: string }[] = [
  { slug: "index", name: "Home", metaSlug: "home", path: "/" },
  { slug: "about", name: "About", metaSlug: "about", path: "/about" },
  { slug: "team", name: "Team", metaSlug: "team", path: "/team" },
  { slug: "demo", name: "Demo", metaSlug: "demo", path: "/demo" },
  { slug: "contact", name: "Contact", metaSlug: "contact", path: "/contact" },
  { slug: "faqs", name: "FAQs", metaSlug: "faqs", path: "/faqs" },
  { slug: "glossary", name: "Glossary", metaSlug: "glossary", path: "/glossary" },
  { slug: "brand-os", name: "BrandOS", metaSlug: "brand-os", path: "/brand-os" },
  { slug: "site-ops", name: "SiteOps", metaSlug: "site-ops", path: "/site-ops" },
];

const SEO_SECTIONS: Record<string, { title: string; subtitle: string }> = {
  "seo-business": { title: "Business Info", subtitle: "JSON-LD Schema Data" },
  "seo-schema": { title: "Schema Preview", subtitle: "JSON-LD Validation" },
  "admin-users": { title: "Admin Users", subtitle: "Manage Access" },
  "settings-chat-widget": { title: "Chat Widget", subtitle: "Sitewide Embed Code" },
};

const Backend = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("demo");
  const [pageSettings, setPageSettings] = useState<PageSetting[]>([]);
  const [schemaPreviewVersion, setSchemaPreviewVersion] = useState(0);
  const navigate = useNavigate();

  const handleSessionFailure = () => {
    clearStoredAuthSession();
    setSession(null);
    setIsAdmin(false);
    navigate("/backend/login");
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase.rpc("has_role", {
          _user_id: userId,
          _role: "admin",
        }),
        REQUEST_TIMEOUT_MS,
        "Admin check timed out"
      );

      if (error) throw error;

      if (!data) {
        setIsAdmin(false);
        navigate("/backend/login");
        return false;
      }

      setIsAdmin(true);
      return true;
    } catch {
      handleSessionFailure();
      return false;
    }
  };

  useEffect(() => {
    let isActive = true;
    let currentUserId: string | null = null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) return;

      if (!nextSession) {
        currentUserId = null;
        setSession(null);
        handleSessionFailure();
        setLoading(false);
        return;
      }

      // Skip re-checks when the user hasn't actually changed
      // (e.g. TOKEN_REFRESHED fires on tab focus and would cause a reload).
      if (currentUserId === nextSession.user.id) {
        setSession(nextSession);
        return;
      }

      currentUserId = nextSession.user.id;
      setSession(nextSession);
      setLoading(true);
      setTimeout(() => {
        checkAdminRole(nextSession.user.id).finally(() => {
          if (isActive) setLoading(false);
        });
      }, 0);
    });

    const syncSession = async () => {
      try {
        const { data: { session: nextSession } } = await withTimeout(
          supabase.auth.getSession(),
          SESSION_TIMEOUT_MS,
          "Session check timed out"
        );

        if (!isActive) return;

        setSession(nextSession);

        if (!nextSession) {
          handleSessionFailure();
          return;
        }

        currentUserId = nextSession.user.id;
        await checkAdminRole(nextSession.user.id);
      } catch {
        if (isActive) handleSessionFailure();
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void syncSession();

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (session) {
      void fetchPageSettings();
    }
  }, [session?.user?.id]);

  const fetchPageSettings = async () => {
    try {
      const { data, error } = await withTimeout(
        supabase.from("page_settings").select("*"),
        REQUEST_TIMEOUT_MS,
        "Timed out loading page settings"
      );
      if (error) throw error;
      if (data) setPageSettings(data);
    } catch {
      setPageSettings([]);
    }
  };

  const handleSchemaPreviewRefresh = () => {
    setSchemaPreviewVersion((current) => current + 1);
  };

  const handleLogout = async () => {
    clearStoredAuthSession();
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    navigate("/backend/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <clipPath id="hex-clip">
                <polygon points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5" />
              </clipPath>
            </defs>

            <polygon
              points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="3"
            />

            <g clipPath="url(#hex-clip)">
              <rect x="0" y="0" width="100" height="3" fill="hsl(var(--primary))">
                <animate
                  attributeName="y"
                  values="5;92;5"
                  dur="2s"
                  repeatCount="indefinite"
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                  keyTimes="0;0.1;0.5;0.9;1"
                />
              </rect>

              <circle cx="50" cy="50" r="3" fill="hsl(var(--primary))">
                <animate
                  attributeName="r"
                  values="2;5;2"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Loading
        </span>
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  const isSeoSection =
    selectedPage.startsWith("seo-") ||
    selectedPage.startsWith("admin-") ||
    selectedPage.startsWith("settings-");
  const isTeamSection = selectedPage === "team";
  const seoSection = SEO_SECTIONS[selectedPage];
  const currentSettings = pageSettings.find((p) => p.page_slug === selectedPage);
  const currentPage = ALL_PAGES.find((p) => p.slug === selectedPage);
  const hasFormSettings = selectedPage === "demo" || selectedPage === "contact";
  const isFaqsPage = selectedPage === "faqs";
  const isGlossaryPage = selectedPage === "glossary";
  const isHomePage = selectedPage === "index";

  const renderContent = () => {
    if (isSeoSection) {
      switch (selectedPage) {
        case "seo-business":
          return <BusinessInfoEditor onSaved={handleSchemaPreviewRefresh} />;
        case "seo-schema":
          return <SchemaPreview refreshToken={schemaPreviewVersion} />;
        case "admin-users":
          return <AdminManager />;
        case "settings-chat-widget":
          return <ChatWidgetEditor />;
        default:
          return null;
      }
    }

    if (isTeamSection) return <TeamEditor />;
    if (isFaqsPage) return <FAQsEditor />;
    if (isGlossaryPage) return <GlossaryEditor />;
    if (isHomePage) return <HomeHeroEditor />;

    if (hasFormSettings) {
      return (
        <PageSettingsEditor
          pageSlug={selectedPage}
          settings={currentSettings || null}
          onSaved={fetchPageSettings}
        />
      );
    }

    return null;
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
            {isSeoSection ? seoSection?.title : currentPage?.name || selectedPage}
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            {isSeoSection ? seoSection?.subtitle : `/${selectedPage === "index" ? "" : selectedPage}`}
          </p>

          {renderContent()}

          {!isSeoSection && currentPage && (
            <PageMetaSection
              pageSlug={currentPage.metaSlug}
              pageLabel={currentPage.name}
              pagePath={currentPage.path}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Backend;
