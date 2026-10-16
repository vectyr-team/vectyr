import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_CHAT_INSTRUCTIONS, MAX_CHAT_INSTRUCTIONS_LENGTH } from "../../../supabase/functions/hero-chat/instructions";

export default function ChatInstructionsEditor() {
  const [instructions, setInstructions] = useState(DEFAULT_CHAT_INSTRUCTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data, error: loadError } = await supabase.from("chat_settings").select("instructions").eq("id", "general").maybeSingle();
        if (!active) return;
        if (loadError) throw loadError;
        setInstructions(data?.instructions ?? DEFAULT_CHAT_INSTRUCTIONS);
      } catch {
        if (active) setError("Chat instructions could not be loaded. Please reload before saving.");
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const { error: saveError } = await supabase.from("chat_settings").upsert({ id: "general", instructions }).select("instructions").single();
      if (saveError) throw saveError;
      setError("");
      setSaved(true);
    } catch { setError("Your instructions could not be saved. Please try again."); }
    finally { setSaving(false); }
  };
  if (loading) return <div className="space-y-4"><Skeleton className="h-5 w-44" /><Skeleton className="h-96 w-full" /><Skeleton className="h-10 w-32" /></div>;
  return <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="chat-instructions">General Instructions</Label>
      <Textarea id="chat-instructions" value={instructions} onChange={(event) => { setInstructions(event.target.value); setSaved(false); }} rows={16} maxLength={MAX_CHAT_INSTRUCTIONS_LENGTH} disabled={saving || error.includes("reload before saving")} spellCheck={false} className="font-mono text-sm leading-relaxed resize-y" />
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {saved && <p role="status" className="text-sm text-muted-foreground">Instructions saved.</p>}
    <Button onClick={save} disabled={saving || error.includes("reload before saving")}><Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save Instructions"}</Button>
  </div>;
}