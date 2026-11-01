"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`icon-btn ${className}`}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {/* Both icons render; CSS shows the right one, so server HTML is never wrong. */}
      <Sun size={17} aria-hidden="true" className="hidden [[data-theme=dark]_&]:block" />
      <Moon size={17} aria-hidden="true" className="block [[data-theme=dark]_&]:hidden" />
    </button>
  );
}
