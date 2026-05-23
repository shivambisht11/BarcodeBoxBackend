# QR Studio

**QR Studio** is a free, full-featured QR code web application built with Next.js 14. Scan, generate, and share QR codes — all from your browser.

## Features

- 📷 **Scan QR Codes** — Camera-based scanner with real-time detection
- 🔲 **Generate QR Codes** — Create QR codes for any URL or text, download as PNG
- 💬 **Smart Text QR** — Share text messages via hosted pages with unique QR codes
- 📱 **Mobile Responsive** — Works beautifully on any device
- 🎨 **Beautiful Design** — Modern UI with glassmorphism and smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Storage**: Vercel KV (for smart text messages)
- **QR Generation**: `qrcode` npm package (server-side)
- **QR Scanning**: `jsQR` (client-side canvas scanning)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd qr-studio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Vercel KV credentials (see [KV Setup](#vercel-kv-setup) below).

   > **Note**: The app works without KV credentials — only the Smart Text feature will be disabled.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel KV Setup

Smart Text QR requires a Vercel KV store to persist messages.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database** → **KV**
3. Give it a name (e.g., `qr-studio-kv`)
4. Select the **Free** plan
5. Once created, go to the KV store's **Settings** tab
6. Copy the `KV_URL` and `KV_REST_API_TOKEN` values
7. Add them to your `.env.local` file:

   ```env
   KV_URL=your_kv_url_here
   KV_REST_API_TOKEN=your_token_here
   ```

8. For production, add these same variables to your Vercel project's **Environment Variables** in Settings.

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables (`KV_URL`, `KV_REST_API_TOKEN`)
5. Click **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project Structure

```
app/
  page.tsx                    # Landing page
  layout.tsx                  # Root layout with fonts & metadata
  app/
    page.tsx                  # Main app with Scan/Generate/History tabs
  m/
    [slug]/
      page.tsx                # Smart text message display page
  api/
    create-message/
      route.ts                # POST — Create smart text message
    generate-qr/
      route.ts                # POST — Generate QR code as base64
    health/
      route.ts                # GET — Health check endpoint
components/
  QrScanner.tsx               # Camera-based QR code scanner
  QrGenerator.tsx             # QR code generator with smart text mode
  HistoryTab.tsx              # Generated QR code history (localStorage)
  SmartTextToggle.tsx         # Smart text mode toggle switch
  ui/                         # shadcn/ui components
lib/
  kv.ts                       # Vercel KV helper functions
  qr.ts                       # QR code generation helper
  utils.ts                    # Utilities and TypeScript types
```

## API Endpoints

| Method | Route                | Description                         |
|--------|----------------------|-------------------------------------|
| GET    | `/api/health`        | Health check — returns status + timestamp |
| POST   | `/api/generate-qr`   | Generate QR code as base64 PNG      |
| POST   | `/api/create-message` | Create smart text message (needs KV) |

## License

Free to use. No restrictions.
