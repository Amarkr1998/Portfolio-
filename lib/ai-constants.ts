// Shared between the client (AIAssistant) and the server (api/ai/chat route)
// so they can never drift out of sync — a client sending more history than
// the server accepts is exactly the bug that made "Retry" loop forever.
export const MAX_HISTORY = 20;
// User input is capped, but generously enough to paste a job description.
export const MAX_MESSAGE_LENGTH = 2000;
// Assistant replies are model-generated and routinely run longer than a
// user message. A separate, more generous bound that still guards against
// a client fabricating an oversized fake "assistant" turn.
export const MAX_ASSISTANT_MESSAGE_LENGTH = 4000;

// In-band control marker the server appends to a streamed answer (followed by
// a code) when something went wrong mid-stream. "E:" codes are errors the UI
// shows with Retry; "N:" codes are notes on an answer that did arrive.
// U+001E (record separator) never appears in model text.
export const STREAM_SIGNAL = "\u001e";
