import { Metadata } from "next";
import { getMessage } from "@/lib/kv";
import { QrCode, AlertCircle, Clock } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let text = "BarcodeBox — Smart Text Message";

  try {
    const message = await getMessage(params.slug);
    if (message) {
      text = message.length > 160 ? message.substring(0, 157) + "..." : message;
    }
  } catch {
    // Use default text
  }

  return {
    title: "BarcodeBox Message",
    description: text,
    openGraph: {
      title: "BarcodeBox Message",
      description: text,
      type: "website",
      siteName: "BarcodeBox",
    },
    twitter: {
      card: "summary",
      title: "BarcodeBox Message",
      description: text,
    },
  };
}

export default async function SmartTextPage({ params }: PageProps) {
  let message: string | null = null;
  let error = false;

  try {
    message = await getMessage(params.slug);
  } catch {
    error = true;
  }

  if (error || !message) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
        <div className="animate-fade-in-up text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Link Expired or Invalid
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            This smart text message may have expired (messages last 30 days) or
            the link is invalid. Please ask the sender for a new QR code.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Messages expire after 30 days</span>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-gray-400">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <QrCode className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs">Powered by BarcodeBox</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#534AB7] via-[#6549c7] to-[#7C3AED] px-6 py-12 relative overflow-hidden animate-gradient">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-400/10 rounded-full blur-2xl" />
      </div>

      {/* Message content */}
      <div className="relative z-10 max-w-2xl w-full text-center animate-fade-in-up">
        {/* Decorative line */}
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-8" />

        <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-snug sm:leading-tight tracking-tight text-balance">
          &ldquo;{message}&rdquo;
        </blockquote>

        {/* Decorative line */}
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-8" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 text-white/40">
        <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
          <QrCode className="w-3 h-3 text-white/60" />
        </div>
        <span className="text-xs font-medium">Powered by BarcodeBox</span>
      </div>
    </div>
  );
}
