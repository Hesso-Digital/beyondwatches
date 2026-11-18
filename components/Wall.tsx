"use client";
import { EDITION_SIZE, padNo } from "@/lib/config";
import { THEME_META } from "@/lib/theme";
import { useEdition } from "./EditionProvider";

/** All 300 numbers. Dark = available, amber = held, lit = claimed (first name + initial). */
export default function Wall() {
  const { slots, selected, select } = useEdition();
  const list = slots ?? Array.from({ length: EDITION_SIZE }, (_, i) => ({ no: i + 1, status: "available" as const }));
  const held = list.filter((s) => s.status === "held").length;
  const claimed = list.filter((s) => s.status === "claimed").length;

  return (
    <section className="section wall-section" id="wall" aria-labelledby="wall-title">
      <div className="wall-head">
        <div>
          <p className="eyebrow">The 300 Wall</p>
          <h2 id="wall-title" className="section-title">Every number, in one place.</h2>
        </div>
        <ul className="wall-legend">
          <li><i className="dot" /> Available {EDITION_SIZE - held - claimed}</li>
          <li><i className="dot dot--held" /> Held {held}</li>
          <li><i className="dot dot--lit" /> Claimed {claimed}</li>
          <li className="demo-tag">Demo data</li>
        </ul>
      </div>
      <div className="wall" role="group" aria-label="Serial numbers 001 to 300">
        {list.map((s) => {
          const cls = `cell cell--${s.status} ${s.no === selected ? "is-selected" : ""} ${"mine" in s && s.mine ? "is-mine" : ""}`;
          const label =
            s.status === "claimed"
              ? `No. ${padNo(s.no)}, claimed by ${"holder" in s ? s.holder : ""}${"variant" in s && s.variant ? `, ${THEME_META[s.variant].label}` : ""}`
              : s.status === "held" ? `No. ${padNo(s.no)}, on hold` : `No. ${padNo(s.no)}, available`;
          return (
            <button
              key={s.no}
              type="button"
              className={cls}
              aria-label={label}
              aria-pressed={s.no === selected}
              disabled={s.status !== "available"}
              onClick={() => {
                select(s.no);
                document.getElementById("claim")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span className="cell-no">{padNo(s.no)}</span>
              {s.status === "claimed" && "holder" in s && <span className="cell-name">{s.holder}</span>}
              {s.status === "held" && <span className="cell-name">Held</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
