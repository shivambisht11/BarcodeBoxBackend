import { kv } from "@vercel/kv";

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

/**
 * Generates a random 8-character alphanumeric slug
 */
export function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

/**
 * Store a smart text message in Vercel KV with a 30-day TTL
 */
export async function storeMessage(slug: string, text: string): Promise<void> {
  await kv.set(`msg:${slug}`, text, { ex: THIRTY_DAYS_IN_SECONDS });
}

/**
 * Retrieve a smart text message from Vercel KV
 */
export async function getMessage(slug: string): Promise<string | null> {
  const value = await kv.get<string>(`msg:${slug}`);
  return value;
}

/**
 * Check if Vercel KV is configured (env vars present)
 */
export function isKvConfigured(): boolean {
  return !!(process.env.KV_URL && process.env.KV_REST_API_TOKEN);
}
