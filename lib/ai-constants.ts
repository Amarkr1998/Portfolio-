// Shared between the client (AIAssistant) and the server (api/ai/chat route)
// so they can never drift out of sync — a client sending more history than
// the server accepts is exactly the bug that made "Retry" loop forever.
export const MAX_HISTORY = 20;
// User input is capped tightly — it's free-form and adversarial.
export const MAX_MESSAGE_LENGTH = 500;
// Assistant replies are model-generated and routinely run longer than a
// user message (multi-paragraph answers, bulleted skill lists). Capping
// them at the same 500 chars as user input rejected the *entire* history
// the moment one real reply exceeded it, breaking every message after the
// first substantial answer. This is a separate, more generous bound that
// still guards against a client fabricating an oversized fake "assistant"
// turn to inflate the request.
export const MAX_ASSISTANT_MESSAGE_LENGTH = 4000;
