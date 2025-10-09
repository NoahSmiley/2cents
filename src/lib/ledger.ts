// src/lib/ledger.ts
import * as dbService from './db-service';

export type Txn = {
  id: string
  date: string // ISO
  amount: number // +income, -expense
  category?: string
  note?: string
  who?: string
}

// ---- internal cache so getSnapshot is stable ----
let _cache: Txn[] = []
let _version = 0
let _initialized = false

async function load(): Promise<Txn[]> {
  try {
    const txns = await dbService.getAllTransactions();
    // sort newest first by date
    txns.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return txns;
  } catch {
    return []
  }
}

async function initialize() {
  if (!_initialized) {
    _cache = await load();
    _initialized = true;
  }
}

function notifyUpdate() {
  _version++;
  window.dispatchEvent(new Event("ledger:update"));
}

// Initialize on module load
initialize();

export const Ledger = {
  // stable snapshot parts
  version() { return _version },
  all(): Txn[] { return _cache }, // IMPORTANT: returns the cached array (stable ref unless changed)

  async add(t: Omit<Txn, "id">) {
    const tx = await dbService.addTransaction(t);
    _cache = [tx, ..._cache];
    notifyUpdate();
  },

  async remove(id: string) {
    await dbService.removeTransaction(id);
    _cache = _cache.filter(t => t.id !== id);
    notifyUpdate();
  },

  async clear() {
    await dbService.clearTransactions();
    _cache = [];
    notifyUpdate();
  },
  
  // Refresh cache from database
  async refresh() {
    _cache = await load();
    notifyUpdate();
  },
}
