"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SmartTextToggle from "@/components/SmartTextToggle";
import {
  Download,
  Loader2,
  QrCode,
  AlertCircle,
  Sparkles,
  Link2,
} from "lucide-react";
import type {
  HistoryEntry,
  CreateMessageResponse,
  GenerateQrResponse,
} from "@/lib/utils";

interface QrGeneratorProps {
  onGenerated: (entry: HistoryEntry) => void;
}

export default function QrGenerator({ onGenerated }: QrGeneratorProps) {
  const [text, setText] = useState("");
  const [smartText, setSmartText] = useState("");
  const [isSmartMode, setIsSmartMode] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setQrBase64(null);
    setGeneratedUrl(null);

    const content = isSmartMode ? smartText.trim() : text.trim();
    if (!content) {
      setError(
        isSmartMode ? "Please enter a message" : "Please enter a URL or text"
      );
      return;
    }

    if (isSmartMode && content.length > 500) {
      setError("Smart text must be 500 characters or less");
      return;
    }

    setIsLoading(true);

    try {
      let qrContent = content;

      if (isSmartMode) {
        // First create the smart text message
        const messageRes = await fetch("/api/create-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content }),
        });

        if (!messageRes.ok) {
          const errData = await messageRes.json();
          throw new Error(
            errData.error || "Failed to create smart text message"
          );
        }

        const messageData: CreateMessageResponse = await messageRes.json();
        qrContent = messageData.url;
        setGeneratedUrl(messageData.url);
      }

      // Generate the QR code
      const qrRes = await fetch("/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qrContent }),
      });

      if (!qrRes.ok) {
        const errData = await qrRes.json();
        throw new Error(errData.error || "Failed to generate QR code");
      }

      const qrData: GenerateQrResponse = await qrRes.json();
      setQrBase64(qrData.qrBase64);

      // Add to history
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        type: isSmartMode ? "smart" : "url",
        content: isSmartMode ? content : qrContent,
        qrBase64: qrData.qrBase64,
        timestamp: Date.now(),
      };
      onGenerated(entry);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrBase64) return;

    const link = document.createElement("a");
    link.download = `qr-studio-${Date.now()}.png`;
    link.href = qrBase64;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Smart Text Toggle */}
      <SmartTextToggle isSmartMode={isSmartMode} onToggle={setIsSmartMode} />

      {/* Input Area */}
      <div className="space-y-3">
        {isSmartMode ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-brand-600 font-medium">
              <Sparkles className="w-4 h-4" />
              Enter your message (max 500 chars)
            </div>
            <Textarea
              id="smart-text-input"
              placeholder="Type your message here... This will be hosted on a beautiful page with a unique QR code."
              value={smartText}
              onChange={(e) => setSmartText(e.target.value)}
              rows={4}
              maxLength={500}
              className="resize-none rounded-xl border-gray-200 focus:border-brand-300 focus:ring-brand-200"
            />
            <div className="flex justify-end">
              <span
                className={`text-xs ${
                  smartText.length > 450 ? "text-red-500" : "text-gray-400"
                }`}
              >
                {smartText.length}/500
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Link2 className="w-4 h-4" />
              Enter URL or text
            </div>
            <Input
              id="url-text-input"
              placeholder="https://example.com or any text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-brand-300 focus:ring-brand-200 h-12"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
            />
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl h-12 text-base gap-2 shadow-lg shadow-brand-500/20"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <QrCode className="w-5 h-5" />
            Generate QR Code
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {qrBase64 && (
        <div className="animate-fade-in-up space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-brand-500/10 border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrBase64}
                alt="Generated QR Code"
                className="w-56 h-56 sm:w-64 sm:h-64"
                width={256}
                height={256}
              />
            </div>
          </div>

          {generatedUrl && (
            <div className="p-3 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-medium text-brand-600 mb-1">
                Smart Text URL
              </p>
              <p className="text-sm text-brand-800 font-mono break-all">
                {generatedUrl}
              </p>
            </div>
          )}

          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full rounded-xl h-11 gap-2 border-gray-200"
          >
            <Download className="w-4 h-4" />
            Download QR Code (PNG)
          </Button>
        </div>
      )}
    </div>
  );
}
