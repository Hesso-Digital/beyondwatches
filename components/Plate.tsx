/**
 * Three theme variants of one photographic plate, stacked. Images are CSS
 * backgrounds keyed to [data-theme], so the browser only downloads the active
 * theme's plate (900w on mobile, 1600w on desktop); the other themes are
 * fetched after load (html.plates-all) so toggling stays smooth.
 */
export default function Plate({ name, label }: { name: "landing" | "hangar" | "watch"; label: string }) {
  return (
    <div className={`plate plate--${name}`} role="img" aria-label={label}>
      <div className="plate-img plate-img--day" />
      <div className="plate-img plate-img--twilight" />
      <div className="plate-img plate-img--night" />
    </div>
  );
}
