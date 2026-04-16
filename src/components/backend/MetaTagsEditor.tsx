import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { OG_IMAGE } from "@/config/seo";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface PageMeta {
  id: string;
  page_slug: string;
  title: string;
  description: string;
  og_image: string | null;
}

const ALL_PAGES = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "about", label: "About", path: "/about" },
  { slug: "team", label: "Team", path: "/team" },
  { slug: "demo", label: "Demo", path: "/demo" },
  { slug: "contact", label: "Contact", path: "/contact" },
  { slug: "faqs", label: "FAQs", path: "/faqs" },
  { slug: "brand-os", label: "BrandOS", path: "/brand-os" },
  { slug: "site-ops", label: "SiteOps", path: "/site-ops" },
];

const MetaTagsEditor = () => {
  const [metas, setMetas] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleUpload = async (slug: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploadingSlug(slug);
    const ext = file.name.split(".").pop() || "png";
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("og-images")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploadingSlug(null);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("og-images").getPublicUrl(path);
    updateField(slug, "og_image", publicUrl);
    toast.success("Image uploaded — click Save to apply");
    setUploadingSlug(null);
  };

  const fetchMetas = async () => {
    const { data } = await supabase.from("page_meta").select("*");
    if (data) setMetas(data as unknown as PageMeta[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const getMetaForSlug = (slug: string) => metas.find((m) => m.page_slug === slug);

  const updateField = (
    slug: string,
    field: "title" | "description" | "og_image",
    value: string
  ) => {
    setMetas((prev) => {
      const exists = prev.some((m) => m.page_slug === slug);
      if (!exists) {
        return [
          ...prev,
          { id: "", page_slug: slug, title: "", description: "", og_image: null, [field]: value } as PageMeta,
        ];
      }
      return prev.map((m) => (m.page_slug === slug ? { ...m, [field]: value } : m));
    });
  };

  const save = async (slug: string) => {
    const meta = getMetaForSlug(slug);
    setSavingSlug(slug);

    const payload = {
      page_slug: slug,
      title: meta?.title || "",
      description: meta?.description || "",
      og_image: meta?.og_image?.trim() ? meta.og_image.trim() : null,
    };

    let error;
    if (meta?.id) {
      ({ error } = await supabase
        .from("page_meta")
        .update(payload as any)
        .eq("id", meta.id));
    } else {
      ({ error } = await supabase.from("page_meta").insert(payload as any));
    }

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Meta tags saved");
      fetchMetas();
    }
    setSavingSlug(null);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-8">
      {ALL_PAGES.map((page) => {
        const meta = getMetaForSlug(page.slug);
        const ogPreview = meta?.og_image?.trim() || OG_IMAGE;
        return (
          <div key={page.slug} className="border border-border rounded-lg p-4 space-y-3 bg-black02">
            <h2 className="font-body text-lg text-foreground font-medium">
              {page.label} — {page.path}
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

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                OG Image URL <span className="text-muted-foreground/50">(optional — falls back to default)</span>
              </label>
              <Input
                value={meta?.og_image || ""}
                onChange={(e) => updateField(page.slug, "og_image", e.target.value)}
                className="font-body text-sm"
                placeholder="https://... (1200x630 recommended)"
              />
            </div>

            {/* Search preview */}
            <div className="bg-background rounded p-3 space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
                Search Preview
              </p>
              <p className="text-[#8ab4f8] text-base font-body truncate">{meta?.title || "Page Title"}</p>
              <p className="text-[#bdc1c6] text-xs font-body">vectyr.com{page.path}</p>
              <p className="text-[#9aa0a6] text-sm font-body line-clamp-2">
                {meta?.description || "Meta description..."}
              </p>
            </div>

            {/* OG image preview */}
            <div className="bg-background rounded p-3 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                Social Share Preview {!meta?.og_image?.trim() && <span className="text-muted-foreground/40">(default)</span>}
              </p>
              <div className="aspect-[1200/630] w-full max-w-md overflow-hidden rounded border border-border bg-black01">
                <img
                  src={ogPreview}
                  alt={`OG preview for ${page.label}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
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
