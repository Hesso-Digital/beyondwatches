export type Theme = "day" | "twilight" | "night";
export const THEMES: Theme[] = ["day", "twilight", "night"];
export const THEME_KEY = "beyond-theme";

export const WATCH_NAME = "JUHU 08-26";

export const THEME_META: Record<
  Theme,
  { label: string; sky: string; skyTime: string; stars: number; dial: string; case: string; story: string }
> = {
  day: {
    label: "Day",
    sky: "Ice Blue → Navy",
    skyTime: "12:00 PM",
    stars: 0,
    dial: "Ice-blue to navy dial",
    case: "Silver steel",
    story: "Noon over Runway 08/26. Ice blue at the horizon, deepening to navy overhead. No stars, only the open sky.",
  },
  twilight: {
    label: "Twilight",
    sky: "Sand → Brown",
    skyTime: "6:47 PM",
    stars: 32,
    dial: "Sand to brown dial",
    case: "Bronze PVD",
    story: "6:47 PM, the last light over the aerodrome. Sand fading into brown, and the first 32 stars.",
  },
  night: {
    label: "Night",
    sky: "Charcoal → Black",
    skyTime: "11:00 PM",
    stars: 45,
    dial: "Charcoal to black dial",
    case: "Black DLC",
    story: "11 PM above Juhu. Charcoal into black, with the 45 stars of the night sky over the field.",
  },
};

/** Day 06:00–17:00, Twilight 17:00–19:30, Night otherwise (visitor local time). */
export function autoTheme(d = new Date()): Theme {
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= 360 && m < 1020) return "day";
  if (m >= 1020 && m < 1170) return "twilight";
  return "night";
}

/** Inline script run before paint so the first frame already has the right theme. */
export const themeInitScript = `(function(){var h=document.documentElement;try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='day'&&t!=='twilight'&&t!=='night'){var d=new Date(),m=d.getHours()*60+d.getMinutes();t=m>=360&&m<1020?'day':m>=1020&&m<1170?'twilight':'night'}h.dataset.theme=t}catch(e){h.dataset.theme='night'}})();`;
