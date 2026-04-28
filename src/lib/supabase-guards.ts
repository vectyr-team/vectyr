const DEFAULT_TIMEOUT_MS = 8000;

export class SupabaseRequestTimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "SupabaseRequestTimeoutError";
  }
}

export async function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  message = "Request timed out"
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      Promise.resolve(promise),
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

  const prefix = key.replace(/auth-token$/, "");

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const storageKey = window.localStorage.key(index);
    if (storageKey?.startsWith(prefix)) {
      window.localStorage.removeItem(storageKey);
    }
  }

  for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
    const storageKey = window.sessionStorage.key(index);
    if (storageKey?.startsWith(prefix)) {
      window.sessionStorage.removeItem(storageKey);
    }
  }
}

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

const extractStoredAccessToken = (raw: string) => {
  const parsed = JSON.parse(raw);

  if (typeof parsed?.access_token === "string") return parsed.access_token;
  if (typeof parsed?.currentSession?.access_token === "string") return parsed.currentSession.access_token;

  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      if (typeof item?.access_token === "string") return item.access_token;
      if (typeof item?.currentSession?.access_token === "string") return item.currentSession.access_token;
    }
  }

  return null;
};

export function scrubInvalidStoredAuthSession() {
  if (typeof window === "undefined") return;

  const key = getSupabaseAuthStorageKey();
  if (!key) return;

  try {
    const raw = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    if (!raw) return;

    const token = extractStoredAccessToken(raw);
    if (!token) {
      clearStoredAuthSession();
      return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      clearStoredAuthSession();
      return;
    }

    const payload = JSON.parse(decodeBase64Url(parts[1]));
    if (!payload?.sub) clearStoredAuthSession();
  } catch {
    clearStoredAuthSession();
  }
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
