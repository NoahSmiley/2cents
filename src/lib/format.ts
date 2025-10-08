// Number formatting utilities
export function formatNum(n: number): string {
  return Math.round(n).toLocaleString();
}

export function formatCurrency(amount: number, currency: string = "$"): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

// CSV utilities
export function escapeCSV(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
