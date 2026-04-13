import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await userClient.auth.getUser();
    if (!caller) return json({ error: "Unauthorized" }, 401);

    // Check if any admins exist (bootstrap check)
    const { count } = await adminClient
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    const isBootstrap = count === 0;

    // Verify caller is admin (or bootstrap)
    if (!isBootstrap) {
      const { data: callerRole } = await adminClient
        .from("user_roles")
        .select("id")
        .eq("user_id", caller.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!callerRole) return json({ error: "Forbidden: admin role required" }, 403);
    }

    const { action, ...payload } = await req.json();

    // ── Bootstrap ──
    if (action === "bootstrap") {
      if (!isBootstrap) return json({ error: "Admins already exist" }, 400);
      await adminClient.from("user_roles").insert({ user_id: caller.id, role: "admin" });
      return json({ success: true });
    }

    // ── List all users ──
    if (action === "list") {
      const { data: { users }, error } = await adminClient.auth.admin.listUsers({ perPage: 500 });
      if (error) return json({ error: error.message }, 500);

      // Get all admin role user_ids
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      const adminIds = new Set((roles || []).map((r: any) => r.user_id));

      const mapped = (users || []).map((u: any) => ({
        id: u.id,
        email: u.email || "",
        display_name: u.user_metadata?.display_name || "",
        phone: u.phone || "",
        is_admin: adminIds.has(u.id),
        is_suspended: !!u.banned_until && new Date(u.banned_until) > new Date(),
        created_at: u.created_at,
      }));

      return json({ users: mapped });
    }

    // ── Invite user ──
    if (action === "invite") {
      const { email, password, display_name, make_admin } = payload;
      if (!email || !password) return json({ error: "Email and password required" }, 400);

      const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: display_name || "" },
      });
      if (createErr) return json({ error: createErr.message }, 400);

      if (make_admin) {
        await adminClient.from("user_roles").insert({ user_id: newUser.user.id, role: "admin" });
      }

      return json({ success: true, email });
    }

    // ── Update user ──
    if (action === "update") {
      const { user_id, email, display_name, phone } = payload;
      if (!user_id) return json({ error: "user_id required" }, 400);

      const updateData: any = {};
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (display_name !== undefined) {
        updateData.user_metadata = { display_name };
      }

      const { error: updateErr } = await adminClient.auth.admin.updateUserById(user_id, updateData);
      if (updateErr) return json({ error: updateErr.message }, 400);

      return json({ success: true });
    }

    // ── Toggle admin role ──
    if (action === "toggle_admin") {
      const { user_id, is_admin } = payload;
      if (!user_id) return json({ error: "user_id required" }, 400);
      if (user_id === caller.id) return json({ error: "Cannot change your own admin status" }, 400);

      if (is_admin) {
        await adminClient.from("user_roles").insert({ user_id, role: "admin" });
      } else {
        await adminClient.from("user_roles").delete().eq("user_id", user_id).eq("role", "admin");
      }
      return json({ success: true });
    }

    // ── Suspend / unsuspend user ──
    if (action === "suspend") {
      const { user_id, suspended } = payload;
      if (!user_id) return json({ error: "user_id required" }, 400);
      if (user_id === caller.id) return json({ error: "Cannot suspend yourself" }, 400);

      const banData = suspended
        ? { ban_duration: "876000h" } // ~100 years
        : { ban_duration: "none" };

      const { error: banErr } = await adminClient.auth.admin.updateUserById(user_id, banData);
      if (banErr) return json({ error: banErr.message }, 400);

      return json({ success: true });
    }

    // ── Delete user ──
    if (action === "delete") {
      const { user_id } = payload;
      if (!user_id) return json({ error: "user_id required" }, 400);
      if (user_id === caller.id) return json({ error: "Cannot delete yourself" }, 400);

      // Remove roles first
      await adminClient.from("user_roles").delete().eq("user_id", user_id);
      const { error: delErr } = await adminClient.auth.admin.deleteUser(user_id);
      if (delErr) return json({ error: delErr.message }, 400);

      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
