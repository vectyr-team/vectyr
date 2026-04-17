import { createRoot } from "react-dom/client";
import "./index.css";
import { clearStoredAuthSession, scrubInvalidStoredAuthSession, withTimeout } from "@/lib/supabase-guards";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const startApp = async () => {
  scrubInvalidStoredAuthSession();

  const [{ default: App }, { supabase }] = await Promise.all([
    import("./App.tsx"),
    import("@/integrations/supabase/client"),
  ]);

  try {
    await withTimeout(supabase.auth.getSession(), 5000, "Session restore timed out");
  } catch {
    clearStoredAuthSession();
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  }

  root.render(<App />);
};

void startApp();
