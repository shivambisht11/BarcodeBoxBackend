"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Clock,
  Link2,
  MessageSquareText,
  QrCode,
  Trash,
} from "lucide-react";
import type { HistoryEntry } from "@/lib/utils";

interface HistoryTabProps {
  entries: HistoryEntry[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryTab({
  entries,
  onDelete,
  onClearAll,
}: HistoryTabProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-4">
          <QrCode className="w-10 h-10 text-gray-300" />
        </div>
        <p className="font-medium text-gray-500 mb-1">No QR codes yet</p>
        <p className="text-sm text-gray-400">
          Generated QR codes will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {entries.length} QR code{entries.length !== 1 ? "s" : ""} generated
        </p>
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 text-xs"
        >
          <Trash className="w-3.5 h-3.5" />
          Clear All
        </Button>
      </div>

      <Separator />

      {/* History list */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition-colors"
          >
            {/* QR thumbnail */}
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.qrBase64}
                alt="QR code thumbnail"
                className="w-14 h-14 rounded-lg border border-gray-200"
                width={56}
                height={56}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={entry.type === "smart" ? "default" : "secondary"}
                  className={`text-[10px] px-1.5 py-0 h-5 ${
                    entry.type === "smart"
                      ? "bg-brand-100 text-brand-700 hover:bg-brand-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {entry.type === "smart" ? (
                    <MessageSquareText className="w-3 h-3 mr-1" />
                  ) : (
                    <Link2 className="w-3 h-3 mr-1" />
                  )}
                  {entry.type === "smart" ? "Smart" : "URL"}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(entry.timestamp)}
                </div>
              </div>
              <p className="text-sm text-gray-700 truncate font-mono">
                {entry.content}
              </p>
            </div>

            {/* Delete */}
            <Button
              onClick={() => onDelete(entry.id)}
              variant="ghost"
              size="sm"
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
