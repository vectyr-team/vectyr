import { describe, expect, it } from "vitest";
import { buildKnowledgeInstructions } from "../../supabase/functions/hero-chat/knowledge";

describe("chat knowledge source", () => {
  it("preserves Markdown and XML knowledge verbatim", () => {
    const knowledge = '## Brand\n<fact>Brand Genome</fact>\n**Founder**';
    const instructions = buildKnowledgeInstructions(knowledge);
    expect(JSON.parse(instructions.split("reference content):\n")[1])).toBe(knowledge);
  });
  it("refuses to start without saved knowledge", () => {
    expect(() => buildKnowledgeInstructions(" \n")).toThrow("knowledgebase is empty");
  });
});