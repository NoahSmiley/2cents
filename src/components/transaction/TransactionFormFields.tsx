import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "expense" | "income";
type Payer = "Noah" | "Sam";

interface Goal {
  id: string;
  name: string;
  isDebt?: boolean;
  completedAt?: string;
}

interface Category {
  id: string;
  name: string;
}

interface TransactionFormFieldsProps {
  mode: Mode;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
  category: string;
  setCategory: (category: string) => void;
  who: Payer;
  setWho: (who: Payer) => void;
  note: string;
  setNote: (note: string) => void;
  linkedGoalId: string;
  setLinkedGoalId: (goalId: string) => void;
  categories: Category[];
  goals: Goal[];
  currency: string;
}

export function TransactionFormFields({
  mode,
  amount,
  setAmount,
  date,
  setDate,
  category,
  setCategory,
  who,
  setWho,
  note,
  setNote,
  linkedGoalId,
  setLinkedGoalId,
  categories,
  goals,
  currency,
}: TransactionFormFieldsProps) {
  return (
    <>
      {/* Amount */}
      <div className="space-y-2">
        <Label className="text-sm">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currency}
          </span>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            className="pl-8 h-11 text-lg"
          />
        </div>
      </div>

      {/* Date & Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11"
          />
        </div>
        {mode === "expense" && (
          <div className="space-y-2">
            <Label className="text-sm">Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full rounded-md border bg-transparent px-3 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Link to Goal */}
      {goals.filter(g => !g.completedAt).length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Link to Goal (Optional)</Label>
          <select
            value={linkedGoalId}
            onChange={(e) => setLinkedGoalId(e.target.value)}
            className="h-11 w-full rounded-md border bg-transparent px-3 text-sm"
          >
            <option value="">None</option>
            {goals.filter(g => !g.completedAt).map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name} ({goal.isDebt ? "Debt" : "Savings"})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            This amount will be added to the selected goal
          </p>
        </div>
      )}

      {/* Who & Note Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">{mode === "expense" ? "Paid by" : "Received by"}</Label>
          <select
            value={who}
            onChange={(e) => setWho(e.target.value as Payer)}
            className="h-11 w-full rounded-md border bg-transparent px-3 text-sm"
          >
            <option value="Noah">Noah</option>
            <option value="Sam">Sam</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Note (optional)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={mode === "expense" ? "e.g., Trader Joe's" : "e.g., Paycheck"}
            className="h-11"
          />
        </div>
      </div>
    </>
  );
}
