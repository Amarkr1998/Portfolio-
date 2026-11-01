// Server-side only. Never import this from a client component.
// Talks to an Azure OpenAI chat completions deployment and streams plain text.

import { STREAM_SIGNAL } from "@/lib/ai-constants";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AzureConfig = {
  endpoint: string;
  apiKey: string;
  deployment: string;
  apiVersion: string;
  reasoningEffort: string | null;
};

function getAzureConfig(): AzureConfig {
  const endpoint = process.env.AZURE_AI_ENDPOINT;
  const apiKey = process.env.AZURE_AI_API_KEY;
  const deployment = process.env.AZURE_AI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_AI_API_VERSION || "2024-12-01-preview";
  // Reasoning models (gpt-5.x, o-series) default to "medium" effort, which
  // can think silently for 20–90s before the first visible token — the chat
  // looked frozen. "low" keeps grounded Q&A answers to a few seconds.
  // Set AZURE_AI_REASONING_EFFORT=off for non-reasoning deployments.
  const effort = (process.env.AZURE_AI_REASONING_EFFORT ?? "low").trim().toLowerCase();

  if (!endpoint || !apiKey || !deployment) {
    throw new Error("AZURE_AI_NOT_CONFIGURED");
  }

  return {
    endpoint: endpoint.replace(/\/+$/, ""),
    apiKey,
    deployment,
    apiVersion,
    reasoningEffort: effort === "off" || effort === "" ? null : effort,
  };
}

// Time allowed to receive response headers from Azure.
const CONNECT_TIMEOUT_MS = 20_000;
// Hard ceiling on the whole exchange, connect + full stream. Kept under the
// route's maxDuration (60s) so the client always gets a clean ending.
const TOTAL_DEADLINE_MS = 50_000;
// A silent gap between chunks longer than this ends the stream.
const READ_TIMEOUT_MS = 20_000;

export function isAzureAIConfigured(): boolean {
  return Boolean(process.env.AZURE_AI_ENDPOINT && process.env.AZURE_AI_API_KEY && process.env.AZURE_AI_DEPLOYMENT);
}

async function requestCompletion(cfg: AzureConfig, messages: ChatMessage[], signal: AbortSignal, withEffort: boolean) {
  const url = `${cfg.endpoint}/openai/deployments/${cfg.deployment}/chat/completions?api-version=${cfg.apiVersion}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": cfg.apiKey },
    body: JSON.stringify({
      messages,
      stream: true,
      // Enough for a detailed multi-project answer, still bounded for cost.
      max_completion_tokens: 1200,
      ...(withEffort && cfg.reasoningEffort ? { reasoning_effort: cfg.reasoningEffort } : {}),
    }),
    signal,
  });
}

// Streams the completion as UTF-8 text. Problems the client should treat as
// errors (timeout, empty answer, filtered) are sent in-band as
// STREAM_SIGNAL + code, so the UI can show a real error state with Retry.
export async function streamAzureChatCompletion(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const cfg = getAzureConfig();
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(new Error("DEADLINE")), TOTAL_DEADLINE_MS);

  const connect = async (withEffort: boolean) => {
    const connectTimer = setTimeout(() => controller.abort(new Error("CONNECT_TIMEOUT")), CONNECT_TIMEOUT_MS);
    try {
      return await requestCompletion(cfg, messages, controller.signal, withEffort);
    } finally {
      clearTimeout(connectTimer);
    }
  };

  let upstream: Response;
  try {
    upstream = await connect(true);
    // A deployment that doesn't support reasoning_effort (e.g. gpt-4o)
    // rejects the request; retry once without it.
    if (upstream.status === 400 && cfg.reasoningEffort) {
      const text = await upstream.text().catch(() => "");
      if (text.includes("reasoning_effort")) {
        upstream = await connect(false);
      } else {
        clearTimeout(deadline);
        throw new Error(`AZURE_REQUEST_FAILED:400`);
      }
    }
  } catch (err) {
    clearTimeout(deadline);
    if (controller.signal.aborted) throw new Error("AZURE_REQUEST_TIMEOUT");
    throw err;
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(deadline);
    await upstream.body?.cancel().catch(() => {});
    throw new Error(`AZURE_REQUEST_FAILED:${upstream.status}`);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let sentContent = false;
  let finishReason: string | null = null;
  let closed = false;

  const finish = (stream: ReadableStreamDefaultController<Uint8Array>, signal?: string) => {
    if (closed) return;
    closed = true;
    clearTimeout(deadline);
    if (signal) stream.enqueue(encoder.encode(`${STREAM_SIGNAL}${signal}`));
    stream.close();
    reader.cancel().catch(() => {});
  };

  const readWithTimeout = () =>
    Promise.race<ReadableStreamReadResult<Uint8Array>>([
      reader.read(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("READ_TIMEOUT")), READ_TIMEOUT_MS)),
    ]);

  return new ReadableStream<Uint8Array>({
    async pull(stream) {
      // Loop until something is enqueued or the stream ends — reasoning
      // models can send several frames with no visible content first.
      while (!closed) {
        let result: ReadableStreamReadResult<Uint8Array>;
        try {
          result = await readWithTimeout();
        } catch {
          finish(stream, sentContent ? "N:timeout" : "E:timeout");
          return;
        }

        if (result.done) {
          if (!sentContent) finish(stream, finishReason === "content_filter" ? "E:filtered" : "E:empty");
          else finish(stream, finishReason === "length" ? "N:length" : undefined);
          return;
        }

        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let enqueued = false;
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const choice = json?.choices?.[0];
            if (choice?.finish_reason) finishReason = choice.finish_reason;
            const delta: string | undefined = choice?.delta?.content;
            if (delta) {
              stream.enqueue(encoder.encode(delta));
              sentContent = true;
              enqueued = true;
            }
          } catch {
            // Ignore malformed SSE frames.
          }
        }
        if (enqueued) return;
      }
    },
    cancel() {
      closed = true;
      clearTimeout(deadline);
      controller.abort();
      reader.cancel().catch(() => {});
    },
  });
}
