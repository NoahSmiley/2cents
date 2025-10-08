// Color palette for categories and charts
export const FADE_PALETTE = [
  "#2563EB", // deep blue
  "#0EA5E9", // cyan
  "#10B981", // emerald / green
  "#F59E0B", // amber / gold
  "#EF4444", // red
  "#EC4899", // pink / fuchsia
  "#8B5CF6", // violet / purple
  "#14B8A6", // teal
];

export const RAINBOW = [
  "oklch(0.78 0.20 250)",
  "oklch(0.82 0.24 330)",
  "oklch(0.70 0.20 200)",
  "oklch(0.72 0.18 140)",
  "oklch(0.76 0.18  40)",
  "oklch(0.74 0.22 320)",
  "oklch(0.67 0.24  20)",
];

export function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export function colorFor(name: string, palette: string[] = RAINBOW): string {
  const i = Math.abs(hash(name)) % palette.length;
  return palette[i];
}

export function createColorMap(
  categoryNames: string[],
  palette: string[] = FADE_PALETTE
): Map<string, string> {
  const colorMap = new Map<string, string>();
  categoryNames.forEach((name, idx) => {
    colorMap.set(name, palette[idx % palette.length]);
  });
  return colorMap;
}
