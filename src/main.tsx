import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearStoredAuthSession, getSupabaseAuthStorageKey, withTimeout } from "@/lib/supabase-guards";

// Scrub any corrupted/invalid stored auth token BEFORE the Supabase client
// initializes and tries to use it. A malformed JWT (missing `sub` claim, etc.)
// causes every subsequent request to fail with 403 bad_jwt — including login.
const scrubInvalidStoredToken = () => {
  if (typeof window === "undefined") return;
  const key = getSupabaseAuthStorageKey();
  if (!key) return;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const token: string | undefined =
      parsed?.access_token ?? parsed?.currentSession?.access_token;
    if (!token || typeof token !== "string") {
      clearStoredAuthSession();
      return;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      clearStoredAuthSession();
      return;
    }
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (!payload?.sub) {
      clearStoredAuthSession();
    }
  } catch {
    clearStoredAuthSession();
  }
};

scrubInvalidStoredToken();

// Import AFTER scrubbing so the Supabase client reads a clean storage state.
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
