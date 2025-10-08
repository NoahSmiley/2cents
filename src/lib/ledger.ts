// src/lib/ledger.ts
export type Txn = {
  id: string
  date: string // ISO
  amount: number // +income, -expense
  category?: string
  note?: string
  who?: string
}

const KEY = "twocents.ledger.v1"

// ---- internal cache so getSnapshot is stable ----
let _cache: Txn[] = load()
let _version = 0

function load(): Txn[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Txn[]) : []
  } catch {
    return []
  }
}
function persist(next: Txn[]) {
  // sort newest first by date
  next.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  localStorage.setItem(KEY, JSON.stringify(next));
  _cache = next;
  _version++;
  window.dispatchEvent(new Event("ledger:update"));
}

// optional: keep cache in sync if another tab edits data
window.addEventListener("storage", (e) => {
  if (e.key === KEY) {
    _cache = load()
    _version++
    window.dispatchEvent(new Event("ledger:update"))
  }
})

export const Ledger = {
  // stable snapshot parts
  version() { return _version },
  all(): Txn[] { return _cache }, // IMPORTANT: returns the cached array (stable ref unless changed)

  add(t: Omit<Txn, "id">) {
    const tx: Txn = { id: crypto.randomUUID(), ...t }
    persist([tx, ..._cache])
  },

  remove(id: string) {
    persist(_cache.filter(t => t.id !== id))
  },

  clear() {
    localStorage.removeItem(KEY)
    persist([]) // also resets cache + notifies
  },
}
