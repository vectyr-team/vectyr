import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

function SortableFaqRow({
  faq,
  isEditing,
  editQuestion,
  editAnswer,
  setEditQuestion,
  setEditAnswer,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  faq: FAQ;
  isEditing: boolean;
  editQuestion: string;
  editAnswer: string;
  setEditQuestion: (v: string) => void;
  setEditAnswer: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: faq.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-border rounded-lg p-4 bg-card">
      {isEditing ? (
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
            placeholder="Answer (supports markdown: **bold**, *italic*, [link](https://...), - lists)"
            rows={6}
            className="font-body text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onSaveEdit}>Save</Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none pt-1"
            aria-label="Drag to reorder"
          >
            <Icon icon="lucide:grip-vertical" className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-medium text-foreground">{faq.question}</p>
            <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onStartEdit}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <Icon icon="lucide:pencil" className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = faqs.findIndex((f) => f.id === active.id);
    const newIndex = faqs.findIndex((f) => f.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = [...faqs];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    const withOrder = reordered.map((f, i) => ({ ...f, sort_order: i }));
    setFaqs(withOrder);
    const results = await Promise.all(
      withOrder.map((f) =>
        supabase.from("faqs").update({ sort_order: f.sort_order }).eq("id", f.id)
      )
    );
    if (results.some((r) => r.error)) {
      toast.error("Failed to save order");
      fetchFaqs();
    }
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={faqs.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <SortableFaqRow
                key={faq.id}
                faq={faq}
                isEditing={editingId === faq.id}
                editQuestion={editQuestion}
                editAnswer={editAnswer}
                setEditQuestion={setEditQuestion}
                setEditAnswer={setEditAnswer}
                onStartEdit={() => startEdit(faq)}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onDelete={() => setDeleteTarget(faq)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
            placeholder="Answer (supports markdown: **bold**, *italic*, [link](https://...), - lists)"
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
