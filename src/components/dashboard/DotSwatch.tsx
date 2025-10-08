interface DotSwatchProps {
  color: string;
}

export function DotSwatch({ color }: DotSwatchProps) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full ring-1 ring-border"
      style={{ background: color }}
    />
  );
}
