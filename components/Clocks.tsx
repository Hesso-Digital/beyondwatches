"use client";
import { fmtTime, useNow } from "./useClock";

export default function Clocks() {
  const now = useNow(1000);
  return (
    <div className="clocks" aria-label="Clocks">
      <span className="clock"><small>My time</small><time suppressHydrationWarning>{fmtTime(now)}</time></span>
      <span className="clock"><small>Juhu time</small><time suppressHydrationWarning>{fmtTime(now, "Asia/Kolkata")}</time></span>
    </div>
  );
}
