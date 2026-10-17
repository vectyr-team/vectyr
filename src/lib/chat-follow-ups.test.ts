import { describe, expect, it } from "vitest";
import { parseChatFollowUps } from "./chat-follow-ups";

describe("chat follow-up choices", () => {
  it("extracts follow-up questions as sendable actions", () => {
    expect(parseChatFollowUps("Are you:\n- Trying to figure out if BrandHelix is the move for your business?\n- Just shopping for a logo?\n- Something else?")[1]).toEqual({ type: "questions", questions: ["Trying to figure out if BrandHelix is the move for your business?", "Just shopping for a logo?", "Something else?"] });
  });
  it("recognizes numbered choices after a follow-up prompt", () => {
    expect(parseChatFollowUps("Which would you like?\n1. Brand strategy\n2. Logo design")[1]).toEqual({ type: "questions", questions: ["Brand strategy", "Logo design"] });
  });
  it("preserves factual bullet and numbered lists", () => {
    for (const text of ["Services:\n- Strategy\n- Design", "Steps:\n1. Discover\n2. Build", "```\n- First?\n- Second?\n```", "Options:\n- First?\n  - Nested detail\n- Second?"]) {
      expect(parseChatFollowUps(text)).toEqual([{ type: "text", text }]);
    }
  });
});