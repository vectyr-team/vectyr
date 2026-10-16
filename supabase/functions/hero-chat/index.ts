import { convertToModelMessages, validateUIMessages } from "npm:ai@6";
import { createResponsesCall } from "../_shared/responses.ts";
import { withLovableAiGatewayRunIdHeader } from "../_shared/run-id.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const instructions = `You are Vectyr's brand assistant, speaking with visitors on the Brand or Die website. Be direct, helpful, concise and conversational. Help founders articulate their brand problems and explain Vectyr only using these verified facts: Brand Genome is the brand's DNA, extracted, sequenced and integrated across the team. Vectyr combines founder knowledge with customer perceptions. BrandHelix.ai distributes brand intelligence to teams and vendors. Continuity includes 180-day check-ins and updates when new information is submitted. Steve Reed is associated with Vectyr and BrandHelix. Visitors can book a demo at /demo, read FAQs at /faqs or contact Vectyr at /contact. Do not invent prices, guarantees, clients, contact details, policies or capabilities. If something is not in these facts, say you do not have that information and suggest contacting the team. Never claim to have performed actions or accessed private data. Do not use em dashes. Clearly identify yourself as an AI assistant if asked.`;

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
    const { result } = createResponsesCall(request, {
      baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra",
    }, await convertToModelMessages(messages), instructions);
    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onFinish: () => { /* The browser saves completed UIMessage history. */ },
      onError: (error) => error instanceof Error ? error.message : "The AI reply could not be completed.",
      headers: cors,
    });
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499, headers: cors });
    return jsonError(error instanceof Error ? error.message : "The AI reply could not be completed.", 400);
  }
});