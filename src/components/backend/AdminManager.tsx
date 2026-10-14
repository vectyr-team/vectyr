import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface UserRecord {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
  is_suspended: boolean;
  created_at: string;
}

interface EditState {
  email: string;
  display_name: string;
}

const AdminManager = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ email: "", display_name: "" });
  const [saving, setSaving] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteAdmin, setInviteAdmin] = useState(false);
  const [inviting, setInviting] = useState(false);

  const { toast } = useToast();

  const callManageAdmins = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("manage-admins", { body });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const fetchUsers = async () => {
    try {
      const data = await callManageAdmins({ action: "list" });
      setUsers(data.users || []);
      setNeedsBootstrap(false);
    } catch (err: any) {
      if (err.message?.includes("Forbidden") || err.message?.includes("admin role required")) {
        setNeedsBootstrap(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBootstrap = async () => {
    try {
      await callManageAdmins({ action: "bootstrap" });
      toast({ title: "You are now an admin" });
      setNeedsBootstrap(false);
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await callManageAdmins({
        action: "invite",
        email: inviteEmail,
        password: invitePassword,
        display_name: inviteName,
        make_admin: inviteAdmin,
      });
      toast({ title: "User invited", description: inviteEmail });
      setInviteEmail("");
      setInvitePassword("");
      setInviteName("");
      setInviteAdmin(false);
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const startEditing = (user: UserRecord) => {
    setEditingId(user.id);
    setEditState({ email: user.email, display_name: user.display_name });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSave = async (userId: string) => {
    setSaving(true);
    try {
      await callManageAdmins({
        action: "update",
        user_id: userId,
        email: editState.email,
        display_name: editState.display_name,
      });
      toast({ title: "User updated" });
      setEditingId(null);
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSuspendToggle = async (user: UserRecord) => {
    try {
      await callManageAdmins({
        action: "suspend",
        user_id: user.id,
        suspended: !user.is_suspended,
      });
      toast({ title: user.is_suspended ? "User unsuspended" : "User suspended" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (user: UserRecord) => {
    if (!confirm(`Permanently delete ${user.email}? This cannot be undone.`)) return;
    try {
      await callManageAdmins({ action: "delete", user_id: user.id });
      toast({ title: "User deleted" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleAdmin = async (user: UserRecord) => {
    try {
      await callManageAdmins({
        action: "toggle_admin",
        user_id: user.id,
        is_admin: !user.is_admin,
      });
      toast({ title: user.is_admin ? "Admin access removed" : "Admin access granted" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <p className="text-muted-foreground font-body text-sm">Loading...</p>;
  }

  if (needsBootstrap) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground font-body text-sm">
          No admins exist yet. Claim admin access for your account to get started.
        </p>
        <button
          onClick={handleBootstrap}
          className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 rounded hover:bg-primary/90 transition-colors"
        >
          Claim Admin Access
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Invite Form ── */}
      <div className="space-y-4">
        <h2 className="font-body text-base text-foreground font-medium">Invite New User</h2>
        <form onSubmit={handleInvite} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                Display Name
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                Temporary Password
              </label>
              <input
                type="text"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
                required
                minLength={8}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch checked={inviteAdmin} onCheckedChange={setInviteAdmin} />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Grant Admin Access
                </span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={inviting}
            className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {inviting ? "Inviting..." : "Invite User"}
          </button>
        </form>
      </div>

      {/* ── Users List ── */}
      <div className="space-y-4">
        <h2 className="font-body text-base text-foreground font-medium">All Users</h2>
        <div className="space-y-3">
          {users.map((user) => {
            const isEditing = editingId === user.id;

            return (
              <div
                key={user.id}
                className="border border-border rounded-lg p-4 space-y-3 bg-card"
              >
                {isEditing ? (
                  /* ── Edit Mode ── */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editState.email}
                          onChange={(e) => setEditState((s) => ({ ...s, email: e.target.value }))}
                          className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editState.display_name}
                          onChange={(e) => setEditState((s) => ({ ...s, display_name: e.target.value }))}
                          className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Switch
                          checked={user.is_suspended}
                          onCheckedChange={() => handleSuspendToggle(user)}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {user.is_suspended ? "Suspended" : "Suspend User"}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(user.id)}
                          disabled={saving}
                          className="bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="border border-border text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── View Mode ── */
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-foreground font-body text-sm truncate">{user.email}</p>
                        {user.is_admin && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-primary/20 text-primary px-2 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                        {user.is_suspended && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-destructive/20 text-destructive px-2 py-0.5 rounded">
                            Suspended
                          </span>
                        )}
                      </div>
                      {user.display_name && (
                        <p className="text-muted-foreground font-body text-xs mt-0.5">{user.display_name}</p>
                      )}
                      <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Admin toggle */}
                      <button
                        onClick={() => handleToggleAdmin(user)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={user.is_admin ? "Remove admin" : "Make admin"}
                      >
                        <Icon icon={user.is_admin ? "lucide:shield-check" : "lucide:shield"} className="w-4 h-4" />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => startEditing(user)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit user"
                      >
                        <Icon icon="lucide:pencil" className="w-4 h-4" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete user"
                      >
                        <Icon icon="lucide:trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {users.length === 0 && (
            <p className="text-muted-foreground font-body text-sm">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManager;
