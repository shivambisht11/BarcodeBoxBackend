import Redis from "ioredis";
import fs from "fs";
import path from "path";

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
const FALLBACK_FILE = path.join(process.cwd(), "kv_fallback.json");

// Only initialize Redis if REDIS_URL is present
const kv = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

// Helper to read fallback file
function readFallback(): Record<string, { value: string; expiry: number }> {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Silently ignore or log locally
  }
  return {};
}

// Helper to write fallback file
function writeFallback(data: Record<string, { value: string; expiry: number }>) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing fallback KV file:", e);
  }
}

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
  if (kv) {
    await kv.set(`msg:${slug}`, text, "EX", THIRTY_DAYS_IN_SECONDS);
  } else {
    const data = readFallback();
    data[`msg:${slug}`] = {
      value: text,
      expiry: Date.now() + THIRTY_DAYS_IN_SECONDS * 1000,
    };
    writeFallback(data);
  }
}

/**
 * Retrieve a smart text message from Vercel KV
 */
export async function getMessage(slug: string): Promise<string | null> {
  if (kv) {
    const value = await kv.get(`msg:${slug}`);
    return value;
  } else {
    const data = readFallback();
    const entry = data[`msg:${slug}`];
    if (entry) {
      if (entry.expiry > Date.now()) {
        return entry.value;
      } else {
        // Clean up expired entry
        delete data[`msg:${slug}`];
        writeFallback(data);
      }
    }
    return null;
  }
}

/**
 * Check if Vercel KV is configured (env vars present)
 */
export function isKvConfigured(): boolean {
  return !!process.env.REDIS_URL;
}
