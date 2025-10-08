import { cn } from "@/lib/utils";

export function Th({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={cn("text-left font-medium px-3 py-2", className)}>{children}</th>;
}

export function Td({ 
  children, 
  className, 
  colSpan 
}: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return <td className={cn("px-3 py-2 align-middle", className)} colSpan={colSpan}>{children}</td>;
}

export function LegendSwatch({ 
  className, 
  label, 
  outline = false 
}: { 
  className?: string; 
  label: string; 
  outline?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", className, outline && "ring-1 ring-border")} />
      {label}
    </span>
  );
}
