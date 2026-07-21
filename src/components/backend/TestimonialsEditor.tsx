import { useEffect, useRef, useState } from "react";
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
  headline: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  video_url: string | null;
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
          className="hover:scale-110 transition-transform"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Icon
            icon="mdi:star"
            className={`w-5 h-5 ${n <= value ? "text-primary" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}

function AvatarPicker({
  name,
  url,
  onUpload,
  onClear,
}: {
  name: string;
  url: string | null;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initials = (() => {
    const parts = (name || "").trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  })();

  return (
    <div className="flex items-center gap-2">
      {url ? (
        <img src={url} alt="" className="h-10 w-10 rounded-full object-cover border border-border" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs border border-border">
          {initials || "•"}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        {url ? "Replace" : "Upload"}
      </Button>
      {url && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Remove
        </Button>
      )}
    </div>
  );
}

function SortableRow({
  item,
  onChange,
  onDelete,
  onUploadAvatar,
}: {
  item: Testimonial;
  onChange: (patch: Partial<Testimonial>) => void;
  onDelete: () => void;
  onUploadAvatar: (file: File) => void;
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
      className="flex items-start gap-3 p-4 border border-border rounded bg-card"
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
      <div className="flex-1 space-y-3">
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
        <Input
          value={item.headline ?? ""}
          onChange={(e) => onChange({ headline: e.target.value })}
          placeholder="Review headline (optional, e.g. Fantastic Collaboration)"
          className="font-body text-sm"
        />
        <Textarea
          value={item.quote}
          onChange={(e) => onChange({ quote: e.target.value })}
          placeholder="Quote"
          rows={3}
          className="font-body text-sm"
        />
        <Input
          value={item.video_url ?? ""}
          onChange={(e) => onChange({ video_url: e.target.value })}
          placeholder="Video URL (optional, YouTube, Vimeo, Loom, Streamable, or .mp4)"
          className="font-body text-sm"
        />
        <div className="flex flex-wrap items-center gap-4">
          <StarInput value={item.rating} onChange={(n) => onChange({ rating: n })} />
          <AvatarPicker
            name={item.name}
            url={item.avatar_url}
            onUpload={onUploadAvatar}
            onClear={() => onChange({ avatar_url: null })}
          />
        </div>
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

  const uploadAvatar = async (id: string, file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `testimonials/${id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("team-photos").upload(path, file);
    if (upErr) {
      toast.error(`Upload failed: ${upErr.message}`);
      return;
    }
    const { data: urlData } = supabase.storage.from("team-photos").getPublicUrl(path);
    updateLocal(id, { avatar_url: urlData.publicUrl });
    toast.success("Avatar uploaded. Save to keep it.");
  };

  const addItem = async () => {
    const nextOrder = items.length ? Math.max(...items.map((l) => l.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: "New",
        title: null,
        headline: null,
        quote: "",
        rating: 5,
        sort_order: nextOrder,
        avatar_url: null,
        video_url: null,
      })
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
              headline: l.headline || null,
              quote: l.quote,
              rating: l.rating,
              avatar_url: l.avatar_url,
              video_url: l.video_url || null,
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
        Drag to reorder. Add an avatar image or a video URL. Videos appear above the quote.
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
                onUploadAvatar={(file) => uploadAvatar(item.id, file)}
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