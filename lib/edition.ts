/**
 * Edition state for the 300 Wall and Claim Your Number.
 *
 * Everything UI-facing goes through the `EditionStore` interface, so a real
 * backend (API route + database, with server-side 10-minute holds) can replace
 * `createDemoStore()` without touching the components.
 *
 * DEMO DATA: the claimed / held numbers below are placeholders kept in client
 * state only. Nothing is reserved for real.
 */
import { EDITION_SIZE } from "./config";
import type { Theme } from "./theme";

export type SlotStatus = "available" | "held" | "claimed";
export type Slot = {
  no: number;
  status: SlotStatus;
  variant?: Theme;
  /** Claimed: buyer first name + initial, e.g. "Asha K." */
  holder?: string;
  /** Held: epoch ms when the hold lapses. */
  heldUntil?: number;
  mine?: boolean;
};
export type HoldResult = { ok: true; slot: Slot } | { ok: false; reason: string };

export interface EditionStore {
  getSlots(): Promise<Slot[]>;
  hold(no: number, variant: Theme): Promise<HoldResult>;
  release(no: number): Promise<void>;
  /** Paid claims so far, used for Founder's 60. */
  paidCount(): Promise<number>;
  subscribe(cb: () => void): () => void;
}

export const HOLD_MS = 10 * 60 * 1000;
export const FOUNDERS_LIMIT = 60;
export const STRAP_SET_PRICE_INR = 4999;

const MY_HOLD_KEY = "beyond-my-hold";

// ---- demo seed (placeholders, clearly fake) ----
const DEMO_CLAIMED: Array<[number, Theme]> = [
  [1, "night"], [7, "day"], [8, "twilight"], [15, "night"], [26, "day"], [32, "twilight"],
  [42, "night"], [50, "day"], [64, "twilight"], [88, "night"], [100, "day"], [101, "twilight"],
  [128, "night"], [150, "day"], [200, "twilight"], [247, "night"], [299, "day"], [300, "night"],
];
const DEMO_HELD = [12, 77, 180];

export function createDemoStore(): EditionStore {
  const listeners = new Set<() => void>();
  const now = Date.now();
  const slots: Slot[] = Array.from({ length: EDITION_SIZE }, (_, i) => ({ no: i + 1, status: "available" as SlotStatus }));
  DEMO_CLAIMED.forEach(([no, variant], i) => {
    slots[no - 1] = { no, status: "claimed", variant, holder: `Demo ${String.fromCharCode(65 + (i % 26))}.` };
  });
  DEMO_HELD.forEach((no, i) => {
    slots[no - 1] = { no, status: "held", heldUntil: now + (3 + i * 2) * 60 * 1000 };
  });

  // Restore this visitor's own hold, if still valid.
  try {
    const raw = localStorage.getItem(MY_HOLD_KEY);
    if (raw) {
      const h = JSON.parse(raw) as { no: number; variant: Theme; heldUntil: number };
      if (h.heldUntil > now && slots[h.no - 1]?.status === "available") {
        slots[h.no - 1] = { no: h.no, status: "held", variant: h.variant, heldUntil: h.heldUntil, mine: true };
      } else localStorage.removeItem(MY_HOLD_KEY);
    }
  } catch {}

  const emit = () => listeners.forEach((l) => l());

  // Lapse expired holds.
  if (typeof window !== "undefined") {
    window.setInterval(() => {
      let changed = false;
      for (const s of slots) {
        if (s.status === "held" && s.heldUntil && s.heldUntil <= Date.now()) {
          if (s.mine) try { localStorage.removeItem(MY_HOLD_KEY); } catch {}
          slots[s.no - 1] = { no: s.no, status: "available" };
          changed = true;
        }
      }
      if (changed) emit();
    }, 1000);
  }

  return {
    async getSlots() {
      return slots.map((s) => ({ ...s }));
    },
    async hold(no, variant) {
      const s = slots[no - 1];
      if (!s) return { ok: false, reason: "That number doesn't exist." };
      if (s.status === "claimed") return { ok: false, reason: `No. ${String(no).padStart(3, "0")} is already claimed.` };
      if (s.status === "held" && !s.mine) return { ok: false, reason: `No. ${String(no).padStart(3, "0")} is on hold right now.` };
      // one hold per visitor
      for (const o of slots) if (o.mine && o.no !== no) slots[o.no - 1] = { no: o.no, status: "available" };
      const slot: Slot = { no, status: "held", variant, heldUntil: Date.now() + HOLD_MS, mine: true };
      slots[no - 1] = slot;
      try { localStorage.setItem(MY_HOLD_KEY, JSON.stringify({ no, variant, heldUntil: slot.heldUntil })); } catch {}
      emit();
      return { ok: true, slot: { ...slot } };
    },
    async release(no) {
      const s = slots[no - 1];
      if (s?.mine) {
        slots[no - 1] = { no, status: "available" };
        try { localStorage.removeItem(MY_HOLD_KEY); } catch {}
        emit();
      }
    },
    async paidCount() {
      return slots.filter((s) => s.status === "claimed").length;
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}
