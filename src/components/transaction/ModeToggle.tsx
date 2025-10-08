import { cn } from "@/lib/utils";

type Mode = "expense" | "income";

interface ModeToggleProps {
  mode: Mode;
  setMode: (m: Mode) => void;
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border overflow-hidden">
      <button
        type="button"
        onClick={() => setMode("expense")}
        className={cn(
          "inline-flex items-center justify-center px-3 h-9 text-sm leading-none",
          mode === "expense" ? "bg-red-500 text-white" : "hover:bg-accent"
        )}
      >
        Expense
      </button>
      <button
        type="button"
        onClick={() => setMode("income")}
        className={cn(
          "inline-flex items-center justify-center px-3 h-9 text-sm leading-none",
          mode === "income" ? "bg-emerald-500 text-white" : "hover:bg-accent"
        )}
      >
        Income
      </button>
    </div>
  );
}
