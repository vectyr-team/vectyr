export type FollowUpPart = { type: "text"; text: string } | { type: "questions"; questions: string[] };

// Only turn short, top-level choice lists into actions, not ordinary factual lists.
export function parseChatFollowUps(text: string): FollowUpPart[] {
  const lines = text.split("\n");
  const parts: FollowUpPart[] = [];
  let pending: string[] = [];
  let inCode = false;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^\s*```/.test(line)) inCode = !inCode;
    if (!inCode && /^(?:[-+*]|\d+[.)])\s+/.test(line)) {
      const items: string[] = [];
      let end = index;
      while (end < lines.length) {
        const match = lines[end].match(/^(?:[-+*]|\d+[.)])\s+(.+)$/);
        if (!match) break;
        items.push(match[1].replace(/\*\*|__|`/g, "").trim());
        end++;
      }
      const intro = pending.join("\n").slice(-300);
      const allQuestions = items.every((item) => item.endsWith("?"));
      const choiceIntro = /(?:are you|would you|which|what (?:would|do|are)|choose|pick|interested in)[^\n]*[:?]\s*$/i.test(intro);
      const nested = end < lines.length && /^\s+\S/.test(lines[end]);
      if (items.length >= 2 && items.every((item) => item.length <= 180) && !nested && (allQuestions || choiceIntro)) {
        if (pending.length) parts.push({ type: "text", text: pending.join("\n") });
        parts.push({ type: "questions", questions: items });
        pending = [];
        index = end - 1;
        continue;
      }
    }
    pending.push(line);
  }
  if (pending.length) parts.push({ type: "text", text: pending.join("\n") });
  return parts;
}