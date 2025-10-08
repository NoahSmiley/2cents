// src/lib/settings.ts
export type Category = { id: string; name: string; limit: number }
export type UIMode = "professional" | "minimalist"
export type Settings = { 
  currency: string; 
  categories: Category[];
  uiMode: UIMode;
}

const KEY = "twocents.settings.v1"

const uid = () =>
  (globalThis.crypto && "randomUUID" in globalThis.crypto
    ? (globalThis.crypto as Crypto).randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36))

const DEFAULTS: Settings = {
  currency: "$",
  uiMode: "professional",
  categories: [
    { id: uid(), name: "Groceries",  limit: 600 },
    { id: uid(), name: "Eating Out", limit: 250 },
    { id: uid(), name: "Fun",        limit: 200 },
    { id: uid(), name: "Bills",      limit: 1600 },
  ],
}

// --- cache + listeners ------------------
let current: Settings = (() => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Settings) : DEFAULTS
  } catch {
    return DEFAULTS
  }
})()

const listeners = new Set<() => void>()
const emit = () => {
  listeners.forEach((l) => l())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("settings:update"))
  }
}

function persist(next: Settings) {
  current = next // <-- update cache
  localStorage.setItem(KEY, JSON.stringify(next))
  emit()
}

export const SettingsStore = {
  // Stable snapshot: always the SAME reference until we persist()
  get(): Settings {
    return current
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  setCurrency(symbol: string) {
    persist({ ...current, currency: symbol || "$" })
  },

  upsertCategory(cat: Partial<Category> & { name: string }) {
    const trimmed = cat.name.trim()
    if (!trimmed) return

    const next: Settings = { ...current, categories: [...current.categories] }
    const idx = next.categories.findIndex(
      (c) =>
        (cat.id && c.id === cat.id) ||
        (!cat.id && c.name.toLowerCase() === trimmed.toLowerCase())
    )

    if (idx >= 0) {
      const prev = next.categories[idx]
      next.categories[idx] = {
        ...prev,
        name: trimmed,
        limit:
          typeof cat.limit === "number" ? Math.max(0, cat.limit) : prev.limit,
      }
    } else {
      next.categories.push({
        id: uid(),
        name: trimmed,
        limit: Math.max(0, Number(cat.limit) || 0),
      })
    }

    // de-dupe by name
    const seen = new Set<string>()
    next.categories = next.categories.filter((c) => {
      const k = c.name.toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })

    persist(next)
  },

  removeCategory(id: string) {
    persist({ ...current, categories: current.categories.filter((c) => c.id !== id) })
  },

  setUIMode(mode: UIMode) {
    persist({ ...current, uiMode: mode })
  },
}

export default SettingsStore
