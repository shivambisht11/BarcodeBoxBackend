import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---- Types ----

export interface HistoryEntry {
  id: string;
  type: "url" | "smart";
  content: string;
  qrBase64: string;
  timestamp: number;
}

export interface CreateMessageResponse {
  url: string;
  slug: string;
}

export interface GenerateQrResponse {
  qrBase64: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}
