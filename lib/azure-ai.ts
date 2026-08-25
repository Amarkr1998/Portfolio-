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

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      messages,
      stream: true,
      max_completion_tokens: 600,
    }),
  });

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
      const { done, value } = await reader.read();
      if (done) {
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
