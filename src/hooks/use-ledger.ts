// src/hooks/use-ledger.ts
import { useSyncExternalStore } from "react";
import { Ledger, type Txn } from "@/lib/ledger";

function subscribe(cb: () => void) {
  const on = () => cb();
  window.addEventListener("ledger:update", on);
  return () => window.removeEventListener("ledger:update", on);
}

function getSnapshot(): Txn[] {
  // Returns the stable, cached array from your Ledger
  return Ledger.all();
}

// If you ever render on the server, this avoids a hydration mismatch:
const getServerSnapshot = () => [] as Txn[];

export function useLedger() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
