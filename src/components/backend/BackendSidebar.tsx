import { Icon } from "@iconify/react";

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

const BackendSidebar = ({ pages, selectedPage, onSelectPage, onLogout }: BackendSidebarProps) => {
  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <span className="font-headline text-xl text-foreground">VECTYR</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-2">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3">
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
            <Icon
              icon={
                page.slug === "index"
                  ? "lucide:home"
                  : page.slug === "about"
                  ? "lucide:info"
                  : page.slug === "demo"
                  ? "lucide:play"
                  : "lucide:mail"
              }
              className="w-4 h-4"
            />
            {page.name}
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
    </aside>
  );
};

export default BackendSidebar;
