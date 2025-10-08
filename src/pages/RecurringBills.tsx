// src/pages/RecurringBills.tsx
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import Page from "./Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Th, LegendSwatch, Td } from "@/components/recurring/TableHelpers";
import { BillRow } from "@/components/recurring/BillRow";
import type { Bill } from "@/components/recurring/types";
import { KEY } from "@/components/recurring/types";
import { useSettings } from "@/hooks/use-settings";
import { useGoals } from "@/hooks/use-goals";
import {
  todayISO,
  startOfDay,
  cycleStart,
  nextDueDate,
  daysBetween,
  formatShort,
} from "@/lib/date-utils";

/* ----------------------------- Storage ----------------------------- */

function loadBills(): Bill[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Bill[]) : [
      { id: crypto.randomUUID(), name: "Rent",      amount: 1400, dueDay: 1,  lastPaid: "" },
      { id: crypto.randomUUID(), name: "Phone",     amount: 90,   dueDay: 12, lastPaid: "" },
      { id: crypto.randomUUID(), name: "Utilities", amount: 160,  dueDay: 18, lastPaid: "" },
    ];
  } catch {
    return [];
  }
}

function saveBills(next: Bill[]) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export default function RecurringBills() {
  const [bills, setBills] = useState<Bill[]>(() => loadBills());
  const settings = useSettings();
  const { goals } = useGoals();
  const isMinimalist = settings.uiMode === "minimalist";
  const categories = settings.categories || [];
  const currency = settings.currency || "$";

  useEffect(() => saveBills(bills), [bills]);

  // add form
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState<string>("");
  const [newDueDay, setNewDueDay] = useState<string>("1");
  const [newCategory, setNewCategory] = useState<string>("");
  const [newLinkedGoalId, setNewLinkedGoalId] = useState<string>("");

  // derived rows - sort unpaid first, then paid
  const rows = useMemo(() => {
    const now = new Date();
    return bills
      .map((b) => {
        const dueNext = nextDueDate(b.dueDay, now);
        const start = cycleStart(now, b.dueDay);
        const days = daysBetween(now, dueNext);
        const isPaidThisCycle = !!b.lastPaid && startOfDay(new Date(b.lastPaid!)) >= start;

        let status: "overdue" | "soon" | "ok" = "ok";
        if (!isPaidThisCycle) {
          if (days < 0) status = "overdue";
          else if (days <= 3) status = "soon";
        }
        return { bill: b, dueNext, daysUntil: days, status, isPaidThisCycle };
      })
      .sort((a, b) => {
        // Sort: unpaid bills first (by due date), then paid bills at bottom
        if (a.isPaidThisCycle !== b.isPaidThisCycle) {
          return a.isPaidThisCycle ? 1 : -1;
        }
        return a.dueNext.getTime() - b.dueNext.getTime();
      });
  }, [bills]);

  function addBill() {
    const amt = Number(newAmount);
    const day = Math.max(1, Math.min(31, Number(newDueDay)));
    if (!newName.trim() || !Number.isFinite(amt)) return;
    setBills((prev) => [
      { 
        id: crypto.randomUUID(), 
        name: newName.trim(), 
        amount: Math.abs(amt), 
        dueDay: day, 
        lastPaid: "",
        category: newCategory || undefined,
        linkedGoalId: newLinkedGoalId || undefined,
      },
      ...prev,
    ]);
    setNewName("");
    setNewAmount("");
    setNewDueDay("1");
    setNewCategory("");
    setNewLinkedGoalId("");
  }

  function removeBill(id: string) {
    if (!confirm("Delete this bill/subscription?")) return;
    setBills((prev) => prev.filter((b) => b.id !== id));
  }

  function markPaid(id: string, event?: React.MouseEvent) {
    const today = todayISO();
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, lastPaid: today } : b)));
    
    // Get button position for confetti origin
    let x = 0.5;
    let y = 0.5;
    
    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }
    
    // Trigger rainbow confetti celebration from button!
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
      origin: { x, y },
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['circle'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }

  function resetPaid(id: string) {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, lastPaid: "" } : b)));
  }

  function editBill(id: string, data: { name: string; amount: number; dueDay: number; linkedGoalId?: string; category?: string }) {
    setBills((prev) => prev.map((b) => 
      b.id === id ? { ...b, ...data } : b
    ));
  }

  if (isMinimalist) {
    return (
      <Page title="Recurring Bills" padding="md">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">
              <span className="font-medium">{bills.length}</span> bills
            </div>
          </div>

          {/* Add Bill Form */}
          <div className="border rounded p-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-7 rounded border bg-transparent px-2 text-sm"
              />
              <input
                placeholder="Amount"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="h-7 rounded border bg-transparent px-2 text-sm"
              />
              <input
                placeholder="Due day"
                type="number"
                value={newDueDay}
                min={1}
                max={31}
                onChange={(e) => setNewDueDay(e.target.value)}
                className="h-7 rounded border bg-transparent px-2 text-sm"
              />
              <Button onClick={addBill} className="h-7 text-xs">Add Bill</Button>
            </div>
          </div>

          {/* Bills List */}
          <div className="border rounded p-2 space-y-1">
            {rows.map((row) => (
              <div key={row.bill.id} className="flex justify-between items-center py-1 border-b last:border-0">
                <div className="flex-1">
                  <div className="text-sm font-medium">{row.bill.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Due: Day {row.bill.dueDay} • {currency}{row.bill.amount}
                  </div>
                </div>
                <div className="flex gap-1">
                  {!row.isPaidThisCycle ? (
                    <Button
                      size="sm"
                      onClick={() => markPaid(row.bill.id)}
                      className="h-6 px-2 text-xs"
                    >
                      Pay
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetPaid(row.bill.id)}
                      className="h-6 px-2 text-xs"
                    >
                      Undo
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBill(row.bill.id)}
                    className="h-6 w-6 p-0 text-xs"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Recurring Bills" padding="md">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recurring Bills & Subscriptions</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              Track monthly bills, mark them paid, celebrate your wins.
            </div>
          </div>

          {/* Controls: add bill */}
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6 w-full sm:w-auto">
            <input
              placeholder="Name (e.g. Rent)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            />
            <input
              placeholder="Amount"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            />
            <input
              placeholder="Due day (1-31)"
              type="number"
              value={newDueDay}
              min={1}
              max={31}
              onChange={(e) => setNewDueDay(e.target.value)}
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="">Category (Optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={newLinkedGoalId}
              onChange={(e) => setNewLinkedGoalId(e.target.value)}
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="">Goal (Optional)</option>
              {goals.filter(g => !g.completedAt).map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
            <button
              onClick={addBill}
              className="h-9 rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <Th className="w-[28px]"> </Th>
                  <Th>Bill</Th>
                  <Th className="text-right">Amount</Th>
                  <Th className="w-[140px] text-center">Due</Th>
                  <Th className="w-[120px] text-center">Status</Th>
                  <Th className="w-[260px] text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ bill, dueNext, daysUntil, status, isPaidThisCycle }) => (
                  <BillRow
                    key={bill.id}
                    bill={bill}
                    dueNext={dueNext}
                    daysUntil={daysUntil}
                    status={status}
                    isPaidThisCycle={isPaidThisCycle}
                    onMarkPaid={markPaid}
                    onResetPaid={resetPaid}
                    onEdit={editBill}
                    onDelete={removeBill}
                    formatShort={formatShort}
                  />
                ))}

                {!rows.length && (
                  <tr>
                    <Td colSpan={6} className="text-center py-10 text-muted-foreground">
                      No recurring bills yet — add one above.
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Legend & Info */}
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <LegendSwatch className="bg-emerald-500" label="Paid this cycle" />
              <LegendSwatch className="bg-red-500" label="Overdue" />
              <LegendSwatch className="bg-amber-500" label="Due soon (≤3d)" />
              <LegendSwatch className="bg-blue-500" label="Upcoming" />
            </div>
            <div className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Bills automatically reset each cycle based on their due date. 
              Paid bills move to the bottom and will reappear at the top when the next cycle begins.
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}

