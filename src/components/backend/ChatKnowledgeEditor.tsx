import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatKnowledgeEditor() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    void (async () => {
      const { data, error: loadError } = await supabase.from("chat_knowledge").select("content").eq("id", "hero").maybeSingle();
      if (!active) return;
      if (loadError) setError(loadError.message);
      else setContent(data?.content ?? "");
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { error: saveError } = await supabase.from("chat_knowledge").upsert({ id: "hero", content, updated_at: new Date().toISOString() }).select("id").single();
      if (saveError) throw saveError;
      setSaved(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Your knowledge could not be saved."); }
    finally { setSaving(false); }
  };
  if (loading) return <div className="space-y-4"><Skeleton className="h-5 w-44" /><Skeleton className="h-96 w-full" /><Skeleton className="h-10 w-32" /></div>;
  return <div className="space-y-4">
    <Label htmlFor="chat-knowledge">Knowledgebase (Markdown / XML)</Label>
    <Textarea id="chat-knowledge" value={content} onChange={(e) => { setContent(e.target.value); setSaved(false); }} rows={24} spellCheck={false} className="font-mono text-sm leading-relaxed resize-y" />
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex items-center gap-3"><Button onClick={save} disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save Knowledge"}</Button>{saved && <span role="status" className="text-sm text-muted-foreground">Saved</span>}</div>
  </div>;
}