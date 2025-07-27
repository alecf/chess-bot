"use client";

import { Crown } from "lucide-react";

interface ColorSelectionProps {
  onColorSelect: (color: "w" | "b") => void;
}

export default function ColorSelection({ onColorSelect }: ColorSelectionProps) {
  return (
    <div className="flex gap-6">
      <button
        onClick={() => onColorSelect("w")}
        className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "2px solid var(--card-border)",
        }}
      >
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
          style={{
            backgroundColor: "var(--text-muted)",
            opacity: 0.2,
          }}
        >
          <Crown className="w-8 h-8" style={{ color: "var(--text-primary)" }} />
        </div>
        <span
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          White
        </span>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Go First
        </span>
      </button>

      <button
        onClick={() => onColorSelect("b")}
        className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "var(--text-primary)",
          border: "2px solid var(--card-border)",
        }}
      >
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
          style={{
            backgroundColor: "var(--text-secondary)",
            opacity: 0.3,
          }}
        >
          <Crown className="w-8 h-8" style={{ color: "var(--background)" }} />
        </div>
        <span
          className="text-lg font-semibold"
          style={{ color: "var(--background)" }}
        >
          Black
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          AI Goes First
        </span>
      </button>
    </div>
  );
}
