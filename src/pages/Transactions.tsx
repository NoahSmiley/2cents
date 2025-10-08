// src/pages/Transactions.tsx
import { useMemo, useState, useEffect } from "react";
import Page from "./Page";
import { Ledger } from "@/lib/ledger";
import { useLedger } from "@/hooks/use-ledger";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { AddTransactionModal } from "@/components/transaction/AddTransactionModal";
import { formatNum, escapeCSV } from "@/lib/format";
import { Plus } from "lucide-react";

type Who = "Noah" | "Sam" | string;

export default function Transactions() {
  const all = useLedger(); // live snapshot
  const { categories, currency = "$", uiMode } = useSettings();
  const isMinimalist = uiMode === "minimalist";

  // -------- derive options --------
  const categoryOptions = useMemo(() => {
    const names = new Set<string>(["All categories"]);
    categories.forEach(c => names.add(c.name));
    // include "Uncategorized" if needed
    if (all.some(t => !t.category)) names.add("Uncategorized");
    return Array.from(names);
  }, [categories, all]);

  const whoOptions = useMemo(() => {
    const names = new Set<Who>(["Anyone"]);
    all.forEach(t => t.who && names.add(t.who));
    return Array.from(names);
  }, [all]);

  // -------- filters --------
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All categories");
  const [who, setWho] = useState<Who>("Anyone");
  const [from, setFrom] = useState<string>(""); // yyyy-mm-dd
  const [to, setTo] = useState<string>("");     // yyyy-mm-dd
  const [showAddModal, setShowAddModal] = useState(false);

  // normalize date bounds once
  const fromDate = useMemo(() => (from ? new Date(from + "T00:00:00") : null), [from]);
  const toDate = useMemo(() => (to ? new Date(to + "T23:59:59.999") : null), [to]);

  // -------- filtered rows --------
  const rows = useMemo(() => {
    return all.filter((t) => {
      const catName = t.category || "Uncategorized";
      if (cat !== "All categories" && catName !== cat) return false;
      if (who !== "Anyone" && (t.who || "") !== who) return false;

      // Date range (use real Date, not string compare)
      const d = new Date(t.date);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;

      if (q) {
        const hay = `${catName} ${t.note ?? ""} ${t.who ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [all, q, cat, who, fromDate, toDate]);

  // -------- totals --------
  const income = rows.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const spend  = rows.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);

  // -------- actions --------
  function onDelete(id: string) {
    if (confirm("Delete this transaction?")) {
      Ledger.remove(id);
    }
  }
  
  function onClearAll() {
    if (!all.length) return;
    if (confirm("This will permanently delete ALL transactions. Continue?")) {
      Ledger.clear();
    }
  }
  
  function clearFilters() {
    setQ("");
    setCat("All categories");
    setWho("Anyone");
    setFrom("");
    setTo("");
  }
  
  function exportCSV() {
    if (!rows.length) return;
    const header = ["id","date","amount","category","note","who"];
    const body = rows.map(r => [
      r.id,
      r.date,
      r.amount,
      (r.category || "Uncategorized"),
      (r.note ?? ""),
      (r.who ?? "")
    ]);
    const csv = [header, ...body].map(
      cols => cols.map(escapeCSV).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `twocents-transactions.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // focus search on mount
  useEffect(() => {
    document.getElementById("txn-search")?.focus();
  }, []);

  if (isMinimalist) {
    return (
      <Page title="Transactions" padding="md">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">
              <span className="font-medium">{rows.length}</span> shown
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={exportCSV} disabled={!rows.length} className="h-7 text-xs">Export</Button>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Simple filters */}
          <div className="flex gap-2 mb-2">
            <Input
              id="txn-search"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-7 text-sm flex-1"
            />
            <Button size="sm" variant="outline" onClick={clearFilters} className="h-7 text-xs">Clear</Button>
          </div>

          <div className="border rounded p-2 text-sm space-y-1">
            {rows.map((t) => (
              <div key={t.id} className="flex justify-between py-1 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="truncate">{t.note || t.category || "Transaction"}</div>
                  <div className="text-xs text-muted-foreground">{t.date} • {t.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs ${t.amount >= 0 ? 'text-emerald-600' : ''}`}>
                    {t.amount >= 0 ? '+' : ''}{currency}{Math.abs(t.amount).toFixed(2)}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(t.id)} className="h-6 w-6 p-0 text-xs">×</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AddTransactionModal open={showAddModal} onOpenChange={setShowAddModal} />
      </Page>
    );
  }

  return (
    <Page title="Transactions" padding="md">
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              {rows.length} shown • Income {currency}{formatNum(income)} • Spending {currency}{formatNum(spend)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
            <Button variant="outline" onClick={exportCSV} disabled={!rows.length}>Export CSV</Button>
            <Button variant="destructive" onClick={onClearAll} disabled={!all.length}>Clear all</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <TransactionFilters
            searchQuery={q}
            onSearchChange={setQ}
            category={cat}
            onCategoryChange={setCat}
            categoryOptions={categoryOptions}
            who={who}
            onWhoChange={setWho}
            whoOptions={whoOptions}
            dateFrom={from}
            onDateFromChange={setFrom}
            dateTo={to}
            onDateToChange={setTo}
            onClearFilters={clearFilters}
          />

          {/* Table */}
          <TransactionTable
            transactions={rows}
            currency={currency}
            onDelete={onDelete}
            income={income}
            spending={spend}
          />
        </CardContent>
      </Card>

      <AddTransactionModal open={showAddModal} onOpenChange={setShowAddModal} />
    </Page>
  );
}

