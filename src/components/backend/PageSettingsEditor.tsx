import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [scriptUrl, setScriptUrl] = useState(settings?.form_script_url || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEmbedCode(settings?.form_embed_code || "");
    setScriptUrl(settings?.form_script_url || "");
    setSaved(false);
  }, [settings, pageSlug]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    if (settings) {
      await supabase
        .from("page_settings")
        .update({ form_embed_code: embedCode, form_script_url: scriptUrl })
        .eq("id", settings.id);
    } else {
      await supabase
        .from("page_settings")
        .insert({
          page_slug: pageSlug,
          page_name: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
          form_embed_code: embedCode,
          form_script_url: scriptUrl,
        });
    }

    setSaving(false);
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Form Embed Settings
      </h2>

      <div>
        <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
          Embed URL / Code
        </label>
        <textarea
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          rows={3}
          className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono text-xs focus:outline-none focus:border-primary resize-y"
          placeholder="https://links.vectyr.com/widget/..."
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
          Script URL
        </label>
        <input
          type="text"
          value={scriptUrl}
          onChange={(e) => setScriptUrl(e.target.value)}
          className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono text-xs focus:outline-none focus:border-primary"
          placeholder="https://links.vectyr.com/js/form_embed.js"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-2.5 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {saved && (
          <span className="font-mono text-xs text-green-500">Saved!</span>
        )}
      </div>
    </div>
  );
};

export default PageSettingsEditor;
