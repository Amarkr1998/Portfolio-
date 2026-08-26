// Shared between the client (AIAssistant) and the server (api/ai/chat route)
// so they can never drift out of sync — a client sending more history than
// the server accepts is exactly the bug that made "Retry" loop forever.
export const MAX_HISTORY = 20;
export const MAX_MESSAGE_LENGTH = 500;
