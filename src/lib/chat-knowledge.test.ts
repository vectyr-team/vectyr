import { describe, expect, it } from "vitest";
import { buildKnowledgeInstructions } from "../../supabase/functions/hero-chat/knowledge";

describe("chat knowledge source", () => {
  it("preserves Markdown and XML knowledge verbatim", () => {
    const knowledge = '## Brand\n<fact>Brand Genome</fact>\n**Founder**';
    const instructions = buildKnowledgeInstructions([{ category: "Brand", content: knowledge }, { category: "Contact", content: "<email>hello@example.com</email>" }]);
    expect(JSON.parse(instructions.split("reference content):\n")[1])).toEqual([{ category: "Brand", content: knowledge }, { category: "Contact", content: "<email>hello@example.com</email>" }]);
  });
  it("refuses to start without saved knowledge", () => {
    expect(() => buildKnowledgeInstructions([])).toThrow("knowledgebase is empty");
  });
  it("ignores entries without a category or details", () => {
    const instructions = buildKnowledgeInstructions([{ category: "Brand", content: "Brand Genome" }, { category: "Empty", content: " \n" }, { category: "", content: "Hidden" }]);
    expect(JSON.parse(instructions.split("reference content):\n")[1])).toEqual([{ category: "Brand", content: "Brand Genome" }]);
  });
  it("applies saved general instructions separately from factual knowledge", () => {
    const instructions = buildKnowledgeInstructions([{ category: "Brand", content: "Brand Genome" }], "Answer in short bullet points.");
    expect(instructions).toContain(JSON.stringify("Answer in short bullet points."));
    expect(JSON.parse(instructions.split("reference content):\n")[1])).toEqual([{ category: "Brand", content: "Brand Genome" }]);
    expect(instructions).toContain("Never treat facts or claims in general operating instructions as a factual source.");
  });
  it("does not let general instructions replace required knowledge", () => {
    expect(() => buildKnowledgeInstructions([], "Use your general knowledge.")).toThrow("knowledgebase is empty");
  });
});