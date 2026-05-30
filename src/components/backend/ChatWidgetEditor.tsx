import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface SiteWidget {
  id: string;
  chat_widget_code: string;
  enabled: boolean;
}

const ChatWidgetEditor = () => {
  const [widget, setWidget] = useState<SiteWidget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWidget = async () => {
      const { data } = await supabase
        .from("site_widgets")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setWidget(data as SiteWidget);
      setLoading(false);
    };
    fetchWidget();
  }, []);

  const save = async () => {
    if (!widget) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_widgets")
      .update({
        chat_widget_code: widget.chat_widget_code,
        enabled: widget.enabled,
      })
      .eq("id", widget.id);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Chat widget saved. Reload the public site to see changes.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 border border-border rounded-lg p-5 bg-black02">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  if (!widget) {
    return <p className="text-muted-foreground text-sm font-body">No widget config found.</p>;
  }

  return (
    <div className="space-y-5 border border-border rounded-lg p-5 bg-black02">
      <div className="flex items-center justify-between">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">
            Enabled
          </label>
          <p className="text-xs text-muted-foreground font-body">
            Toggle to show or hide the chat widget across the site.
          </p>
        </div>
        <Switch
          checked={widget.enabled}
          onCheckedChange={(checked) =>
            setWidget((prev) => (prev ? { ...prev, enabled: checked } : prev))
          }
        />
      </div>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
          Embed code
        </label>
        <Textarea
          value={widget.chat_widget_code}
          onChange={(e) =>
            setWidget((prev) =>
              prev ? { ...prev, chat_widget_code: e.target.value } : prev
            )
          }
          rows={10}
          spellCheck={false}
          className="font-mono text-xs"
          placeholder="<script src='...'></script>"
        />
        <p className="text-xs text-muted-foreground font-body mt-2">
          Paste the provider's full embed snippet (script tags supported). Loads on every public page.
        </p>
      </div>

      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default ChatWidgetEditor;