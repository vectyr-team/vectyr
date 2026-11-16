import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface PageSettings {
  id: string;
  page_slug: string;
  page_name: string;
  form_embed_code: string | null;
  form_script_url: string | null;
}

interface PageSettingsEditorProps {
  pageSlug: string;
  settings: PageSettings | null;
  onSaved: () => void;
}

const PageSettingsEditor = ({ pageSlug, settings, onSaved }: PageSettingsEditorProps) => {
  const [embedCode, setEmbedCode] = useState(settings?.form_embed_code || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEmbedCode(settings?.form_embed_code || "");
    setSaved(false);
    setError("");
  }, [settings, pageSlug]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const result = settings
      ? await supabase
        .from("page_settings")
        .update({ form_embed_code: embedCode })
        .eq("id", settings.id)
      : await supabase
        .from("page_settings")
        .insert({
          page_slug: pageSlug,
          page_name: pageSlug === "call" ? "Discovery Call" : pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
          form_embed_code: embedCode,
        });

    setSaving(false);
    if (result.error) {
      setError("Couldn’t save the embed. Please try again.");
      return;
    }
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-body text-base text-foreground font-medium">
        {pageSlug === "call" ? "Calendar Embed Code" : "Form Embed Code"}
      </h2>

      <div>
        <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
          Embed Code
        </label>
        <textarea
          aria-label={pageSlug === "call" ? "Calendar Embed Code" : "Form Embed Code"}
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          rows={6}
          className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono text-xs focus:outline-none focus:border-primary resize-y"
          placeholder='<iframe src="https://links.vectyr.com/widget/..." ...></iframe><script src="..."></script>'
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>

        {saved && (
          <span className="font-mono text-xs text-green-500">Saved!</span>
        )}
      </div>
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default PageSettingsEditor;
