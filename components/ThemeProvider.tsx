"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { autoTheme, THEME_KEY, type Theme } from "@/lib/theme";

type Ctx = { theme: Theme; isAuto: boolean; setTheme: (t: Theme) => void; resetAuto: () => void };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("night");
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    const fromDom = document.documentElement.dataset.theme as Theme | undefined;
    let stored: string | null = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch {}
    setIsAuto(!stored);
    setThemeState(fromDom ?? autoTheme());
  }, []);

  // While on auto, follow the clock (checked every minute).
  useEffect(() => {
    if (!isAuto) return;
    const id = setInterval(() => setThemeState(autoTheme()), 60_000);
    return () => clearInterval(id);
  }, [isAuto]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "day" ? "#16324f" : theme === "twilight" ? "#1c130c" : "#050506");
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setIsAuto(false);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
  }, []);

  const resetAuto = useCallback(() => {
    try { localStorage.removeItem(THEME_KEY); } catch {}
    setIsAuto(true);
    setThemeState(autoTheme());
  }, []);

  return <ThemeCtx.Provider value={{ theme, isAuto, setTheme, resetAuto }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme must be used inside ThemeProvider");
  return c;
}
