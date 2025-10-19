// src/hooks/use-bills.ts
import { useSyncExternalStore, useEffect } from "react";
import BillsStore from "@/lib/bills";

export type { Bill } from "@/lib/bills";

export function useBills() {
  const bills = useSyncExternalStore(
    BillsStore.subscribe,
    BillsStore.get,
    BillsStore.get
  );

  // Ensure data is loaded on first mount
  useEffect(() => {
    BillsStore.ensureInitialized();
  }, []);

  return {
    bills,
    addBill: BillsStore.addBill.bind(BillsStore),
    updateBill: BillsStore.updateBill.bind(BillsStore),
    removeBill: BillsStore.removeBill.bind(BillsStore),
    refresh: BillsStore.refresh.bind(BillsStore),
  };
}
