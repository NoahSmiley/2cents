// Date utility functions for recurring bills and transactions

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function clampDay(year: number, month: number, day: number): number {
  const last = new Date(year, month + 1, 0).getDate();
  return Math.min(Math.max(1, day), last);
}

/** Start of the current billing cycle = most recent due date ≤ today */
export function cycleStart(base: Date, dueDay: number): Date {
  const y = base.getFullYear();
  const m = base.getMonth();
  const today = startOfDay(base);
  const thisMonthDue = startOfDay(new Date(y, m, clampDay(y, m, dueDay)));
  if (thisMonthDue <= today) return thisMonthDue;
  // previous month
  const y2 = m === 0 ? y - 1 : y;
  const m2 = m === 0 ? 11 : m - 1;
  return startOfDay(new Date(y2, m2, clampDay(y2, m2, dueDay)));
}

export function nextDueDate(dueDay: number, base = new Date()): Date {
  const y = base.getFullYear();
  const m = base.getMonth();
  const thisMonthDay = clampDay(y, m, dueDay);
  const cand = startOfDay(new Date(y, m, thisMonthDay));
  if (cand >= startOfDay(base)) return cand;
  const y2 = m === 11 ? y + 1 : y;
  const m2 = (m + 1) % 12;
  const nextDay = clampDay(y2, m2, dueDay);
  return startOfDay(new Date(y2, m2, nextDay));
}

export function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function formatShort(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
