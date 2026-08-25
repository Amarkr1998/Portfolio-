import { NextRequest } from "next/server";
import { streamAzureChatCompletion, isAzureAIConfigured, type ChatMessage } from "@/lib/azure-ai";
import { AI_SYSTEM_PROMPT, buildPortfolioContext } from "@/lib/portfolio-context";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 8;

type ClientMessage = { role: "user" | "assistant"; content: string };

function isValidHistory(value: unknown): value is ClientMessage[] {
  if (!Array.isArray(value)) return false;
  if (value.length > MAX_HISTORY) return false;
  return value.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(req: NextRequest) {
  if (!isAzureAIConfigured()) {
    return new Response(
      JSON.stringify({
        error:
          "The AI assistant isn't configured yet. Add Azure AI credentials to enable Ask Amar AI.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = (body ?? {}) as { messages?: unknown };

  if (!isValidHistory(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Request must include a valid message history." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return new Response(JSON.stringify({ error: "Last message must be from the user." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const chatMessages: ChatMessage[] = [
    { role: "system", content: AI_SYSTEM_PROMPT + buildPortfolioContext() },
    ...messages,
  ];

  try {
    const stream = await streamAzureChatCompletion(chatMessages);
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    // Never leak upstream error details (may contain endpoint/config info).
    console.error("AI chat error:", err instanceof Error ? err.message : "unknown error");
    return new Response(
      JSON.stringify({ error: "The AI assistant is temporarily unavailable. Please try again." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
