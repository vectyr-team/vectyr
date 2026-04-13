import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PageMeta {
  id: string;
  page_slug: string;
  title: string;
  description: string;
}

const ALL_PAGES = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "demo", label: "Demo" },
  { slug: "contact", label: "Contact" },
  { slug: "faqs", label: "FAQs" },
];

const MetaTagsEditor = () => {
  const [metas, setMetas] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  const fetchMetas = async () => {
    const { data } = await supabase.from("page_meta").select("*");
    if (data) setMetas(data as unknown as PageMeta[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const getMetaForSlug = (slug: string) => metas.find((m) => m.page_slug === slug);

  const updateField = (slug: string, field: "title" | "description", value: string) => {
    setMetas((prev) =>
      prev.map((m) => (m.page_slug === slug ? { ...m, [field]: value } : m))
    );
  };

  const save = async (slug: string) => {
    const meta = getMetaForSlug(slug);
    if (!meta) {
      // Insert new
      setSavingSlug(slug);
      const page = ALL_PAGES.find((p) => p.slug === slug);
      const { error } = await supabase.from("page_meta").insert({
        page_slug: slug,
        title: "",
        description: "",
      } as any);
      if (error) toast.error("Failed to save");
      else toast.success(`${page?.label} meta saved`);
      setSavingSlug(null);
      fetchMetas();
      return;
    }

    setSavingSlug(slug);
    const { error } = await supabase
      .from("page_meta")
      .update({ title: meta.title, description: meta.description } as any)
      .eq("id", meta.id);
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Meta tags saved");
    }
    setSavingSlug(null);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-8">
      {ALL_PAGES.map((page) => {
        const meta = getMetaForSlug(page.slug);
        return (
          <div key={page.slug} className="border border-border rounded-lg p-4 space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {page.label} — /{page.slug === "home" ? "" : page.slug}
            </h2>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                Page Title <span className="text-muted-foreground/50">({(meta?.title || "").length}/60)</span>
              </label>
              <Input
                value={meta?.title || ""}
                onChange={(e) => updateField(page.slug, "title", e.target.value)}
                maxLength={70}
                className="font-body text-sm"
                placeholder="Page title for search engines"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                Meta Description <span className="text-muted-foreground/50">({(meta?.description || "").length}/160)</span>
              </label>
              <Textarea
                value={meta?.description || ""}
                onChange={(e) => updateField(page.slug, "description", e.target.value)}
                maxLength={170}
                rows={2}
                className="font-body text-sm"
                placeholder="Brief description for search results"
              />
            </div>

            {/* Google preview */}
            <div className="bg-background rounded p-3 space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">Search Preview</p>
              <p className="text-[#8ab4f8] text-base font-body truncate">{meta?.title || "Page Title"}</p>
              <p className="text-[#bdc1c6] text-xs font-body">
                vectyr.lovable.app › {page.slug === "home" ? "" : page.slug}
              </p>
              <p className="text-[#9aa0a6] text-sm font-body line-clamp-2">{meta?.description || "Meta description..."}</p>
            </div>

            <Button size="sm" onClick={() => save(page.slug)} disabled={savingSlug === page.slug}>
              {savingSlug === page.slug ? "Saving..." : "Save"}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default MetaTagsEditor;
