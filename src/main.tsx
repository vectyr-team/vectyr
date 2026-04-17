import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearStoredAuthSession, scrubInvalidStoredAuthSession, withTimeout } from "@/lib/supabase-guards";

scrubInvalidStoredAuthSession();

const { supabase } = await import("@/integrations/supabase/client");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const startApp = async () => {
  try {
    await withTimeout(supabase.auth.getSession(), 5000, "Session restore timed out");
  } catch {
    clearStoredAuthSession();
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  }

  root.render(<App />);
};

void startApp();
