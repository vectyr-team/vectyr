import { convertToModelMessages, validateUIMessages } from "npm:ai@6";
import { createResponsesCall } from "../_shared/responses.ts";
import { withLovableAiGatewayRunIdHeader } from "../_shared/run-id.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildKnowledgeInstructions } from "./knowledge.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  const jsonError = (message: string, status: number) => new Response(JSON.stringify({ error: message }), {
    status, headers: { ...cors, "Content-Type": "application/json" },
  });
  if (request.method !== "POST") return jsonError("Method not allowed", 405);
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
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
    const { data: knowledge, error: knowledgeError } = await database.from("chat_knowledge").select("content").eq("id", "hero").maybeSingle();
    if (knowledgeError) return jsonError("The chat knowledgebase could not be loaded. Please try again later.", 503);
    if (!knowledge?.content?.trim()) return jsonError("The chat knowledgebase has not been added yet.", 503);
    const instructions = buildKnowledgeInstructions(knowledge.content);
    const { result, initialResponse, runIdFetch } = createResponsesCall(request, {
      baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra",
    }, await convertToModelMessages(messages), instructions);
    const stream = result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onFinish: () => { /* The browser saves completed UIMessage history. */ },
      onError: (error) => error instanceof Error ? error.message : "The AI reply could not be completed.",
      headers: cors,
    });
    const upstream = await initialResponse;
    if (upstream && !upstream.ok) {
      const payload = await upstream.clone().json().catch(() => null);
      const message = payload?.message || payload?.error?.message || "The AI service could not complete this request.";
      await stream.body?.cancel();
      return jsonError(message, upstream.status);
    }
    return withLovableAiGatewayRunIdHeader(stream, runIdFetch, cors);
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499, headers: cors });
    return jsonError(error instanceof Error ? error.message : "The AI reply could not be completed.", 400);
  }
});