"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createDemoStore, type EditionStore, type Slot } from "@/lib/edition";
import type { Theme } from "@/lib/theme";

type Ctx = {
  slots: Slot[] | null;
  paid: number;
  selected: number;
  select: (n: number) => void;
  hold: (n: number, v: Theme) => ReturnType<EditionStore["hold"]>;
  release: (n: number) => Promise<void>;
};
const EditionCtx = createContext<Ctx | null>(null);

/** Swap createDemoStore() for an API-backed store when the backend exists. */
export function EditionProvider({ children }: { children: React.ReactNode }) {
  const store = useRef<EditionStore | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [paid, setPaid] = useState(0);
  const [selected, setSelected] = useState(42);

  const refresh = useCallback(async () => {
    if (!store.current) return;
    const s = await store.current.getSlots();
    setSlots(s);
    setPaid(await store.current.paidCount());
    return s;
  }, []);

  useEffect(() => {
    store.current = createDemoStore();
    const unsub = store.current.subscribe(refresh);
    refresh().then((s) => {
      const mine = s?.find((x) => x.mine);
      if (mine) setSelected(mine.no);
      else if (s && s[41].status !== "available") setSelected(s.find((x) => x.status === "available")?.no ?? 1);
    });
    return () => { unsub(); };
  }, [refresh]);

  const hold = useCallback(async (n: number, v: Theme) => {
    if (!store.current) return { ok: false as const, reason: "Still loading, try again." };
    return store.current.hold(n, v);
  }, []);
  const release = useCallback(async (n: number) => { await store.current?.release(n); }, []);

  return (
    <EditionCtx.Provider value={{ slots, paid, selected, select: setSelected, hold, release }}>{children}</EditionCtx.Provider>
  );
}

export function useEdition() {
  const c = useContext(EditionCtx);
  if (!c) throw new Error("useEdition must be used inside EditionProvider");
  return c;
}
