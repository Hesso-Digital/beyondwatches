/**
 * BEYOND logo: two swept wing strokes rising outward from a small central
 * upward chevron, above a wide-tracked serif wordmark. Single colour
 * (currentColor) so it follows the active theme.
 *
 * variant="full" → mark + wordmark, variant="mark" → mark only.
 * animate → strokes draw on (used by the intro loader).
 */
type Props = {
  variant?: "full" | "mark";
  animate?: boolean;
  className?: string;
  title?: string;
};

/** Mark paths, viewBox "-100 0 200 44". Also used by app/icon.svg. */
export const MARK_PATHS = [
  // left wing: outer + inner feather
  "M -97 3 C -62 11 -30 17 -12 40",
  "M -80 13 C -56 19 -37 24 -24 35",
  // right wing (mirror)
  "M 97 3 C 62 11 30 17 12 40",
  "M 80 13 C 56 19 37 24 24 35",
  // central upward chevron
  "M -10 35 L 0 25 L 10 35",
];

export function LogoMark({ animate = false, className = "" }: { animate?: boolean; className?: string }) {
  return (
    <svg
      className={`logo-mark ${animate ? "logo-mark--draw" : ""} ${className}`}
      viewBox="-100 0 200 44"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {MARK_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          strokeWidth={i % 2 === 1 && i < 4 ? 1.4 : 2}
          style={animate ? ({ ["--i" as string]: i } as React.CSSProperties) : undefined}
        />
      ))}
    </svg>
  );
}

export default function Logo({ variant = "full", animate = false, className = "", title = "BEYOND" }: Props) {
  return (
    <span className={`logo logo--${variant} ${animate ? "logo--animate" : ""} ${className}`} role="img" aria-label={title}>
      <LogoMark animate={animate} />
      {variant === "full" && <span className="logo-word" aria-hidden="true">BEYOND</span>}
    </span>
  );
}
