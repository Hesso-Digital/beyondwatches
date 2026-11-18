"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Plate from "./Plate";
import Sky from "./Sky";
import Dial from "./Dial";
import { useTheme } from "./ThemeProvider";
import { THEME_META, WATCH_NAME } from "@/lib/theme";

/**
 * One pinned stage. Scrolling moves the camera INTO the scene:
 * Runway 08/26 → down the runway to the hangar → Puss Moth + quote →
 * the watch → into the dial, where the sky becomes the dial.
 */
export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const meta = THEME_META[theme];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap.set(q(".layer-hangar, .layer-watch, .layer-dial"), { autoAlpha: 0 });
      gsap.set(q(".q-line, .dial-caption"), { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=700%",
          pin: q(".journey-stage")[0],
          scrub: 0.6,
          anticipatePin: 1,
          onToggle: (self) => {
            document.documentElement.dataset.bar = self.isActive ? "media" : "page";
          },
        },
      });

      tl.to(q(".hero-copy, .scroll-cue"), { autoAlpha: 0, y: -16, duration: 0.8 }, 0)
        // Screen 1 → 2: down Runway 08/26 to the hangar
        .fromTo(q(".layer-landing"), { scale: 1 }, { scale: 3.6, duration: 3.2, ease: "power2.in" }, 0)
        .fromTo(q(".layer-hangar"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 2.4)
        .fromTo(q(".layer-hangar .plate"), { scale: 1.35 }, { scale: 1.05, duration: 1.6, ease: "power2.out" }, 2.4)
        .to(q(".layer-landing"), { autoAlpha: 0, duration: 0.5 }, 2.9)
        // The quote, line by line
        .to(q(".q-1"), { autoAlpha: 1, y: 0, duration: 0.7 }, 3.5)
        .to(q(".q-2"), { autoAlpha: 1, y: 0, duration: 0.7 }, 4.4)
        .to(q(".q-3"), { autoAlpha: 1, y: 0, duration: 0.7 }, 5.3)
        .to(q(".q-4"), { autoAlpha: 1, y: 0, duration: 0.7 }, 6.2)
        .to(q(".q-line"), { autoAlpha: 0, y: -12, duration: 0.6 }, 7.4)
        // Screen 2 → 3: into the hangar, the watch
        .to(q(".layer-hangar .plate"), { scale: 2.6, duration: 1.8, ease: "power2.in" }, 7.4)
        .fromTo(q(".layer-watch"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 8.4)
        .fromTo(q(".layer-watch .plate"), { scale: 1.25 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 8.4)
        .to(q(".layer-hangar"), { autoAlpha: 0, duration: 0.4 }, 8.9)
        // into the dial: the sky becomes the dial
        .to(q(".layer-watch .plate"), { scale: 2.4, duration: 1.4, ease: "power2.in" }, 10.2)
        .fromTo(q(".layer-dial"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 10.7)
        .fromTo(q(".layer-dial .dial"), { scale: 2.6 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 10.7)
        .to(q(".layer-watch"), { autoAlpha: 0, duration: 0.4 }, 11.3)
        .to(q(".dial-caption"), { autoAlpha: 1, y: 0, duration: 0.7 }, 12.8)
        .to({}, { duration: 0.8 });
    }, el);
    return () => {
      ctx.revert();
      document.documentElement.dataset.bar = "page";
    };
  }, []);

  return (
    <section ref={root} className="journey" id="top" aria-label="Juhu Aerodrome, Runway 08/26">
      <div className="journey-stage">
        <div className="layer layer-landing">
          <Sky />
          <Plate name="landing" label="Looking down Runway 08/26 at Juhu Aerodrome, palms along the field and a small hangar far at the end" />
        </div>
        <div className="layer layer-hangar">
          <Plate name="hangar" label="A de Havilland Puss Moth at the hangar, in low light and dust" />
          <div className="shade-left" />
        </div>
        <div className="layer layer-watch">
          <Plate name="watch" label={`${WATCH_NAME}, ${meta.dial}, ${meta.case}, inside the hangar`} />
        </div>
        <div className="layer layer-dial">
          <Dial />
        </div>
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        <div className="hero-copy">
          <p className="eyebrow">Juhu Aerodrome · Runway 08/26</p>
          <h1 className="hero-title">Look up.</h1>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll to fly in</span>
          <i />
        </div>

        <blockquote className="quote-block">
          <p className="q-line q-1 q-head">From a mail pouch to the global skies.</p>
          <p className="q-line q-2">It all started with one man daring to look beyond the horizon.</p>
          <p className="q-line q-3">The tools have changed, but the mindset of a true aviator hasn&rsquo;t.</p>
          <p className="q-line q-4 q-hindi" lang="hi-Latn">Ek aadmi ne kshitij se aage dekhne ki himmat ki.</p>
        </blockquote>

        <div className="dial-caption">
          <p className="eyebrow">{WATCH_NAME}</p>
          <h2 className="dial-name">{meta.label}</h2>
          <p className="dial-sky">{meta.sky} · the {meta.skyTime} sky{meta.stars ? ` · ${meta.stars} stars` : ""}</p>
          <p className="dial-story">{meta.story}</p>
          <p className="dial-spec">{meta.dial} · {meta.case}</p>
          <a className="text-link" href="#claim">Claim your number</a>
        </div>
      </div>
    </section>
  );
}
