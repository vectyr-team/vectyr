import type { UIMessage } from "ai";

export const HERO_CHAT_STORAGE_KEY = "vectyr-hero-chat-v1";

export function readHeroChatHistory(storage: Pick<Storage, "getItem">): UIMessage[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(HERO_CHAT_STORAGE_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((message): message is UIMessage =>
      typeof message === "object" && message !== null &&
      typeof message.id === "string" &&
      ["user", "assistant"].includes(message.role) && Array.isArray(message.parts)
    );
  } catch {
    return [];
  }
}

export function saveHeroChatHistory(storage: Pick<Storage, "setItem">, messages: UIMessage[]) {
  storage.setItem(HERO_CHAT_STORAGE_KEY, JSON.stringify(messages));
}