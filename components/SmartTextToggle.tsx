"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquareText, Link2 } from "lucide-react";

interface SmartTextToggleProps {
  isSmartMode: boolean;
  onToggle: (isSmartMode: boolean) => void;
}

export default function SmartTextToggle({
  isSmartMode,
  onToggle,
}: SmartTextToggleProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-2 flex-1">
        {isSmartMode ? (
          <MessageSquareText className="w-4 h-4 text-brand-500" />
        ) : (
          <Link2 className="w-4 h-4 text-gray-500" />
        )}
        <Label
          htmlFor="smart-mode"
          className="text-sm font-medium cursor-pointer select-none"
        >
          Smart Text Mode
        </Label>
      </div>
      <Switch
        id="smart-mode"
        checked={isSmartMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-brand-500"
      />
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
          isSmartMode
            ? "bg-brand-100 text-brand-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {isSmartMode ? "ON" : "OFF"}
      </span>
    </div>
  );
}
