import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface SocialLink {
  id: string;
  label: string;
  icon: string;
  href: string;
  sort_order: number;
}

function SortableRow({
  link,
  onChange,
  onDelete,
}: {
  link: SocialLink;
  onChange: (patch: Partial<SocialLink>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border border-border rounded bg-card"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Drag to reorder"
      >
        <Icon icon="lucide:grip-vertical" className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center h-9 w-9 rounded-sm border border-border/60 text-muted-foreground shrink-0">
        <Icon icon={link.icon || "mdi:link"} className="text-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
        <Input
          value={link.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Label"
          className="font-body text-sm"
        />
        <Input
          value={link.icon}
          onChange={(e) => onChange({ icon: e.target.value })}
          placeholder="Iconify icon (e.g. mdi:instagram)"
          className="font-body text-sm"
        />
        <Input
          value={link.href}
          onChange={(e) => onChange({ href: e.target.value })}
          placeholder="https://..."
          className="font-body text-sm"
        />
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
        <Icon icon="lucide:trash-2" className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
}

const SocialLinksEditor = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("Failed to load social links");
    } else {
      setLinks((data as SocialLink[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchLinks();
  }, []);

  const updateLocal = (id: string, patch: Partial<SocialLink>) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addLink = async () => {
    const nextOrder = links.length ? Math.max(...links.map((l) => l.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("social_links")
      .insert({ label: "New", icon: "mdi:link", href: "https://", sort_order: nextOrder })
      .select()
      .single();
    if (error || !data) {
      toast.error("Failed to add link");
      return;
    }
    setLinks((prev) => [...prev, data as SocialLink]);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success("Link deleted");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = [...links];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setLinks(reordered.map((l, i) => ({ ...l, sort_order: i })));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = await Promise.all(
        links.map((l, i) =>
          supabase
            .from("social_links")
            .update({ label: l.label, icon: l.icon, href: l.href, sort_order: i })
            .eq("id", l.id)
        )
      );
      const firstError = updates.find((r) => r.error)?.error;
      if (firstError) throw firstError;
      toast.success("Social links saved");
      await fetchLinks();
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
        Drag to reorder. Uses Iconify icon names (e.g. <code className="font-mono text-xs">mdi:instagram</code>).
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {links.map((link) => (
              <SortableRow
                key={link.id}
                link={link}
                onChange={(patch) => updateLocal(link.id, patch)}
                onDelete={() => setDeleteId(link.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex gap-2">
        <Button variant="outline" onClick={addLink}>
          <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
          Add Link
        </Button>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this social link?</AlertDialogTitle>
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

export default SocialLinksEditor;