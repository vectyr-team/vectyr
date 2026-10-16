export type ChatResponsePart =
  | { type: "text"; text: string }
  | { type: "calendar"; src: string };

export function safeChatCalendarUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "links.vectyr.com" ||
      url.port || url.username || url.password ||
      !/^\/widget\/booking\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

// Extract only supported calendars. Never execute HTML or scripts from a reply.
export function parseChatCalendars(text: string): ChatResponsePart[] {
  const parts: ChatResponsePart[] = [];
  const cleaned = text
    .replace(/<script\b[^>]*>[\s\S]*?(?:<\/script\s*>|$)/gi, "")
    .replace(/```(?:html)?\s*(?=<iframe\b)/gi, "")
    .replace(/(<\/iframe\s*>)(?:\s*<br\s*\/?>)?\s*```/gi, "$1");
  const embeds = /<iframe\b[^>]*(?:>[\s\S]*?(?:<\/iframe\s*>|$)|$)(?:\s*<br\s*\/?>)?/gi;
  let cursor = 0;
  for (const match of cleaned.matchAll(embeds)) {
    const before = cleaned.slice(cursor, match.index);
    if (before.trim()) parts.push({ type: "text", text: before });
    const opening = match[0].match(/^<iframe\b[^>]*>/i)?.[0];
    const source = opening?.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    const src = source ? safeChatCalendarUrl(source.replace(/&amp;/g, "&")) : null;
    // Wait for the closing tag so streamed attributes cannot mount/reload the frame.
    if (src && /<\/iframe\s*>/i.test(match[0])) parts.push({ type: "calendar", src });
    cursor = (match.index ?? 0) + match[0].length;
  }
  const after = cleaned.slice(cursor);
  if (after.trim()) parts.push({ type: "text", text: after });
  return parts;
}