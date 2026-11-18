"use client";
import { useEffect, useState } from "react";
import { EDITION_SIZE, padNo, whatsappLink } from "@/lib/config";
import { FOUNDERS_LIMIT, STRAP_SET_PRICE_INR } from "@/lib/edition";
import { THEMES, THEME_META, WATCH_NAME } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";
import { useEdition } from "./EditionProvider";
import { WhatsAppIcon } from "./Icons";

function useCountdown(until?: number) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!until) return setLeft(0);
    const tick = () => setLeft(Math.max(0, until - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [until]);
  return left;
}

export default function ClaimFlow() {
  const { theme, setTheme } = useTheme();
  const { slots, paid, selected, select, hold, release } = useEdition();
  const [error, setError] = useState<string | null>(null);
  const [pay, setPay] = useState<"full" | "emi">("full");
  const mine = slots?.find((s) => s.mine);
  const left = useCountdown(mine?.heldUntil);
  const slot = slots?.[selected - 1];
  const meta = THEME_META[mine?.variant ?? theme];
  const foundersLeft = Math.max(0, FOUNDERS_LIMIT - paid);

  const step = (d: number) => {
    setError(null);
    select(((selected - 1 + d + EDITION_SIZE) % EDITION_SIZE) + 1);
  };
  const onClaim = async () => {
    setError(null);
    const r = await hold(selected, theme);
    if (!r.ok) setError(r.reason);
  };
  const mm = String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  const status = slot?.mine ? "Held for you" : slot?.status === "claimed" ? `Claimed · ${slot.holder}` : slot?.status === "held" ? "On hold" : "Available";

  const payMsg = mine
    ? `Hello BEYOND, I've claimed No. ${padNo(mine.no)} / ${EDITION_SIZE}, ${WATCH_NAME} ${meta.label} (${meta.dial}, ${meta.case}). ` +
      `I'd like to pay ${pay === "full" ? "in full" : "with EMI"}. Please send the payment link.`
    : "";

  return (
    <section className="section claim" id="claim" aria-labelledby="claim-title">
      <div className="claim-head">
        <p className="eyebrow">Claim your number</p>
        <h2 id="claim-title" className="section-title">One of three hundred.</h2>
        <p className="lede">Edition of 300. Once claimed, the design is retired forever.</p>
      </div>

      <div className="claim-grid">
        {/* Step 1: variant */}
        <fieldset className="step" disabled={!!mine}>
          <legend className="label"><span className="step-no">01</span> Choose your sky</legend>
          <div className="variant-options">
            {THEMES.map((t) => (
              <label key={t} className={`variant-opt ${theme === t ? "is-active" : ""}`}>
                <input type="radio" name="variant" value={t} checked={theme === t} onChange={() => setTheme(t)} />
                <span className={`swatch swatch--${t}`} aria-hidden="true" />
                <span className="variant-text">
                  <strong>{THEME_META[t].label}</strong>
                  <small>{THEME_META[t].sky} · {THEME_META[t].case}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Step 2: number on the brass plate */}
        <div className="step">
          <p className="label"><span className="step-no">02</span> Pick your number</p>
          <div className="brass" aria-live="polite">
            <span className="brass-label">Your number</span>
            <span className="brass-no">{padNo(selected)}<small> / {EDITION_SIZE}</small></span>
            <span className="brass-model">{WATCH_NAME} · {meta.label}</span>
            <i className="screw screw--tl" /><i className="screw screw--tr" /><i className="screw screw--bl" /><i className="screw screw--br" />
          </div>
          <div className="brass-controls">
            <button type="button" className="round-btn" onClick={() => step(-1)} aria-label="Previous number" disabled={!!mine}>−</button>
            <label className="sr-only" htmlFor="num-input">Number, 1 to 300</label>
            <input
              id="num-input"
              className="num-input"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              value={padNo(selected)}
              disabled={!!mine}
              onChange={(e) => {
                const n = parseInt(e.target.value.replace(/\D/g, "").slice(-3) || "1", 10);
                setError(null);
                select(Math.min(EDITION_SIZE, Math.max(1, n)));
              }}
            />
            <button type="button" className="round-btn" onClick={() => step(1)} aria-label="Next number" disabled={!!mine}>+</button>
            <span className={`slot-status slot-status--${slot?.mine ? "mine" : slot?.status ?? "available"}`}>{status}</span>
          </div>
          <p className="fine">Or tap any dark number on the 300 Wall below.</p>
        </div>

        {/* Step 3: claim + hold */}
        <div className="step">
          <p className="label"><span className="step-no">03</span> Claim</p>
          {!mine ? (
            <>
              <button type="button" className="cta" onClick={onClaim} disabled={!slots || slot?.status !== "available"}>
                Claim No. {padNo(selected)}
              </button>
              {error && <p className="error" role="alert">{error}</p>}
              <p className="fine">Claiming holds your number for 10 minutes while you pay. Unpaid holds return to the wall.</p>
            </>
          ) : (
            <div className="hold">
              <p className="hold-timer" aria-live="off">
                <span className="label">No. {padNo(mine.no)} held for</span>
                <span className="hold-count">{mm}:{ss}</span>
              </p>
              <div className="pay-options" role="radiogroup" aria-label="Payment">
                {(["full", "emi"] as const).map((p) => (
                  <label key={p} className={`pay-opt ${pay === p ? "is-active" : ""}`}>
                    <input type="radio" name="pay" checked={pay === p} onChange={() => setPay(p)} />
                    <strong>{p === "full" ? "Pay in full" : "EMI"}</strong>
                    <small>{p === "full" ? "Card, UPI or net banking" : "Monthly instalments on eligible cards"}</small>
                  </label>
                ))}
              </div>
              <a className="cta" href={whatsappLink(payMsg)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> Continue to payment
              </a>
              <button type="button" className="text-btn" onClick={() => release(mine.no)}>Release this number</button>
              <p className="fine">Online payment opens soon; for now we send your payment link on WhatsApp. No cash on delivery. No discounts.</p>
            </div>
          )}
        </div>
      </div>

      <aside className="founders" aria-labelledby="f60">
        <h3 id="f60" className="label">Founder&rsquo;s 60</h3>
        <p>
          The first 60 pieces paid for receive the strap set free: one leather, one suede. From No. 61 by payment onwards, the strap set is ₹{STRAP_SET_PRICE_INR.toLocaleString("en-IN")}.
        </p>
        <p className="founders-count"><strong>{foundersLeft}</strong> of 60 remaining <span className="demo-tag">demo</span></p>
      </aside>
    </section>
  );
}
