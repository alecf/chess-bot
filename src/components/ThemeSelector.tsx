"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className="rounded-lg shadow-lg p-2"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <select
          value={theme}
          onChange={(e) =>
            setTheme(e.target.value as "system" | "light" | "dark")
          }
          className="text-sm font-medium px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            borderColor: "var(--card-border)",
          }}
        >
          <option value="system">🌓 System</option>
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>
    </div>
  );
}
