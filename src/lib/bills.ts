// src/lib/bills.ts
import * as dbService from './db-service';

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  lastPaid?: string;
  linkedGoalId?: string;
  category?: string;
  household_id?: string;
};

// --- cache + listeners ------------------
let current: Bill[] = [];
let _initialized = false;
let _initPromise: Promise<void> | null = null;

async function initialize() {
  if (!_initialized && !_initPromise) {
    _initPromise = (async () => {
      try {
        current = await dbService.getAllBills();
      } catch (error) {
        console.error('Failed to load bills:', error);
        current = [];
      }
      _initialized = true;
    })();
  }
  return _initPromise;
}

// Initialize on module load
initialize();

const listeners = new Set<() => void>();
const emit = () => {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bills:update"));
  }
};

async function refresh() {
  try {
    current = await dbService.getAllBills();
    emit();
  } catch (error) {
    console.error('Failed to refresh bills:', error);
  }
}

export const BillsStore = {
  // Stable snapshot: always the SAME reference until we update
  get(): Bill[] {
    return current;
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  async ensureInitialized() {
    await initialize();
  },

  async addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
    const newBill = await dbService.addBill(bill);
    current = [newBill, ...current];
    emit();
    return newBill;
  },

  async updateBill(id: string, updates: Partial<Bill>): Promise<void> {
    await dbService.updateBill(id, updates);
    current = current.map((b) => (b.id === id ? { ...b, ...updates } : b));
    emit();
  },

  async removeBill(id: string): Promise<void> {
    await dbService.removeBill(id);
    current = current.filter((b) => b.id !== id);
    emit();
  },

  async refresh() {
    await refresh();
  },

  // Local-only update (for optimistic UI updates)
  updateLocal(id: string, updates: Partial<Bill>) {
    current = current.map((b) => (b.id === id ? { ...b, ...updates } : b));
    emit();
  },
};

export default BillsStore;
