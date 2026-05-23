"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  Copy,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type ScanResult = {
  data: string;
  isUrl: boolean;
};

export default function QrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return /^https?:\/\//i.test(text) || /^www\./i.test(text);
    }
  };

  const stopScanning = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
      setResult({ data: code.data, isUrl: isUrl(code.data) });
      stopScanning();
      return;
    }

    animationRef.current = requestAnimationFrame(scanFrame);
  }, [stopScanning]);

  const startScanning = useCallback(async () => {
    setError(null);
    setResult(null);
    setPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        animationRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      const error = err as Error;
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setError("Camera permission denied. Please allow camera access.");
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setError("No camera found on this device.");
      } else {
        setError("Failed to access camera. Please try again.");
      }
    }
  }, [scanFrame]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = result.data;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      {/* Camera view / Placeholder */}
      <div className="relative aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-gray-900">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                <div className="scanner-corner scanner-corner-tl" />
                <div className="scanner-corner scanner-corner-tr" />
                <div className="scanner-corner scanner-corner-bl" />
                <div className="scanner-corner scanner-corner-br" />
                {/* Scan line */}
                <div className="absolute left-2 right-2 h-0.5 bg-brand-500/80 animate-scan-line shadow-[0_0_8px_rgba(83,74,183,0.6)]" />
              </div>
            </div>
            {/* Scanning indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                Scanning...
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
            {error ? (
              <>
                <AlertCircle className="w-12 h-12 text-red-400" />
                <p className="text-sm text-red-400 text-center px-4">
                  {error}
                </p>
                {permissionDenied && (
                  <p className="text-xs text-gray-500 text-center px-6">
                    Go to your browser settings to enable camera access for this
                    site.
                  </p>
                )}
              </>
            ) : result ? (
              <div className="flex flex-col items-center gap-3 p-6">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
                <p className="text-green-400 font-medium">QR Code Detected!</p>
              </div>
            ) : (
              <>
                <Camera className="w-12 h-12 opacity-50" />
                <p className="text-sm opacity-75">
                  Tap the button below to start scanning
                </p>
              </>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isScanning && !result && (
          <Button
            onClick={startScanning}
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-6 gap-2"
            size="lg"
          >
            <Camera className="w-5 h-5" />
            Start Scanner
          </Button>
        )}
        {isScanning && (
          <Button
            onClick={stopScanning}
            variant="outline"
            className="rounded-full px-6 gap-2"
            size="lg"
          >
            <CameraOff className="w-5 h-5" />
            Stop Scanner
          </Button>
        )}
        {result && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-full px-6 gap-2"
            size="lg"
          >
            <RotateCcw className="w-5 h-5" />
            Scan Again
          </Button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="animate-fade-in-up rounded-2xl bg-gray-50 border border-gray-100 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                result.isUrl
                  ? "bg-blue-100 text-blue-600"
                  : "bg-brand-100 text-brand-600"
              }`}
            >
              {result.isUrl ? (
                <ExternalLink className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-1">
                {result.isUrl ? "URL Detected" : "Text Detected"}
              </p>
              <p className="text-sm text-gray-900 break-all font-mono bg-white rounded-lg p-3 border border-gray-100">
                {result.data}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {result.isUrl && (
              <Button
                asChild
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl gap-2"
              >
                <a
                  href={result.data}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </a>
              </Button>
            )}
            <Button
              onClick={handleCopy}
              variant={result.isUrl ? "outline" : "default"}
              className={`flex-1 rounded-xl gap-2 ${
                !result.isUrl
                  ? "bg-brand-500 hover:bg-brand-600 text-white"
                  : ""
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
