import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type Payer = "Noah" | "Sam";

interface PayerSelectorProps {
  selected: Payer;
  onSelect: (payer: Payer) => void;
  mode: "expense" | "income";
}

export function PayerSelector({ selected, onSelect, mode }: PayerSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs">
        {mode === "expense" ? "Who paid" : "Who received"}
      </Label>
      <div className="inline-flex rounded-lg border overflow-hidden">
        {(["Noah", "Sam"] as Payer[]).map((p) => {
          const active = selected === p;
          return (
            <button
              type="button"
              key={p}
              onClick={() => onSelect(p)}
              className={cn(
                "inline-flex items-center justify-center h-10 px-5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-accent"
              )}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
