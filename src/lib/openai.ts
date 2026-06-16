import OpenAI from "openai";

let _client: OpenAI | null = null;

/**
 * Lazily instantiate the OpenAI client so the app builds/deploys without a key
 * present at module-load time. The key is only required at request time.
 */
export function getOpenAI(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

/** Free-tier credit cap per user (override with your own billing logic). */
export const FREE_CREDIT_LIMIT = 20;
