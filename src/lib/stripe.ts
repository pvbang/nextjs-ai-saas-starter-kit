import Stripe from "stripe";

let _client: Stripe | null = null;

/**
 * Lazily instantiate the Stripe client so the app builds without a key present
 * at module-load time. The key is only required at request time.
 */
export function getStripe(): Stripe {
  if (!_client) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) throw new Error("STRIPE_SECRET_KEY is not set");
    _client = new Stripe(apiKey, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
      appInfo: { name: "AI SaaS Starter Kit", version: "1.0.0" },
    });
  }
  return _client;
}

/** Build an absolute URL from a path using the configured app URL. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
