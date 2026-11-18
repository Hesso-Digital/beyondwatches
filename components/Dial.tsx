"use client";
import Sky from "./Sky";
import { useNow, zoneParts } from "./useClock";

/** The sky becomes the dial: minimal indices, date window (no magnifier), hands on Juhu time. */
export default function Dial() {
  const now = useNow(1000);
  const t = now ? zoneParts(now, "Asia/Kolkata") : { h: 10, m: 8, s: 26 };
  const hr = ((t.h % 12) + t.m / 60) * 30;
  const mn = (t.m + t.s / 60) * 6;
  const date = now ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "Asia/Kolkata" }).format(now) : "15";
  return (
    <div className="dial" aria-hidden="true">
      <div className="dial-face">
        <Sky className="sky--dial" />
        <svg className="dial-marks" viewBox="-100 -100 200 200">
          <circle r="97" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
          {Array.from({ length: 12 }, (_, i) =>
            i === 3 ? null : (
              <line key={i} x1="0" y1={i === 0 ? -86 : -88} x2="0" y2="-76" stroke="currentColor"
                strokeWidth={i === 0 ? 2.4 : 1.2} transform={`rotate(${i * 30})`} strokeLinecap="round" />
            ),
          )}
          {/* date window at 3 o'clock, flush — no cyclops */}
          <rect x="66" y="-7" width="20" height="14" rx="1" fill="rgba(0,0,0,.25)" stroke="currentColor" strokeWidth="0.5" />
          <text x="76" y="3.4" textAnchor="middle" fontSize="9" fill="currentColor" className="dial-date">{date}</text>
          <text x="0" y="-46" textAnchor="middle" fontSize="7" letterSpacing="3.2" fill="currentColor" className="dial-brand">BEYOND</text>
          <text x="0" y="50" textAnchor="middle" fontSize="4.6" letterSpacing="2.2" fill="currentColor" opacity="0.8">JUHU 08-26</text>
          <g stroke="currentColor" strokeLinecap="round">
            <line x1="0" y1="10" x2="0" y2="-50" strokeWidth="2.6" transform={`rotate(${hr})`} />
            <line x1="0" y1="12" x2="0" y2="-74" strokeWidth="1.6" transform={`rotate(${mn})`} />
          </g>
          <circle r="2.6" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
