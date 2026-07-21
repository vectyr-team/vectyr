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

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  quote: string;
  rating: number;
  sort_order: number;
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-primary hover:scale-110 transition-transform"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Icon
            icon={n <= value ? "lucide:star" : "lucide:star"}
            className={`w-4 h-4 ${n <= value ? "fill-primary" : "opacity-30"}`}
          />
        </button>
      ))}
    </div>
  );
}

function SortableRow({
  item,
  onChange,
  onDelete,
}: {
  item: Testimonial;
  onChange: (patch: Partial<Testimonial>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 border border-border rounded bg-card"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none mt-2"
        aria-label="Drag to reorder"
      >
        <Icon icon="lucide:grip-vertical" className="w-4 h-4" />
      </button>
      <div className="flex-1 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Name"
            className="font-body text-sm"
          />
          <Input
            value={item.title ?? ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Title (optional, e.g. Founder, Acme Co)"
            className="font-body text-sm"
          />
        </div>
        <Textarea
          value={item.quote}
          onChange={(e) => onChange({ quote: e.target.value })}
          placeholder="Quote"
          rows={3}
          className="font-body text-sm"
        />
        <StarInput value={item.rating} onChange={(n) => onChange({ rating: n })} />
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
        <Icon icon="lucide:trash-2" className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
}

const TestimonialsEditor = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("Failed to load testimonials");
    } else {
      setItems((data as Testimonial[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchItems();
  }, []);

  const updateLocal = (id: string, patch: Partial<Testimonial>) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addItem = async () => {
    const nextOrder = items.length ? Math.max(...items.map((l) => l.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("testimonials")
      .insert({ name: "New", title: null, quote: "", rating: 5, sort_order: nextOrder })
      .select()
      .single();
    if (error || !data) {
      toast.error("Failed to add testimonial");
      return;
    }
    setItems((prev) => [...prev, data as Testimonial]);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    setItems((prev) => prev.filter((l) => l.id !== id));
    toast.success("Testimonial deleted");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((l) => l.id === active.id);
    const newIndex = items.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setItems(reordered.map((l, i) => ({ ...l, sort_order: i })));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = await Promise.all(
        items.map((l, i) =>
          supabase
            .from("testimonials")
            .update({
              name: l.name,
              title: l.title || null,
              quote: l.quote,
              rating: l.rating,
              sort_order: i,
            })
            .eq("id", l.id)
        )
      );
      const firstError = updates.find((r) => r.error)?.error;
      if (firstError) throw firstError;
      toast.success("Testimonials saved");
      await fetchItems();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-muted-foreground">
        Drag to reorder. Title appears under the name (optional).
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                item={item}
                onChange={(patch) => updateLocal(item.id, patch)}
                onDelete={() => setDeleteId(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex gap-2">
        <Button variant="outline" onClick={addItem}>
          <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialsEditor;