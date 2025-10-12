// src/pages/AddTransaction.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ledger } from "@/lib/ledger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Page from "./Page";
import { useSettings } from "@/hooks/use-settings";
import { QuickPicks, loadQuick, saveQuick } from "@/components/transaction/QuickPicks";
import type { QuickPick } from "@/components/transaction/QuickPicks";

/* ---------------------------------- types ---------------------------------- */

type Mode = "expense" | "income";

/* ---------------------------------- page ---------------------------------- */

export default function AddTransaction() {
  const nav = useNavigate();
  const settings = useSettings();
  const { categories, currency = "$", coupleMode } = settings;

  const defaultCat = categories[0]?.name ?? "Groceries";
  const [mode, setMode] = useState<Mode>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(defaultCat);
  const [who, setWho] = useState<string>(coupleMode.partner1Name);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [quick, setQuick] = useState<QuickPick[]>(() => loadQuick());

  // keep category valid
  useEffect(() => {
    if (!categories.find((c) => c.name === category)) {
      setCategory(categories[0]?.name ?? "Groceries");
    }
  }, [categories, category]);

  // Update 'who' when couple mode settings change
  useEffect(() => {
    if (coupleMode.enabled && !who) {
      setWho(coupleMode.partner1Name);
    }
  }, [coupleMode.enabled, coupleMode.partner1Name, who]);

  const parsedAbs = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? Math.abs(n) : 0;
  }, [amount]);
  const signedAmount = mode === "expense" ? -parsedAbs : parsedAbs;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parsedAbs || !category) return;
    Ledger.add({ 
      amount: signedAmount, 
      date, 
      category, 
      note, 
      who: coupleMode.enabled ? who : undefined 
    });
    setSaved(true);
    setTimeout(() => nav("/"), 350);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && nav(-1);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

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
    if (!Number.isFinite(amt) || !category) return;
    const entry: QuickPick = {
      id: crypto.randomUUID(),
      label: note?.trim() || `${category} ${currency}${Math.abs(amt).toFixed(2)}`,
      mode,
      amount: mode === "expense" ? -Math.abs(amt) : Math.abs(amt),
      category,
      note: note?.trim() || undefined,
    };
    const next = [entry, ...quick].slice(0, 20);
    setQuick(next);
    saveQuick(next);
  }

  return (
    <Page title="Add Transaction" padding="md">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add Transaction</span>
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
            </CardTitle>
          </CardHeader>

          <CardContent>
            <QuickPicks
              picks={quick}
              onApply={applyQuick}
              onRemove={removeQuick}
              onSaveCurrent={saveCurrentAsQuick}
            />

            <form onSubmit={onSubmit} className="space-y-4 mt-4">
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
              </div>

              {/* Who & Note Row */}
              <div className={coupleMode.enabled ? "grid grid-cols-2 gap-4" : "space-y-2"}>
                {coupleMode.enabled && (
                  <div className="space-y-2">
                    <Label className="text-sm">{mode === "expense" ? "Paid by" : "Received by"}</Label>
                    <select
                      value={who}
                      onChange={(e) => setWho(e.target.value)}
                      className="h-11 w-full rounded-md border bg-transparent px-3 text-sm"
                    >
                      <option value={coupleMode.partner1Name}>{coupleMode.partner1Name}</option>
                      <option value={coupleMode.partner2Name}>{coupleMode.partner2Name}</option>
                    </select>
                  </div>
                )}
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

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => nav(-1)}
                  className="flex-1 h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!parsedAbs}
                  className="flex-1 h-10 text-white"
                >
                  {mode === "expense" ? "Add Expense" : "Add Income"}
                </Button>
              </div>

              {saved && (
                <div className="text-center text-sm text-emerald-600 font-medium">
                  ✓ Saved!
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}

