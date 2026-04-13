import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

const AdminManager = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const callManageAdmins = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("manage-admins", { body });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const fetchAdmins = async () => {
    try {
      const data = await callManageAdmins({ action: "list" });
      setAdmins(data.admins || []);
      setNeedsBootstrap(false);
    } catch (err: any) {
      if (err.message?.includes("Forbidden") || err.message?.includes("admin role required")) {
        // Check if bootstrap needed
        setNeedsBootstrap(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleBootstrap = async () => {
    try {
      await callManageAdmins({ action: "bootstrap" });
      toast({ title: "You are now an admin" });
      setNeedsBootstrap(false);
      fetchAdmins();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await callManageAdmins({ action: "invite", email, password });
      toast({ title: "Admin invited", description: email });
      setEmail("");
      setPassword("");
      fetchAdmins();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (admin: Admin) => {
    if (!confirm(`Remove admin access for ${admin.email}?`)) return;
    try {
      await callManageAdmins({ action: "remove", user_id: admin.user_id });
      toast({ title: "Admin removed" });
      fetchAdmins();
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
    <div className="space-y-8">
      {/* Current admins */}
      <div className="space-y-3">
        <h2 className="font-body text-lg text-foreground uppercase">Current Admins</h2>
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between bg-card border border-border rounded px-4 py-3"
          >
            <div>
              <p className="text-foreground font-body text-sm">{admin.email}</p>
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                Added {new Date(admin.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleRemove(admin)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Remove admin"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Invite form */}
      <div className="space-y-3">
        <h2 className="font-body text-lg text-foreground uppercase">Invite New Admin</h2>
        <form onSubmit={handleInvite} className="space-y-3">
          <div>
            <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 block">
              Temporary Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={inviting}
            className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {inviting ? "Inviting..." : "Invite Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminManager;
