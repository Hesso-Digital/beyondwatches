/**
 * Live sky: gradient per theme + stars. Day: none, Twilight: 32, Night: 45.
 * Star positions are a fixed placeholder field (seeded), to be replaced by the
 * exact Juhu 11 PM star map.
 */
function stars() {
  let s = 1932;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 45 }, (_, i) => ({
    i,
    x: +(rnd() * 100).toFixed(2),
    y: +(rnd() * 62).toFixed(2),
    r: +(0.35 + rnd() * (i < 6 ? 0.9 : 0.5)).toFixed(2),
    d: +(rnd() * 6).toFixed(2),
  }));
}
const STARS = stars();

export default function Sky({ className = "" }: { className?: string }) {
  return (
    <div className={`sky ${className}`} aria-hidden="true">
      <div className="sky-grad sky-grad--day" />
      <div className="sky-grad sky-grad--twilight" />
      <div className="sky-grad sky-grad--night" />
      <div className="stars">
        {STARS.map((st) => (
          <span
            key={st.i}
            className={`star ${st.i < 32 ? "star--a" : "star--b"}`}
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: `${st.r * 2.4}px`, height: `${st.r * 2.4}px`, animationDelay: `${st.d}s` }}
          />
        ))}
      </div>
    </div>
  );
}
