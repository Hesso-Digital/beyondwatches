# BEYOND · JUHU 08-26 — "Look Up."

Stage 1 of the BEYOND website. The site is not a shop: it **is** Juhu Aerodrome.
One scroll-driven journey down Runway 08/26 → the hangar and the Puss Moth → the watch → into the dial,
where the sky becomes the dial. Then the story (1928 / 1932 / Today), specs, **Claim Your Number** and the **300 Wall**.

Next.js 15 (App Router, TypeScript) · GSAP + ScrollTrigger · Lenis. Fully static, deployed on Vercel.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass)
```

## Change the WhatsApp number

Edit `lib/config.ts`:

```ts
export const WHATSAPP_NUMBER = "910000000000"; // TODO: digits only, country code first, no "+"
```

Every WhatsApp link (top bar, claim/payment, footer) is built from it via `whatsappLink()`.

## Structure

```
app/
  layout.tsx        fonts (Cormorant Garamond + Inter), SEO/OG meta, pre-paint theme script
  page.tsx          page order
  globals.css       all styles; theme palettes via [data-theme]; plate CSS (bottom) is generated
  icon.svg          favicon (logo mark only)
components/
  Logo.tsx          THE logo (wings + chevron mark, BEYOND wordmark). variant="full" | "mark", animate (draw-on)
  Intro.tsx         loader: logo strokes draw on, then lift away (shorter on repeat visits)
  TopBar.tsx        logo · MY TIME / JUHU TIME clocks · Day/Twilight/Night toggle (+Auto) · Claim · WhatsApp
  ThemeProvider.tsx theme state; auto by visitor time (Day 06:00–17:00, Twilight 17:00–19:30, Night), manual choice in localStorage
  Sky.tsx           live sky gradients + stars (Day 0, Twilight 32, Night 45)
  Journey.tsx       pinned scroll timeline: runway → hangar + quote → watch → dial
  Plate.tsx         theme-variant photo plates (CSS backgrounds: only the active theme downloads)
  Dial.tsx          the sky-dial with hands on Juhu time, flush date window (no cyclops)
  ExplodedTeaser.tsx  specs + "Exploded view — coming soon" (stage 2 replaces this)
  Story.tsx         1928 / 1932 / Today
  ClaimFlow.tsx     variant → number on the brass YOUR NUMBER plate → CLAIM → 10-min hold → Full / EMI
  Wall.tsx          the 300 Wall: dark = available, amber = held, lit = claimed (first name + initial)
  EditionProvider.tsx React context over the edition store
lib/
  config.ts         WhatsApp number, edition size, site URL
  theme.ts          theme names, sky descriptions, auto-theme rule
  edition.ts        EditionStore interface + createDemoStore() (DEMO DATA, client-only)
public/plates/      WebP plates, 900w (mobile) + 1600w (desktop), per theme
public/og.jpg       social preview image
scripts/            make_plates.py (crop/clean/grade the plates), og.html (source of og.jpg)
```

## Connecting a real backend (claims, holds, payments)

`lib/edition.ts` defines `EditionStore` (`getSlots`, `hold`, `release`, `paidCount`, `subscribe`).
The demo implementation keeps placeholder claimed/held numbers in the browser only. To go live, implement the
same interface against an API (server-side 10-minute holds, payment webhooks marking slots `claimed`,
realtime updates for the Wall) and swap `createDemoStore()` in `components/EditionProvider.tsx`.

## Not in stage 1 (planned)

Payments (Full + EMI checkout), exploded 3D watch on scroll, per-variant watch pages, share poster
("I'm 042 / 300 — JUHU 08-26"), QR personal hangar pages, gift flow, launch waves + countdown, Day 1/7/30 emails,
exact Juhu star map, real prototype photography.

Not on the site by design: About Us, Blog, Juhu Beach, COD, discounts.
