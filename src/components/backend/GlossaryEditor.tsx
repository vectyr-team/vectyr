import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  sort_order: number;
}

const GlossaryEditor = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const fetchTerms = async () => {
    const { data } = await supabase
      .from("glossary_terms")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setTerms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const startEdit = (t: GlossaryTerm) => {
    setEditingId(t.id);
    setEditTerm(t.term);
    setEditDefinition(t.definition);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTerm("");
    setEditDefinition("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("glossary_terms")
      .update({ term: editTerm, definition: editDefinition })
      .eq("id", editingId);
    if (error) {
      toast.error("Failed to save");
      return;
    }
    toast.success("Term updated");
    cancelEdit();
    fetchTerms();
  };

  const addTerm = async () => {
    if (!newTerm.trim() || !newDefinition.trim()) return;
    const maxOrder = terms.length > 0 ? Math.max(...terms.map((f) => f.sort_order)) : 0;
    const { error } = await supabase
      .from("glossary_terms")
      .insert({ term: newTerm, definition: newDefinition, sort_order: maxOrder + 1 });
    if (error) {
      toast.error("Failed to add term");
      return;
    }
    toast.success("Term added");
    setNewTerm("");
    setNewDefinition("");
    setShowAdd(false);
    fetchTerms();
  };

  const deleteTerm = async (id: string) => {
    const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Term deleted");
    fetchTerms();
  };

  const moveTerm = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= terms.length) return;

    const current = terms[index];
    const swap = terms[swapIndex];

    await Promise.all([
      supabase.from("glossary_terms").update({ sort_order: swap.sort_order }).eq("id", current.id),
      supabase.from("glossary_terms").update({ sort_order: current.sort_order }).eq("id", swap.id),
    ]);
    fetchTerms();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      {terms.map((t, index) => (
        <div key={t.id} className="border border-border rounded-lg p-4">
          {editingId === t.id ? (
            <div className="space-y-3">
              <Input
                value={editTerm}
                onChange={(e) => setEditTerm(e.target.value)}
                placeholder="Term"
                className="font-body"
              />
              <Textarea
                value={editDefinition}
                onChange={(e) => setEditDefinition(e.target.value)}
                placeholder="Definition"
                rows={6}
                className="font-body text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveEdit}>Save</Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 pt-1">
                <button
                  onClick={() => moveTerm(index, "up")}
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <Icon icon="lucide:chevron-up" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveTerm(index, "down")}
                  disabled={index === terms.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground">{t.term}</p>
                <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{t.definition}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(t)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <Icon icon="lucide:pencil" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTerm(t.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Icon icon="lucide:trash-2" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showAdd ? (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <Input
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder="Term"
            className="font-body"
          />
          <Textarea
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
            placeholder="Definition"
            rows={6}
            className="font-body text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addTerm}>Add Term</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setNewTerm(""); setNewDefinition(""); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowAdd(true)} className="w-full">
          <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      )}
    </div>
  );
};

export default GlossaryEditor;
