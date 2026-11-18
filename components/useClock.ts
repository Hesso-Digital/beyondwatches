"use client";
import { useEffect, useState } from "react";

/** Ticking Date, null until mounted (avoids hydration mismatch). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function fmtTime(d: Date | null, timeZone?: string) {
  if (!d) return "--:--";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(d);
}

export function zoneParts(d: Date, timeZone?: string) {
  const p = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", second: "numeric", hour12: false, timeZone }).formatToParts(d);
  const g = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return { h: g("hour") % 24, m: g("minute"), s: g("second") };
}
