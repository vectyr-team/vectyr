import { convertToModelMessages, streamText, validateUIMessages } from "npm:ai@6";
import { createAnthropic } from "npm:@ai-sdk/anthropic@3";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildKnowledgeInstructions } from "./knowledge.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const cors = corsHeaders;
const CLAUDE_MODEL = "claude-sonnet-4-5";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  const jsonError = (message: string, status: number) => new Response(JSON.stringify({ error: message }), {
    status, headers: { ...cors, "Content-Type": "application/json" },
  });
  if (request.method !== "POST") return jsonError("Method not allowed", 405);
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return jsonError("The AI connection is not configured.", 401);
  try {
    const body = await request.json();
    if (!Array.isArray(body.messages)) return jsonError("Please send a conversation.", 400);
    const messages = await validateUIMessages({ messages: body.messages });
    if (messages.some((message) => message.role !== "user" && message.role !== "assistant")) {
      return jsonError("Unsupported message role.", 400);
    }
    const databaseUrl = Deno.env.get("SUPABASE_URL");
    const databaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!databaseUrl || !databaseKey) return jsonError("The chat knowledgebase is not configured.", 503);
    const database = createClient(databaseUrl, databaseKey, { auth: { persistSession: false } });
    const { data: knowledge, error: knowledgeError } = await database.from("chat_knowledge_items").select("category, content").order("created_at");
    if (knowledgeError) return jsonError("The chat knowledgebase could not be loaded. Please try again later.", 503);
    if (!knowledge?.some((item) => item.category.trim() && item.content.trim())) return jsonError("The chat knowledgebase has not been added yet.", 503);
    const { data: settings, error: settingsError } = await database.from("chat_settings").select("instructions").eq("id", "general").maybeSingle();
    if (settingsError) return jsonError("The chat instructions could not be loaded. Please try again later.", 503);
    const instructions = buildKnowledgeInstructions(knowledge, settings?.instructions);

    // Drop reasoning parts from older (non-Claude) replies so history stays valid for Anthropic.
    const cleaned = messages.map((m) => ({ ...m, parts: m.parts.filter((p) => p.type !== "reasoning") }));

    let resolveInitial: (r: Response | undefined) => void = () => {};
    const initialResponse = new Promise<Response | undefined>((r) => { resolveInitial = r; });
    const anthropic = createAnthropic({
      apiKey,
      fetch: async (input, init) => {
        try { const res = await fetch(input, init); resolveInitial(res); return res; }
        catch (e) { resolveInitial(undefined); throw e; }
      },
    });
    const result = streamText({
      model: anthropic(CLAUDE_MODEL),
      system: instructions,
      messages: await convertToModelMessages(cleaned),
      abortSignal: request.signal,
      maxRetries: 0,
    });
    const stream = result.toUIMessageStreamResponse({
      originalMessages: messages,
      onError: (error) => error instanceof Error ? error.message : "The AI reply could not be completed.",
      headers: cors,
    });
    const upstream = await initialResponse;
    if (upstream && !upstream.ok) {
      const payload = await upstream.clone().json().catch(() => null);
      const message = payload?.error?.message || "The AI service could not complete this request.";
      await stream.body?.cancel();
      return jsonError(message, upstream.status);
    }
    return stream;
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499, headers: cors });
    return jsonError(error instanceof Error ? error.message : "The AI reply could not be completed.", 400);
  }
});
