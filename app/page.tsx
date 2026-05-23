import Link from "next/link";
import {
  ScanLine,
  QrCode,
  MessageSquareText,
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ScanLine,
    title: "Scan QR & Barcodes",
    description:
      "Use your phone camera to instantly scan any QR code or barcode. Get results in real-time with our blazing-fast scanner.",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    icon: QrCode,
    title: "Generate QR Codes",
    description:
      "Create beautiful QR codes for any URL or text. Download as PNG and share anywhere — completely free.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: MessageSquareText,
    title: "Smart Text QR",
    description:
      "Share messages via QR codes. We host your text on a beautiful page with a unique link — no app needed to read it.",
    gradient: "from-violet-500 to-purple-600",
  },
];

const stats = [
  { icon: Zap, label: "Instant", detail: "Real-time scanning" },
  { icon: Shield, label: "Private", detail: "Your data stays yours" },
  { icon: Sparkles, label: "Free", detail: "No fees, no subscriptions" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">BarcodeBox</span>
          </div>
          <Button
            size="sm"
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-5 gap-1.5"
          >
            <Smartphone className="w-4 h-4" />
            Get the App
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-50 to-violet-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            100% Free — Available on Android
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 animate-fade-in-up">
            BarcodeBox
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">
              Scan, Generate, Share
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up-delay-1">
            The all-in-one barcode & QR code app. Scan codes with your camera,
            generate QR for any link, or share smart text messages — right from
            your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-2">
            <Button
              size="lg"
              className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300 gap-2"
            >
              <Download className="w-5 h-5" />
              Download App
            </Button>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-gray-200 hover:bg-gray-50"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 text-brand-500" />
                  <span className="font-semibold text-gray-900">
                    {stat.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need in one app
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three powerful features, zero complexity. Download the app and get
              started instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`group relative overflow-hidden border-gray-100 hover:border-brand-200 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10 animate-fade-in-up-delay-${
                  index + 1
                }`}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-brand-500 to-violet-600 p-10 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Download BarcodeBox on your phone and start scanning, generating,
                and sharing QR codes instantly — completely free.
              </p>
              <Button
                size="lg"
                className="bg-white text-brand-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold shadow-lg transition-all duration-300 gap-2"
              >
                <Download className="w-5 h-5" />
                Download BarcodeBox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">BarcodeBox</span>
          </div>
          <p className="text-sm text-gray-500">
            Free to use • No signup required • Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
