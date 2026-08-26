import { NextRequest } from "next/server";
import { streamAzureChatCompletion, isAzureAIConfigured, type ChatMessage } from "@/lib/azure-ai";
import { AI_SYSTEM_PROMPT, buildPortfolioContext } from "@/lib/portfolio-context";
import { checkRateLimit } from "@/lib/rate-limit";
import { MAX_HISTORY, MAX_MESSAGE_LENGTH } from "@/lib/ai-constants";

export const runtime = "nodejs";

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

function getClientKey(req: NextRequest): string {
  // Best-effort client identifier for rate limiting — trusts the first hop's
  // forwarded-for header when present (typical behind Vercel/a reverse proxy).
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const { allowed, retryAfterSeconds } = checkRateLimit(getClientKey(req));
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}),
        },
      }
    );
  }

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
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("AI chat error:", message);

    const isTimeout = message === "AZURE_REQUEST_TIMEOUT";
    return new Response(
      JSON.stringify({
        error: isTimeout
          ? "The AI assistant took too long to respond. Please try again."
          : "The AI assistant is temporarily unavailable. Please try again.",
      }),
      { status: isTimeout ? 504 : 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
