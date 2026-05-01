import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

const FAQsEditor = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

  const fetchFaqs = async () => {
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("faqs")
      .update({ question: editQuestion, answer: editAnswer })
      .eq("id", editingId);
    if (error) {
      toast.error("Failed to save");
      return;
    }
    toast.success("FAQ updated");
    cancelEdit();
    fetchFaqs();
  };

  const addFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) : 0;
    const { error } = await supabase
      .from("faqs")
      .insert({ question: newQuestion, answer: newAnswer, sort_order: maxOrder + 1 });
    if (error) {
      toast.error("Failed to add FAQ");
      return;
    }
    toast.success("FAQ added");
    setNewQuestion("");
    setNewAnswer("");
    setShowAdd(false);
    fetchFaqs();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("faqs").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("FAQ deleted");
    fetchFaqs();
  };

  const moveFaq = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= faqs.length) return;

    const current = faqs[index];
    const swap = faqs[swapIndex];

    await Promise.all([
      supabase.from("faqs").update({ sort_order: swap.sort_order }).eq("id", current.id),
      supabase.from("faqs").update({ sort_order: current.sort_order }).eq("id", swap.id),
    ]);
    fetchFaqs();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={faq.id} className="border border-border rounded-lg p-4">
          {editingId === faq.id ? (
            <div className="space-y-3">
              <Input
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                placeholder="Question"
                className="font-body"
              />
              <Textarea
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                placeholder="Answer"
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
                  onClick={() => moveFaq(index, "up")}
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <Icon icon="lucide:chevron-up" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveFaq(index, "down")}
                  disabled={index === faqs.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground">{faq.question}</p>
                <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(faq)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <Icon icon="lucide:pencil" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(faq)}
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
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Question"
            className="font-body"
          />
          <Textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Answer"
            rows={6}
            className="font-body text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addFaq}>Add FAQ</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setNewQuestion(""); setNewAnswer(""); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowAdd(true)} className="w-full">
          <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.question}" — this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FAQsEditor;
