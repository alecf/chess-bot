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
        className="flex flex-col items-center p-6 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200"
      >
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
          <Crown className="w-8 h-8 text-gray-700" />
        </div>
        <span className="text-lg font-semibold text-gray-700">White</span>
        <span className="text-sm text-gray-500">Go First</span>
      </button>

      <button
        onClick={() => onColorSelect("b")}
        className="flex flex-col items-center p-6 bg-gray-800 border-2 border-gray-600 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200"
      >
        <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-3">
          <Crown className="w-8 h-8 text-gray-300" />
        </div>
        <span className="text-lg font-semibold text-gray-300">Black</span>
        <span className="text-sm text-gray-400">AI Goes First</span>
      </button>
    </div>
  );
}
