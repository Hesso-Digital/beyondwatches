"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";

/** Brief loader: the wing mark draws itself on, the wordmark settles, then it lifts away. */
export default function Intro() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("beyond-intro") === "1";
    const hold = reduce || seen ? 500 : 2300;
    document.documentElement.classList.add("is-intro");
    const t1 = setTimeout(() => setPhase("out"), hold);
    const t2 = setTimeout(() => {
      setPhase("gone");
      document.documentElement.classList.remove("is-intro");
      try { sessionStorage.setItem("beyond-intro", "1"); } catch {}
    }, hold + 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={`intro ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <Logo variant="full" animate />
    </div>
  );
}
