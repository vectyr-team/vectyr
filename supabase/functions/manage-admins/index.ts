import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await userClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

      if (!callerRole) {
        return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { action, ...payload } = await req.json();

    // Bootstrap: make current user admin
    if (action === "bootstrap") {
      if (!isBootstrap) {
        return new Response(JSON.stringify({ error: "Admins already exist" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await adminClient.from("user_roles").insert({ user_id: caller.id, role: "admin" });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // List admins
    if (action === "list") {
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("id, user_id, role, created_at")
        .eq("role", "admin");

      // Get user emails
      const userIds = (roles || []).map((r: any) => r.user_id);
      const admins = [];
      for (const uid of userIds) {
        const { data: { user } } = await adminClient.auth.admin.getUserById(uid);
        admins.push({
          id: roles!.find((r: any) => r.user_id === uid)!.id,
          user_id: uid,
          email: user?.email || "unknown",
          created_at: roles!.find((r: any) => r.user_id === uid)!.created_at,
        });
      }

      return new Response(JSON.stringify({ admins }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Invite admin
    if (action === "invite") {
      const { email, password } = payload;
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create user via admin API
      const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createErr) {
        return new Response(JSON.stringify({ error: createErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Assign admin role
      await adminClient.from("user_roles").insert({
        user_id: newUser.user.id,
        role: "admin",
      });

      return new Response(JSON.stringify({ success: true, email }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Remove admin
    if (action === "remove") {
      const { user_id } = payload;
      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent removing yourself
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot remove yourself" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await adminClient.from("user_roles").delete().eq("user_id", user_id).eq("role", "admin");

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
