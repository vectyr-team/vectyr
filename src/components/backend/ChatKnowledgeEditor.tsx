import { useEffect, useState } from "react";
import { Save, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Item = { id: string; category: string; content: string };

export default function ChatKnowledgeEditor() {
  const [items, setItems] = useState<Item[]>([]);
  const [draft, setDraft] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void (async () => {
      const { data, error: loadError } = await supabase.from("chat_knowledge_items").select("id, category, content").order("created_at");
      if (!active) return;
      if (loadError) setError(loadError.message);
      else setItems(data ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const save = async () => {
    if (!draft || !draft.category.trim()) return;
    setSaving(true);
    setError("");
    try {
      const values = { category: draft.category.trim(), content: draft.content };
      const query = draft.id ? supabase.from("chat_knowledge_items").update(values).eq("id", draft.id) : supabase.from("chat_knowledge_items").insert(values);
      const { data, error: saveError } = await query.select("id, category, content").single();
      if (saveError) throw saveError;
      setItems((current) => draft.id ? current.map((item) => item.id === draft.id ? data : item) : [...current, data]);
      setDraft(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Your knowledge could not be saved."); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!deleting) return;
    setSaving(true);
    setError("");
    const { error: deleteError } = await supabase.from("chat_knowledge_items").delete().eq("id", deleting.id);
    if (deleteError) setError(deleteError.message);
    else { setItems((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); }
    setSaving(false);
  };
  if (loading) return <div className="space-y-4"><Skeleton className="h-5 w-44" /><Skeleton className="h-96 w-full" /><Skeleton className="h-10 w-32" /></div>;
  return <div className="space-y-4">
    <div className="flex justify-end"><Button onClick={() => { setError(""); setDraft({ id: "", category: "", content: "" }); }}><Plus className="mr-2 h-4 w-4" />Add Category</Button></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Table>
      <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Details</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {items.map((item) => <TableRow key={item.id}>
          <TableCell className="font-medium align-top break-words">{item.category}</TableCell>
          <TableCell className="max-w-md"><p className="line-clamp-3 whitespace-pre-wrap break-words text-muted-foreground">{item.content || "No details added"}</p></TableCell>
          <TableCell className="text-right align-top whitespace-nowrap">
            <Button variant="ghost" size="icon" aria-label={`Edit ${item.category}`} title={`Edit ${item.category}`} onClick={() => { setError(""); setDraft({ ...item }); }}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" aria-label={`Delete ${item.category}`} title={`Delete ${item.category}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4" /></Button>
          </TableCell>
        </TableRow>)}
        {items.length === 0 && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No knowledge categories yet.</TableCell></TableRow>}
      </TableBody>
    </Table>
    <Dialog open={draft !== null} onOpenChange={(open) => { if (!open && !saving) setDraft(null); }}>
      <DialogContent className="max-w-3xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{draft?.id ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="knowledge-category">Category Name</Label><Input id="knowledge-category" value={draft?.category ?? ""} disabled={saving} onChange={(e) => setDraft((current) => current ? { ...current, category: e.target.value } : null)} /></div>
          <div className="space-y-2"><Label htmlFor="chat-knowledge">Details (Markdown / XML)</Label><Textarea id="chat-knowledge" value={draft?.content ?? ""} disabled={saving} onChange={(e) => setDraft((current) => current ? { ...current, content: e.target.value } : null)} rows={16} spellCheck={false} className="font-mono text-sm leading-relaxed resize-y" /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button onClick={save} disabled={saving || !draft?.category.trim()}><Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save Category"}</Button>
        </div>
      </DialogContent>
    </Dialog>
    <AlertDialog open={deleting !== null} onOpenChange={(open) => { if (!open && !saving) setDeleting(null); }}>
      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete This Category?</AlertDialogTitle><AlertDialogDescription>This permanently removes {deleting?.category} and its details from the chat knowledgebase.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel><AlertDialogAction disabled={saving} onClick={(event) => { event.preventDefault(); void remove(); }}>{saving ? "Deleting..." : "Delete Category"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}