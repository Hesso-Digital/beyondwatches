"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PARTS = ["Sapphire crystal", "Hands", "Dial", "Automatic movement", "Case · 39 mm", "Caseback"];
const SPECS = ["39 mm case", "46 mm lug-to-lug", "Automatic", "Edition of 300", "Date window, no magnifier"];

/** Stage 2 will replace this with a frame-by-frame exploded watch. For now: a quiet line-drawn hint. */
export default function ExplodedTeaser() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<SVGGElement>(".xp-layer");
      layers.forEach((g, i) => {
        gsap.fromTo(
          g,
          { y: 0 },
          {
            y: (i - (layers.length - 1) / 2) * 26,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "center 40%", scrub: 0.6 },
          },
        );
      });
      gsap.fromTo(".xp-label", { autoAlpha: 0 }, {
        autoAlpha: 1, stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 45%", end: "center 40%", scrub: 0.6 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="section exploded" aria-labelledby="xp-title">
      <div className="exploded-copy">
        <p className="eyebrow">Inside the watch</p>
        <h2 id="xp-title" className="section-title">Exploded view<span className="muted"> — coming soon</span></h2>
        <p className="lede">Every part, frame by frame, as you scroll. Until then, the essentials.</p>
        <ul className="specs">
          {SPECS.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
      <div className="exploded-art" aria-hidden="true">
        <svg viewBox="0 0 420 400" fill="none" stroke="currentColor" strokeWidth="0.8">
          {PARTS.map((p, i) => {
            const y = 110 + i * 40;
            const rx = i === 0 ? 112 : i === 1 ? 70 : 120 - (i === 5 ? 6 : 0);
            return (
              <g className="xp-layer" key={p}>
                <ellipse cx="150" cy={y} rx={rx} ry={rx * 0.28} opacity={0.35 + i * 0.1} />
                {i === 1 && <path d={`M150 ${y} l40 -6 M150 ${y} l-22 -10`} />}
                {i === 3 && <ellipse cx="150" cy={y} rx="60" ry="16" strokeDasharray="2 3" />}
                <line x1={150 + rx + 8} y1={y} x2="290" y2={y} opacity="0.4" className="xp-label" />
                <text x="296" y={y + 3} className="xp-label xp-text" fill="currentColor" stroke="none">{p}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
