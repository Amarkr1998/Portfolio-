// Server-side only. Never import this from a client component.
// Talks to an Azure AI (Azure OpenAI-compatible) chat completions deployment.

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AzureConfig = {
  endpoint: string;
  apiKey: string;
  deployment: string;
  apiVersion: string;
};

function getAzureConfig(): AzureConfig {
  const endpoint = process.env.AZURE_AI_ENDPOINT;
  const apiKey = process.env.AZURE_AI_API_KEY;
  const deployment = process.env.AZURE_AI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_AI_API_VERSION || "2024-06-01";

  if (!endpoint || !apiKey || !deployment) {
    throw new Error("AZURE_AI_NOT_CONFIGURED");
  }

  return { endpoint: endpoint.replace(/\/+$/, ""), apiKey, deployment, apiVersion };
}

// Bounds the entire request (connect + full stream) so a hung upstream
// connection can't leave a client request open indefinitely. Kept well
// under the route's maxDuration (60s) so this fires and returns a clean
// timeout message before the platform kills the function outright.
const REQUEST_TIMEOUT_MS = 25_000;

export function isAzureAIConfigured(): boolean {
  return Boolean(
    process.env.AZURE_AI_ENDPOINT &&
      process.env.AZURE_AI_API_KEY &&
      process.env.AZURE_AI_DEPLOYMENT
  );
}

// Streams the Azure chat completion response as a plain ReadableStream<Uint8Array>
// of newline-delimited text chunks (already unwrapped from Azure's SSE envelope),
// so the API route can forward it directly to the client.
export async function streamAzureChatCompletion(
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const { endpoint, apiKey, deployment, apiVersion } = getAzureConfig();

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        stream: true,
        // A detailed multi-project answer runs well past 600 tokens and was
        // getting cut off mid-sentence — 1200 gives real answers headroom
        // while still bounding a single response's cost/latency.
        max_completion_tokens: 1200,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error("AZURE_REQUEST_TIMEOUT");
    }
    throw err;
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    throw new Error(`AZURE_REQUEST_FAILED:${upstream.status}:${text.slice(0, 300)}`);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      let done: boolean;
      let value: Uint8Array | undefined;
      try {
        ({ done, value } = await reader.read());
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          controller.enqueue(encoder.encode("\n\n[Response timed out. Please try again.]"));
        }
        controller.close();
        return;
      }

      if (done || !value) {
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last (possibly incomplete) line in the buffer for the next chunk.
      buffer = lines.pop() ?? "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith("data:")) continue;

        const payload = line.replace(/^data:\s*/, "").trim();
        if (payload === "[DONE]") continue;

        try {
          const json = JSON.parse(payload);
          const delta: string | undefined = json?.choices?.[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        } catch {
          // Ignore malformed SSE frames.
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
