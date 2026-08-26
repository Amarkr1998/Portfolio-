// Best-effort in-memory rate limiter. Resets on server restart and is
// per-instance only (not shared across serverless replicas), but still
// blocks the common case of a single client hammering the endpoint.
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 15;

const hits = new Map<string, { count: number; resetAt: number }>();

// Bound memory: if the map grows large, drop expired entries.
function sweep(now: number) {
  if (hits.size < 500) return;
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  sweep(now);

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}
