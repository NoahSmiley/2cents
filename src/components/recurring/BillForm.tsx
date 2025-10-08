import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FxMode } from "./types";

interface BillFormProps {
  name: string;
  amount: string;
  dueDay: string;
  fx: FxMode;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDueDayChange: (value: string) => void;
  onFxChange: (value: FxMode) => void;
  onSubmit: () => void;
}

export function BillForm({
  name,
  amount,
  dueDay,
  fx,
  onNameChange,
  onAmountChange,
  onDueDayChange,
  onFxChange,
  onSubmit,
}: BillFormProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-5 w-full sm:w-auto">
      <Input
        placeholder="Name (e.g. Rent)"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="h-9"
      />
      <Input
        placeholder="Amount"
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="h-9"
      />
      <Input
        placeholder="Due day"
        type="number"
        value={dueDay}
        min={1}
        max={31}
        onChange={(e) => onDueDayChange(e.target.value)}
        className="h-9"
      />
      <select
        className="h-9 rounded-md border bg-transparent px-3 text-sm"
        value={fx}
        onChange={(e) => onFxChange(e.target.value as FxMode)}
        title="Celebration style"
      >
        <option value="confetti">Confetti</option>
        <option value="burst">Burst</option>
        <option value="spray">Spray</option>
        <option value="sparkles">Sparkles</option>
      </select>
      <Button onClick={onSubmit} className="h-9 text-white">
        Add
      </Button>
    </div>
  );
}
