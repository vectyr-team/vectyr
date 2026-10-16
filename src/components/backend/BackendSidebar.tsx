import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import vectyrLogo from "@/assets/vectyr-logo-light.svg";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface Page {
  slug: string;
  name: string;
}

interface BackendSidebarProps {
  pages: Page[];
  selectedPage: string;
  onSelectPage: (slug: string) => void;
  onLogout: () => void;
}

const seoSections = [
  { slug: "seo-business", name: "Business Info", icon: "lucide:building-2" },
  { slug: "seo-schema", name: "Schema Preview", icon: "lucide:code-2" },
];

const settingsSections = [
  { slug: "admin-users", name: "Admin Users", icon: "lucide:shield" },
  { slug: "settings-chat-widget", name: "Chat Widget", icon: "lucide:message-square" },
  { slug: "settings-chat-knowledge", name: "Chat Knowledgebase", icon: "lucide:book-open" },
  { slug: "settings-chat-instructions", name: "Chat Instructions", icon: "lucide:sliders-horizontal" },
  { slug: "settings-social-links", name: "Social Links", icon: "lucide:share-2" },
  { slug: "settings-testimonials", name: "Testimonials", icon: "lucide:quote" },
];

const pageIcons: Record<string, string> = {
  index: "lucide:home",
  about: "lucide:info",
  demo: "lucide:play",
  faqs: "lucide:help-circle",
  glossary: "lucide:book-open",
  contact: "lucide:mail",
  team: "lucide:users",
  "brand-os": "lucide:layers",
  "site-ops": "lucide:settings",
  privacy: "lucide:shield-check",
};

const SidebarContent = ({
  pages,
  selectedPage,
  onSelectPage,
  onLogout,
}: BackendSidebarProps) => (
  <div className="flex flex-col h-full">
    <div className="p-6">
      <img src={vectyrLogo} alt="Vectyr" className="h-10" />
    </div>

    <nav className="flex-1 px-3 space-y-1">
      <Link
        to="/"
        className="w-full text-left px-3 py-2 rounded text-sm font-body text-muted-foreground hover:text-foreground hover:bg-card transition-colors mb-4 flex items-center gap-2"
      >
        <Icon icon="lucide:external-link" className="w-4 h-4" />
        View Site
      </Link>

      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-3 mb-2 block">
        Pages
      </span>

      {pages.map((page) => (
        <button
          key={page.slug}
          onClick={() => onSelectPage(page.slug)}
          className={`w-full text-left px-3 py-2 rounded text-sm font-body transition-colors mb-0.5 flex items-center gap-2 ${
            selectedPage === page.slug
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
        >
          <Icon icon={pageIcons[page.slug] || "lucide:file"} className="w-4 h-4" />
          {page.name}
        </button>
      ))}


      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-3 mt-6 mb-2 block pt-4">
        SEO & AEO
      </span>

      {seoSections.map((section) => (
        <button
          key={section.slug}
          onClick={() => onSelectPage(section.slug)}
          className={`w-full text-left px-3 py-2 rounded text-sm font-body transition-colors mb-0.5 flex items-center gap-2 ${
            selectedPage === section.slug
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
        >
          <Icon icon={section.icon} className="w-4 h-4" />
          {section.name}
        </button>
      ))}

      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-3 mt-6 mb-2 block pt-4">
        Settings
      </span>

      {settingsSections.map((section) => (
        <button
          key={section.slug}
          onClick={() => onSelectPage(section.slug)}
          className={`w-full text-left px-3 py-2 rounded text-sm font-body transition-colors mb-0.5 flex items-center gap-2 ${
            selectedPage === section.slug
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
        >
          <Icon icon={section.icon} className="w-4 h-4" />
          {section.name}
        </button>
      ))}
    </nav>

    <div className="p-3 border-t border-border">
      <button
        onClick={onLogout}
        className="w-full text-left px-3 py-2 rounded text-sm font-body text-muted-foreground hover:text-foreground hover:bg-card transition-colors flex items-center gap-2"
      >
        <Icon icon="lucide:log-out" className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  </div>
);

const BackendSidebar = (props: BackendSidebarProps) => {
  const [open, setOpen] = useState(false);

  const mobileOnSelect = (slug: string) => {
    props.onSelectPage(slug);
    setOpen(false);
  };

  const mobileOnLogout = () => {
    setOpen(false);
    props.onLogout();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen bg-card border-r border-border flex-col">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile hamburger trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="bg-card border border-border rounded-lg p-2 text-foreground">
              <Icon icon="lucide:menu" className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0 bg-card border-r border-border">
            <SidebarContent
              {...props}
              onSelectPage={mobileOnSelect}
              onLogout={mobileOnLogout}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default BackendSidebar;
