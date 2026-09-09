import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface LegalPageEditorProps {
  pageSlug: string;
  defaultTitle: string;
}

const LegalPageEditor = ({ pageSlug, defaultTitle }: LegalPageEditorProps) => {
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("legal_pages")
        .select("*")
        .eq("page_slug", pageSlug)
        .maybeSingle();

      if (!isActive) return;
      if (data) {
        setId(data.id);
        setTitle(data.title || defaultTitle);
        setContent(data.content || "");
      }
      setLoading(false);
    };

    void load();
    return () => {
      isActive = false;
    };
  }, [pageSlug, defaultTitle]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    if (id) {
      await supabase.from("legal_pages").update({ title, content }).eq("id", id);
    } else {
      const { data } = await supabase
        .from("legal_pages")
        .insert({ page_slug: pageSlug, title, content })
        .select()
        .maybeSingle();
      if (data) setId(data.id);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
          Page Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Content (Markdown)
          </label>
          <button
            onClick={() => setPreview((p) => !p)}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[400px] bg-background border border-border rounded px-4 py-3 font-body text-sm text-muted-foreground leading-relaxed space-y-3 [&_h1]:text-foreground [&_h1]:text-xl [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:mt-6 [&_h3]:text-foreground [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "_Nothing to preview yet._"}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            placeholder={"## Section heading\n\nYour policy text. Use **bold**, [links](https://vectyr.com), and bullet lists:\n\n- Item one\n- Item two"}
            className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono text-xs leading-relaxed focus:outline-none focus:border-primary resize-y"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-2.5 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="font-mono text-xs text-green-500">Saved!</span>}
      </div>
    </div>
  );
};

export default LegalPageEditor;
