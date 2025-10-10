import { Button } from "@/components/ui/button";

type Mode = "expense" | "income";

interface ModeToggleButtonsProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export function ModeToggleButtons({ mode, setMode }: ModeToggleButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant={mode === "expense" ? "default" : "outline"}
        onClick={() => setMode("expense")}
        className="h-8"
      >
        Expense
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === "income" ? "default" : "outline"}
        onClick={() => setMode("income")}
        className="h-8"
      >
        Income
      </Button>
    </div>
  );
}
