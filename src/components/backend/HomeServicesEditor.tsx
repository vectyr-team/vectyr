import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { HomeService } from "@/hooks/use-home-services";

type Draft = Omit<HomeService, "id" | "sort_order">;

const EMPTY: Draft = {
  icon: "lucide:sparkles",
  image_url: "",
  title: "",
  summary: "",
  modal_title: "",
  modal_description: "",
  cta_link: "/contact",
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
    {children}
  </label>
);

function ServiceForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saveLabel,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const set = (k: keyof Draft, v: string) => setDraft({ ...draft, [k]: v });
  const [uploading, setUploading] = useState(false);
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `services/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("team-photos").upload(path, file, { contentType: file.type || "image/jpeg" });
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
      setDraft({ ...draft, image_url: data.publicUrl });
      toast.success("Picture uploaded. Save to keep it.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Card picture</FieldLabel>
        <div className="flex items-center gap-3">
          <div className="aspect-[16/10] w-40 shrink-0 overflow-hidden rounded bg-muted">
            {draft.image_url && <img src={draft.image_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f);
                  e.target.value = "";
                }}
              />
              <span className="inline-flex cursor-pointer items-center rounded-md border border-input px-3 py-1.5 font-body text-xs hover:bg-muted">
                <Icon icon={uploading ? "lucide:loader-2" : "lucide:upload"} className={`w-3.5 h-3.5 mr-2 ${uploading ? "animate-spin" : ""}`} />
                {uploading ? "Uploading..." : draft.image_url ? "Replace picture" : "Upload picture"}
              </span>
            </label>
            {draft.image_url && (
              <button type="button" onClick={() => set("image_url", "")} className="text-left font-body text-xs text-muted-foreground hover:text-destructive">
                Remove picture
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <FieldLabel>Card title</FieldLabel>
        <Input value={draft.title} onChange={(e) => set("title", e.target.value)} className="font-body text-sm" />
      </div>
      <div>
        <FieldLabel>Card text</FieldLabel>
        <Textarea value={draft.summary} onChange={(e) => set("summary", e.target.value)} rows={3} className="font-body text-sm" />
      </div>
      <div className="pt-3 border-t border-border space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">How it Works popup</p>
        <div>
          <FieldLabel>Popup title</FieldLabel>
          <Input
            value={draft.modal_title}
            onChange={(e) => set("modal_title", e.target.value)}
            placeholder="Leave empty to use the card title"
            className="font-body text-sm"
          />
        </div>
        <div>
          <FieldLabel>Popup description</FieldLabel>
          <Textarea
            value={draft.modal_description}
            onChange={(e) => set("modal_description", e.target.value)}
            placeholder="Supports markdown: **bold**, *italic*, [link](https://...), - lists"
            rows={8}
            className="font-body text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Button text</FieldLabel>
            <Input
              value={draft.cta_label}
              onChange={(e) => set("cta_label", e.target.value)}
              placeholder="I want this"
              className="font-body text-sm"
            />
          </div>
          <div>
            <FieldLabel>Button link</FieldLabel>
            <Input
              value={draft.cta_link}
              onChange={(e) => set("cta_link", e.target.value)}
              placeholder="/contact or https://..."
              className="font-body text-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave}>{saveLabel}</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function SortableServiceRow({
  service,
  isEditing,
  draft,
  setDraft,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  service: HomeService;
  isEditing: boolean;
  draft: Draft;
  setDraft: (d: Draft) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="border border-border rounded-lg p-4 bg-card">
      {isEditing ? (
        <ServiceForm draft={draft} setDraft={setDraft} onSave={onSaveEdit} onCancel={onCancelEdit} saveLabel="Save" />
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
          <div className="aspect-[16/10] w-16 shrink-0 overflow-hidden rounded bg-muted">
            {service.image_url && <img src={service.image_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-medium text-foreground">{service.title}</p>
            <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{service.summary}</p>
            <p className="font-mono text-[10px] text-muted-foreground/70 mt-1 truncate">Button: {service.cta_link}</p>
          </div>
          <div className="flex gap-1">
            <button onClick={onStartEdit} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Edit">
              <Icon icon="lucide:pencil" className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="text-muted-foreground hover:text-destructive transition-colors p-1" aria-label="Delete">
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const HomeServicesEditor = () => {
  const [services, setServices] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [showAdd, setShowAdd] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<HomeService | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchServices = async () => {
    const { data } = await supabase.from("home_services").select("*").order("sort_order", { ascending: true });
    if (data) setServices(data as HomeService[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const startEdit = (s: HomeService) => {
    setEditingId(s.id);
    setDraft({
      icon: s.icon,
      image_url: s.image_url ?? "",
      title: s.title,
      summary: s.summary,
      modal_title: s.modal_title,
      modal_description: s.modal_description,
      cta_link: s.cta_link,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!draft.title.trim()) return toast.error("Card title is required");
    const { error } = await supabase.from("home_services").update(draft).eq("id", editingId);
    if (error) return toast.error("Failed to save: " + error.message);
    toast.success("Service updated");
    setEditingId(null);
    fetchServices();
  };

  const addService = async () => {
    if (!newDraft.title.trim()) return toast.error("Card title is required");
    const maxOrder = services.length > 0 ? Math.max(...services.map((s) => s.sort_order)) : -1;
    const { error } = await supabase.from("home_services").insert({ ...newDraft, sort_order: maxOrder + 1 });
    if (error) return toast.error("Failed to add: " + error.message);
    toast.success("Service added");
    setNewDraft(EMPTY);
    setShowAdd(false);
    fetchServices();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("home_services").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    if (error) return toast.error("Failed to delete");
    toast.success("Service deleted");
    fetchServices();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = [...services];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, sort_order: i }));
    setServices(withOrder);
    const results = await Promise.all(
      withOrder.map((s) => supabase.from("home_services").update({ sort_order: s.sort_order }).eq("id", s.id))
    );
    if (results.some((r) => r.error)) {
      toast.error("Failed to save order");
      fetchServices();
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-headline text-2xl text-foreground mb-1">Services</h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        "What Problem Do You Need Solved?" cards and their How it Works popups
      </p>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {services.map((s) => (
                  <SortableServiceRow
                    key={s.id}
                    service={s}
                    isEditing={editingId === s.id}
                    draft={draft}
                    setDraft={setDraft}
                    onStartEdit={() => startEdit(s)}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={saveEdit}
                    onDelete={() => setDeleteTarget(s)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {showAdd ? (
            <div className="border border-border rounded-lg p-4">
              <ServiceForm
                draft={newDraft}
                setDraft={setNewDraft}
                onSave={addService}
                onCancel={() => {
                  setShowAdd(false);
                  setNewDraft(EMPTY);
                }}
                saveLabel="Add service"
              />
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAdd(true)} className="w-full">
              <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
              Add service
            </Button>
          )}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be removed from the home page. This can't be undone.
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

export default HomeServicesEditor;
