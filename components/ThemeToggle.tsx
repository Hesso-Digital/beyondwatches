"use client";
import { THEMES, THEME_META } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, isAuto, setTheme, resetAuto } = useTheme();
  return (
    <div className="toggle-wrap">
      <div className="toggle" role="radiogroup" aria-label="Time of day">
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={theme === t}
            className={`toggle-btn ${theme === t ? "is-active" : ""}`}
            onClick={() => setTheme(t)}
          >
            {THEME_META[t].label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`toggle-auto ${isAuto ? "is-active" : ""}`}
        onClick={resetAuto}
        aria-pressed={isAuto}
        title="Follow your local time"
      >
        Auto
      </button>
    </div>
  );
}
