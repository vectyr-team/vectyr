import { describe, expect, it } from "vitest";
import { parseChatCalendars, safeChatCalendarUrl } from "./chat-calendar";

const src = "https://links.vectyr.com/widget/booking/LGWRqxtT9OA75Qbjobcm";

describe("chat calendar extraction", () => {
  it("renders the supplied booking calendar between reply text without its script", () => {
    expect(parseChatCalendars(`Here's the calendar:\n<iframe src="${src}" allow="payment" id="old-id"></iframe><br><script src="https://links.vectyr.com/js/form_embed.js"></script>\nGrab a slot.`)).toEqual([
      { type: "text", text: "Here's the calendar:\n" },
      { type: "calendar", src },
      { type: "text", text: "\nGrab a slot." },
    ]);
  });
  it("waits for a complete streamed iframe without showing partial HTML", () => {
    expect(parseChatCalendars(`Calendar:\n<iframe src="${src}"`)).toEqual([{ type: "text", text: "Calendar:\n" }]);
    expect(parseChatCalendars(`<iframe src="${src}">`)).toEqual([]);
  });
  it("supports a calendar returned inside an HTML code fence", () => {
    expect(parseChatCalendars(`\`\`\`html\n<iframe src='${src}'></iframe>\n\`\`\``)).toEqual([{ type: "calendar", src }]);
  });
  it("rejects executable and untrusted frame sources", () => {
    for (const value of ["javascript:alert(1)", "https://evil.example/widget/booking/id", "https://links.vectyr.com.evil.example/widget/booking/id", "http://links.vectyr.com/widget/booking/id", "https://links.vectyr.com/other", "https://user:pass@links.vectyr.com/widget/booking/id"]) {
      expect(safeChatCalendarUrl(value)).toBeNull();
      expect(parseChatCalendars(`<iframe src="${value}"></iframe>`)).toEqual([]);
    }
  });
  it("keeps ordinary Markdown unchanged", () => {
    expect(parseChatCalendars("**Hello**\n\n[Book](https://stevescalendar.com)")).toEqual([{ type: "text", text: "**Hello**\n\n[Book](https://stevescalendar.com)" }]);
  });
});