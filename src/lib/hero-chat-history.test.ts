import { describe, expect, it } from "vitest";
import { HERO_CHAT_STORAGE_KEY, readHeroChatHistory, saveHeroChatHistory } from "./hero-chat-history";
import type { UIMessage } from "ai";

describe("single browser conversation", () => {
  it("restores both turns from the same browser record", () => {
    const records = new Map<string, string>();
    const storage = { getItem: (key: string) => records.get(key) ?? null, setItem: (key: string, value: string) => { records.set(key, value); } };
    const messages: UIMessage[] = [
      { id: "first", role: "user", parts: [{ type: "text", text: "What is Brand Genome?" }] },
      { id: "reply", role: "assistant", parts: [{ type: "text", text: "Your brand's DNA." }] },
    ];
    saveHeroChatHistory(storage, messages);
    expect(records.size).toBe(1);
    expect(records.has(HERO_CHAT_STORAGE_KEY)).toBe(true);
    expect(readHeroChatHistory(storage)).toEqual(messages);
  });
  it("starts empty when browser history is corrupt", () => {
    expect(readHeroChatHistory({ getItem: () => "broken" })).toEqual([]);
  });
});