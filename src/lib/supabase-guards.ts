const DEFAULT_TIMEOUT_MS = 8000;

export class SupabaseRequestTimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "SupabaseRequestTimeoutError";
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  message = "Request timed out"
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new SupabaseRequestTimeoutError(message)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function getSupabaseAuthStorageKey() {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  return projectId ? `sb-${projectId}-auth-token` : null;
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") return;

  const key = getSupabaseAuthStorageKey();
  if (!key) return;

  window.localStorage.removeItem(key);
  window.sessionStorage.removeItem(key);
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
