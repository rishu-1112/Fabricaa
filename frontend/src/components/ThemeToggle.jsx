import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const ink = theme === "ink";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={ink}
      aria-label={ink ? "Switch to paper theme" : "Switch to ink theme"}
      title={ink ? "Paper theme" : "Ink theme"}
      className={`theme-chip rounded-full border p-2 transition hover:border-emerald-700/40 ${className}`}
    >
      {ink ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
