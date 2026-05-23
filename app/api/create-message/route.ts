import { NextRequest, NextResponse } from "next/server";
import { generateSlug, storeMessage, isKvConfigured } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    if (!isKvConfigured() && !isDev) {
      return NextResponse.json(
        { error: "Smart Text feature is not configured. Please set up Redis (REDIS_URL)." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { text } = body as { text: string };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text must be 500 characters or less" },
        { status: 400 }
      );
    }

    const slug = generateSlug();
    await storeMessage(slug, text.trim());

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const url = `${protocol}://${host}/m/${slug}`;

    return NextResponse.json({ url, slug });
  } catch (error) {
    console.error("Create message error:", error);
    return NextResponse.json(
      { error: "Failed to create smart text message" },
      { status: 500 }
    );
  }
}
