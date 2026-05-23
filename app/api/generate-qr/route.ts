import { NextRequest, NextResponse } from "next/server";
import { generateQrBase64 } from "@/lib/qr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text: string };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Text must be 2000 characters or less" },
        { status: 400 }
      );
    }

    const qrBase64 = await generateQrBase64(text.trim());

    return NextResponse.json({ qrBase64 });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
