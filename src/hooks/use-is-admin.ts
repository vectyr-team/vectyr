import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Returns true when the current session belongs to an admin user. */
export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const check = async (userId?: string) => {
      if (!userId) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (active) {
        setIsAdmin(!!data);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      check(session?.user?.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      // Defer to avoid deadlock inside the auth callback
      setTimeout(() => check(session?.user?.id), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
};
