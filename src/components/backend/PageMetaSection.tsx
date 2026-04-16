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

interface Props {
  pageSlug: string;
  pageLabel: string;
  pagePath: string;
}

const PageMetaSection = ({ pageSlug, pageLabel, pagePath }: Props) => {
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMeta = async () => {
    const { data } = await supabase
      .from("page_meta")
      .select("*")
      .eq("page_slug", pageSlug)
      .maybeSingle();
    setMeta(
      (data as PageMeta) || {
        id: "",
        page_slug: pageSlug,
        title: "",
        description: "",
        og_image: null,
      }
    );
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchMeta();
  }, [pageSlug]);

  const updateField = (field: "title" | "description" | "og_image", value: string) => {
    setMeta((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${pageSlug}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("og-images")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("og-images").getPublicUrl(path);
    updateField("og_image", publicUrl);
    toast.success("Image uploaded — click Save to apply");
    setUploading(false);
  };

  const save = async () => {
    if (!meta) return;
    setSaving(true);
    const payload = {
      page_slug: pageSlug,
      title: meta.title || "",
      description: meta.description || "",
      og_image: meta.og_image?.trim() ? meta.og_image.trim() : null,
    };
    let error;
    if (meta.id) {
      ({ error } = await supabase.from("page_meta").update(payload as any).eq("id", meta.id));
    } else {
      ({ error } = await supabase.from("page_meta").insert(payload as any));
    }
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Meta tags saved");
      fetchMeta();
    }
    setSaving(false);
  };

  const ogPreview = meta?.og_image?.trim() || OG_IMAGE;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="font-headline text-foreground text-3xl mb-1">Meta Tags</h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        SEO for {pageLabel} · {pagePath}
      </p>

      {loading ? (
        <p className="text-muted-foreground text-sm font-body">Loading...</p>
      ) : (
        <div className="space-y-4 border border-border rounded-lg p-5 bg-black02">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              Page Title{" "}
              <span className="text-muted-foreground/50">
                ({(meta?.title || "").length}/60)
              </span>
            </label>
            <Input
              value={meta?.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              maxLength={70}
              className="font-body text-sm"
              placeholder="Page title for search engines"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              Meta Description{" "}
              <span className="text-muted-foreground/50">
                ({(meta?.description || "").length}/160)
              </span>
            </label>
            <Textarea
              value={meta?.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={170}
              rows={2}
              className="font-body text-sm"
              placeholder="Brief description for search results"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              OG Image URL{" "}
              <span className="text-muted-foreground/50">
                (optional — falls back to default)
              </span>
            </label>
            <div className="flex gap-2">
              <Input
                value={meta?.og_image || ""}
                onChange={(e) => updateField("og_image", e.target.value)}
                className="font-body text-sm flex-1"
                placeholder="https://... or upload (1200x630 recommended)"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          <div className="bg-background rounded p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              Search Preview
            </p>
            <p className="text-[#8ab4f8] text-base font-body truncate">
              {meta?.title || "Page Title"}
            </p>
            <p className="text-[#bdc1c6] text-xs font-body">vectyr.com{pagePath}</p>
            <p className="text-[#9aa0a6] text-sm font-body line-clamp-2">
              {meta?.description || "Meta description..."}
            </p>
          </div>

          <div className="bg-background rounded p-3 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
              Social Share Preview{" "}
              {!meta?.og_image?.trim() && (
                <span className="text-muted-foreground/40">(default)</span>
              )}
            </p>
            <div className="aspect-[1200/630] w-full max-w-md overflow-hidden rounded border border-border bg-black01">
              <img
                src={ogPreview}
                alt={`OG preview for ${pageLabel}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageMetaSection;
