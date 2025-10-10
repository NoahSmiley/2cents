import { useEffect, useMemo, useState } from "react";
import { Ledger } from "@/lib/ledger";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { useGoals } from "@/hooks/use-goals";
import { QuickPicks, loadQuick, saveQuick } from "./QuickPicks";
import type { QuickPick } from "./QuickPicks";
import { ModeToggleButtons } from "./ModeToggleButtons";
import { TransactionFormFields } from "./TransactionFormFields";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Payer = "Noah" | "Sam";
type Mode = "expense" | "income";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionModal({ open, onOpenChange }: AddTransactionModalProps) {
  const { categories, currency = "$" } = useSettings();
  const { goals, updateGoal } = useGoals();

  const defaultCat = categories[0]?.name ?? "Groceries";
  const [mode, setMode] = useState<Mode>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(defaultCat);
  const [who, setWho] = useState<Payer>("Noah");
  const [note, setNote] = useState("");
  const [linkedGoalId, setLinkedGoalId] = useState<string>("");
  const [quick, setQuick] = useState<QuickPick[]>(() => loadQuick());

  // keep category valid
  useEffect(() => {
    if (!categories.find((c) => c.name === category)) {
      setCategory(categories[0]?.name ?? "Groceries");
    }
  }, [categories, category]);

  const parsedAbs = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? Math.abs(n) : 0;
  }, [amount]);
  const signedAmount = mode === "expense" ? -parsedAbs : parsedAbs;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parsedAbs) return;
    
    // For income, category should be undefined (not set)
    const txCategory = mode === "income" ? undefined : category;
    if (mode === "expense" && !category) return;
    
    Ledger.add({ amount: signedAmount, date, category: txCategory, note, who });
    
    // If linked to a goal, update it
    if (linkedGoalId) {
      updateGoal(linkedGoalId, parsedAbs);
    }
    
    // Reset form
    setAmount("");
    setNote("");
    setLinkedGoalId("");
    setDate(new Date().toISOString().slice(0, 10));
    onOpenChange(false);
  }

  function applyQuick(q: QuickPick) {
    setMode(q.mode);
    setAmount(String(Math.abs(q.amount)));
    setCategory(q.category);
    setNote(q.note ?? "");
  }

  function removeQuick(id: string) {
    const next = quick.filter((x) => x.id !== id);
    setQuick(next);
    saveQuick(next);
  }

  function saveCurrentAsQuick() {
    const amt = Number(amount);
    if (!Number.isFinite(amt)) return;
    const entry: QuickPick = {
      id: crypto.randomUUID(),
      label: note?.trim() || `${category || "Income"} ${currency}${Math.abs(amt).toFixed(2)}`,
      mode,
      amount: mode === "expense" ? -Math.abs(amt) : Math.abs(amt),
      category: category || "",
      note: note?.trim() || undefined,
    };
    const next = [entry, ...quick].slice(0, 20);
    setQuick(next);
    saveQuick(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add Transaction</span>
            <ModeToggleButtons mode={mode} setMode={setMode} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <QuickPicks
            picks={quick}
            onApply={applyQuick}
            onRemove={removeQuick}
            onSaveCurrent={saveCurrentAsQuick}
          />

          <form onSubmit={onSubmit} className="space-y-4">
            <TransactionFormFields
              mode={mode}
              amount={amount}
              setAmount={setAmount}
              date={date}
              setDate={setDate}
              category={category}
              setCategory={setCategory}
              who={who}
              setWho={setWho}
              note={note}
              setNote={setNote}
              linkedGoalId={linkedGoalId}
              setLinkedGoalId={setLinkedGoalId}
              categories={categories}
              goals={goals}
              currency={currency}
            />

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!parsedAbs || (mode === "expense" && !category)}
                className={
                  mode === "expense"
                    ? "flex-1 h-10 bg-red-600 hover:bg-red-700 text-white"
                    : "flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
                }
              >
                {mode === "expense" ? "Add Expense" : "Add Income"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
