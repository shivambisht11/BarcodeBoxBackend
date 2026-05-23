import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BarcodeBox — Scan, Generate & Share QR Codes",
  description:
    "Free barcode & QR code scanner, generator, and smart text sharing app. Create QR codes for URLs, text messages, and shareable smart links.",
  keywords: ["barcode", "QR code", "scanner", "generator", "smart text", "BarcodeBox", "free"],
  openGraph: {
    title: "BarcodeBox — Scan, Generate & Share QR Codes",
    description:
      "Free barcode & QR code scanner, generator, and smart text sharing app.",
    type: "website",
    siteName: "BarcodeBox",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarcodeBox — Scan, Generate & Share QR Codes",
    description:
      "Free barcode & QR code scanner, generator, and smart text sharing app.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
