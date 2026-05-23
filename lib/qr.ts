import QRCode from "qrcode";

/**
 * Generate a QR code as a base64-encoded PNG data URL
 */
export async function generateQrBase64(text: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });
  return dataUrl;
}
