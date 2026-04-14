import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@iconify/react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

interface Department {
  id: string;
  name: string;
  sort_order: number;
}

interface TeamMember {
  id: string;
  department_id: string | null;
  name: string;
  title: string;
  bio: string;
  slug: string;
  photo_url: string | null;
  sort_order: number;
}

interface GridSettings {
  id: string;
  desktop_columns: number;
  tablet_columns: number;
  mobile_columns: number;
}

// ---- Sortable Row Component ----
function SortableMemberRow({
  member,
  isMobile,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  member: TeamMember;
  isMobile: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: member.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 py-3 px-3 bg-card rounded mb-1 group">
      {!isMobile ? (
        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground shrink-0" aria-label="Drag to reorder">
          <Icon icon="lucide:grip-vertical" className="w-4 h-4" />
        </button>
      ) : (
        <div className="flex flex-col gap-0.5 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst} className="text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">
            <Icon icon="lucide:chevron-up" className="w-4 h-4" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">
            <Icon icon="lucide:chevron-down" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Thumbnail */}
      <div className="w-12 h-12 rounded overflow-hidden bg-background shrink-0">
        {member.photo_url ? (
          <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-mono">—</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-foreground truncate">{member.name}</p>
        <p className="font-mono text-xs text-muted-foreground truncate">{member.title}</p>
        {member.bio && (
          <p className="font-body text-xs text-muted-foreground/60 mt-0.5 line-clamp-2">{member.bio}</p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Edit">
          <Icon icon="lucide:pencil" className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" aria-label="Delete">
          <Icon icon="lucide:trash-2" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ---- Sortable Department Header ----
function SortableDeptHeader({
  dept,
  isMobile,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  dept: Department;
  isMobile: boolean;
  onRename: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `dept-${dept.id}` });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 mt-8 mb-3 first:mt-0">
      {!isMobile ? (
        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground shrink-0" aria-label="Drag to reorder department">
          <Icon icon="lucide:grip-vertical" className="w-4 h-4" />
        </button>
      ) : (
        <div className="flex flex-col gap-0.5 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
            <Icon icon="lucide:chevron-up" className="w-3 h-3" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
            <Icon icon="lucide:chevron-down" className="w-3 h-3" />
          </button>
        </div>
      )}
      <h3 className="font-headline text-2xl text-foreground flex-1">{dept.name}</h3>
      <button onClick={onRename} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Rename department">
        <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Delete department">
        <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ---- Member Form ----
function MemberForm({
  initial,
  departments,
  onSave,
  onCancel,
}: {
  initial?: TeamMember;
  departments: Department[];
  onSave: (data: {
    name: string;
    title: string;
    bio: string;
    slug: string;
    department_id: string | null;
    photoFile: File | null;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [deptId, setDeptId] = useState<string>(initial?.department_id ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial?.photo_url ?? null);
  const [slugTouched, setSlugTouched] = useState(!!initial);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [name, slugTouched]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h3 className="font-headline text-xl text-foreground">{initial ? "Edit Member" : "Add Team Member"}</h3>

      {/* Photo */}
      <div>
        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Photo</Label>
        <div className="flex items-center gap-4 mt-2">
          {photoPreview && (
            <div className="w-20 h-20 rounded overflow-hidden bg-background shrink-0">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Department</Label>
          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
          >
            <option value="">No Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Bio</Label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} className="mt-1" />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onSave({ name, title, bio, slug, department_id: deptId || null, photoFile })} disabled={!name || !slug}>
          {initial ? "Save Changes" : "Add Member"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

// ---- Main TeamEditor ----
const TeamEditor = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [gridSettings, setGridSettings] = useState<GridSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

  // Department dialogs
  const [newDeptName, setNewDeptName] = useState("");
  const [showNewDept, setShowNewDept] = useState(false);
  const [renamingDept, setRenamingDept] = useState<Department | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);
  const [deptDeleteAction, setDeptDeleteAction] = useState<"delete" | "move">("delete");
  const [moveToDeptId, setMoveToDeptId] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchAll = useCallback(async () => {
    const [deptRes, memberRes, gridRes] = await Promise.all([
      supabase.from("departments").select("*").order("sort_order"),
      supabase.from("team_members").select("*").order("sort_order"),
      supabase.from("team_grid_settings").select("*").limit(1).single(),
    ]);
    if (deptRes.data) setDepartments(deptRes.data);
    if (memberRes.data) setMembers(memberRes.data);
    if (gridRes.data) setGridSettings(gridRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ---- Grid Settings ----
  const updateGrid = async (field: string, value: number) => {
    if (!gridSettings) return;
    const val = Math.max(1, Math.min(6, value));
    const updateData: Record<string, number> = {};
    updateData[field] = val;
    await supabase.from("team_grid_settings").update(updateData as any).eq("id", gridSettings.id);
    setGridSettings({ ...gridSettings, [field]: val });
  };

  // ---- Department CRUD ----
  const addDepartment = async () => {
    if (!newDeptName.trim()) return;
    const maxOrder = departments.length > 0 ? Math.max(...departments.map((d) => d.sort_order)) : -1;
    await supabase.from("departments").insert({ name: newDeptName.trim(), sort_order: maxOrder + 1 });
    setNewDeptName("");
    setShowNewDept(false);
    fetchAll();
  };

  const renameDepartment = async () => {
    if (!renamingDept || !renameValue.trim()) return;
    await supabase.from("departments").update({ name: renameValue.trim() }).eq("id", renamingDept.id);
    setRenamingDept(null);
    fetchAll();
  };

  const confirmDeleteDept = async () => {
    if (!deletingDept) return;
    if (deptDeleteAction === "move" && moveToDeptId) {
      await supabase.from("team_members").update({ department_id: moveToDeptId }).eq("department_id", deletingDept.id);
    } else {
      await supabase.from("team_members").delete().eq("department_id", deletingDept.id);
    }
    await supabase.from("departments").delete().eq("id", deletingDept.id);
    setDeletingDept(null);
    fetchAll();
  };

  // ---- Member CRUD ----
  const saveMember = async (data: {
    name: string;
    title: string;
    bio: string;
    slug: string;
    department_id: string | null;
    photoFile: File | null;
  }) => {
    let photoUrl = editingMember?.photo_url ?? null;

    if (data.photoFile) {
      const ext = data.photoFile.name.split(".").pop();
      const path = `${data.slug}-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("team-photos").upload(path, data.photoFile);
      if (uploadErr) {
        toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" });
        return;
      }
      const { data: urlData } = supabase.storage.from("team-photos").getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }

    if (editingMember) {
      const deptChanged = data.department_id !== editingMember.department_id;
      let sortOrder = editingMember.sort_order;
      if (deptChanged) {
        const deptMembers = members.filter((m) => m.department_id === data.department_id);
        sortOrder = deptMembers.length > 0 ? Math.max(...deptMembers.map((m) => m.sort_order)) + 1 : 0;
      }
      const { error } = await supabase.from("team_members").update({
        name: data.name,
        title: data.title,
        bio: data.bio,
        slug: data.slug,
        department_id: data.department_id,
        photo_url: photoUrl,
        sort_order: sortOrder,
      }).eq("id", editingMember.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    } else {
      const deptMembers = members.filter((m) => m.department_id === data.department_id);
      const maxOrder = deptMembers.length > 0 ? Math.max(...deptMembers.map((m) => m.sort_order)) : -1;

      // Handle slug collision
      let finalSlug = data.slug;
      const { data: existing } = await supabase.from("team_members").select("slug").eq("slug", finalSlug);
      if (existing && existing.length > 0) {
        let i = 2;
        while (true) {
          const candidate = `${data.slug}-${i}`;
          const { data: check } = await supabase.from("team_members").select("slug").eq("slug", candidate);
          if (!check || check.length === 0) {
            finalSlug = candidate;
            break;
          }
          i++;
        }
      }

      const { error } = await supabase.from("team_members").insert({
        name: data.name,
        title: data.title,
        bio: data.bio,
        slug: finalSlug,
        department_id: data.department_id,
        photo_url: photoUrl,
        sort_order: maxOrder + 1,
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }

    setShowForm(false);
    setEditingMember(null);
    fetchAll();
    toast({ title: editingMember ? "Member updated" : "Member added" });
  };

  const deleteMember = async () => {
    if (!deleteTarget) return;
    await supabase.from("team_members").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    fetchAll();
    toast({ title: "Member deleted" });
  };

  // ---- Reordering ----
  const handleMemberDragEnd = async (event: DragEndEvent, deptId: string | null) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const deptMembers = members
      .filter((m) => m.department_id === deptId)
      .sort((a, b) => a.sort_order - b.sort_order);

    const oldIndex = deptMembers.findIndex((m) => m.id === active.id);
    const newIndex = deptMembers.findIndex((m) => m.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...deptMembers];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    // Optimistic update
    const updates = reordered.map((m, i) => ({ ...m, sort_order: i }));
    setMembers((prev) =>
      prev.map((m) => {
        const updated = updates.find((u) => u.id === m.id);
        return updated ? { ...m, sort_order: updated.sort_order } : m;
      })
    );

    // Persist
    await Promise.all(updates.map((m) => supabase.from("team_members").update({ sort_order: m.sort_order }).eq("id", m.id)));
  };

  const handleDeptDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = (active.id as string).replace("dept-", "");
    const overId = (over.id as string).replace("dept-", "");

    const sorted = [...departments].sort((a, b) => a.sort_order - b.sort_order);
    const oldIndex = sorted.findIndex((d) => d.id === activeId);
    const newIndex = sorted.findIndex((d) => d.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...sorted];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updates = reordered.map((d, i) => ({ ...d, sort_order: i }));
    setDepartments(updates);

    await Promise.all(updates.map((d) => supabase.from("departments").update({ sort_order: d.sort_order }).eq("id", d.id)));
  };

  const moveMember = async (memberId: string, deptId: string | null, direction: -1 | 1) => {
    const deptMembers = members
      .filter((m) => m.department_id === deptId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = deptMembers.findIndex((m) => m.id === memberId);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= deptMembers.length) return;

    const a = deptMembers[index];
    const b = deptMembers[swapIndex];

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === a.id) return { ...m, sort_order: b.sort_order };
        if (m.id === b.id) return { ...m, sort_order: a.sort_order };
        return m;
      })
    );

    await Promise.all([
      supabase.from("team_members").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("team_members").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
  };

  const moveDept = async (deptId: string, direction: -1 | 1) => {
    const sorted = [...departments].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((d) => d.id === deptId);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapIndex];

    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === a.id) return { ...d, sort_order: b.sort_order };
        if (d.id === b.id) return { ...d, sort_order: a.sort_order };
        return d;
      })
    );

    await Promise.all([
      supabase.from("departments").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("departments").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
  };

  if (loading) return <p className="text-muted-foreground font-mono text-sm">Loading...</p>;

  const sortedDepts = [...departments].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-8">
      {/* Grid Column Settings */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Grid Columns</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Desktop", field: "desktop_columns", value: gridSettings?.desktop_columns ?? 4 },
            { label: "Tablet", field: "tablet_columns", value: gridSettings?.tablet_columns ?? 3 },
            { label: "Mobile", field: "mobile_columns", value: gridSettings?.mobile_columns ?? 2 },
          ].map((item) => (
            <div key={item.field}>
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">{item.label}</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={item.value}
                onChange={(e) => updateGrid(item.field, parseInt(e.target.value) || 1)}
                className="mt-1 w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Departments header */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Departments</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowNewDept(true)}>
          <Icon icon="lucide:plus" className="w-4 h-4 mr-1" /> Add Department
        </Button>
      </div>

      {showNewDept && (
        <div className="flex gap-2">
          <Input placeholder="Department name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="flex-1" />
          <Button size="sm" onClick={addDepartment}>Add</Button>
          <Button variant="ghost" size="sm" onClick={() => { setShowNewDept(false); setNewDeptName(""); }}>Cancel</Button>
        </div>
      )}

      {/* Add Member button */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Team Members</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
        >
          <Icon icon="lucide:plus" className="w-4 h-4 mr-1" /> Add Team Member
        </Button>
      </div>

      {/* Member Form */}
      {showForm && (
        <MemberForm
          initial={editingMember ?? undefined}
          departments={sortedDepts}
          onSave={saveMember}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}

      {/* Departments + Members List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDeptDragEnd}>
        <SortableContext items={sortedDepts.map((d) => `dept-${d.id}`)} strategy={verticalListSortingStrategy}>
          {sortedDepts.map((dept, deptIdx) => {
            const deptMembers = members
              .filter((m) => m.department_id === dept.id)
              .sort((a, b) => a.sort_order - b.sort_order);

            return (
              <div key={dept.id}>
                <SortableDeptHeader
                  dept={dept}
                  isMobile={isMobile}
                  onRename={() => { setRenamingDept(dept); setRenameValue(dept.name); }}
                  onDelete={() => setDeletingDept(dept)}
                  onMoveUp={() => moveDept(dept.id, -1)}
                  onMoveDown={() => moveDept(dept.id, 1)}
                  isFirst={deptIdx === 0}
                  isLast={deptIdx === sortedDepts.length - 1}
                />

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleMemberDragEnd(e, dept.id)}>
                  <SortableContext items={deptMembers.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                    {deptMembers.map((member, mIdx) => (
                      <SortableMemberRow
                        key={member.id}
                        member={member}
                        isMobile={isMobile}
                        onEdit={() => { setEditingMember(member); setShowForm(true); }}
                        onDelete={() => setDeleteTarget(member)}
                        onMoveUp={() => moveMember(member.id, dept.id, -1)}
                        onMoveDown={() => moveMember(member.id, dept.id, 1)}
                        isFirst={mIdx === 0}
                        isLast={mIdx === deptMembers.length - 1}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                {deptMembers.length === 0 && (
                  <p className="text-muted-foreground/40 font-mono text-xs py-3 px-3">No members in this department</p>
                )}
              </div>
            );
          })}
        </SortableContext>
      </DndContext>

      {/* Unassigned members */}
      {(() => {
        const unassigned = members.filter((m) => !m.department_id).sort((a, b) => a.sort_order - b.sort_order);
        if (unassigned.length === 0) return null;
        return (
          <div>
            <h3 className="font-headline text-2xl text-foreground mt-8 mb-3">Unassigned</h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleMemberDragEnd(e, null)}>
              <SortableContext items={unassigned.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                {unassigned.map((member, mIdx) => (
                  <SortableMemberRow
                    key={member.id}
                    member={member}
                    isMobile={isMobile}
                    onEdit={() => { setEditingMember(member); setShowForm(true); }}
                    onDelete={() => setDeleteTarget(member)}
                    onMoveUp={() => moveMember(member.id, null, -1)}
                    onMoveDown={() => moveMember(member.id, null, 1)}
                    isFirst={mIdx === 0}
                    isLast={mIdx === unassigned.length - 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        );
      })()}

      {/* Delete Member Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Department Dialog */}
      <AlertDialog open={!!renamingDept} onOpenChange={() => setRenamingDept(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Department</AlertDialogTitle>
          </AlertDialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={renameDepartment}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Department Dialog */}
      <AlertDialog open={!!deletingDept} onOpenChange={() => setDeletingDept(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deletingDept?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>What should happen to the members in this department?</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={deptDeleteAction === "delete"}
                onChange={() => setDeptDeleteAction("delete")}
              />
              Delete all members in this department
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={deptDeleteAction === "move"}
                onChange={() => setDeptDeleteAction("move")}
              />
              Move members to another department
            </label>
            {deptDeleteAction === "move" && (
              <select
                value={moveToDeptId}
                onChange={(e) => setMoveToDeptId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
              >
                <option value="">Select department...</option>
                {sortedDepts
                  .filter((d) => d.id !== deletingDept?.id)
                  .map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
              </select>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDept}
              disabled={deptDeleteAction === "move" && !moveToDeptId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamEditor;
