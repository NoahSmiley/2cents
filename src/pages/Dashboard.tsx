// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import Page from "./Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Particles } from "@/components/ui/particles";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLedger } from "@/hooks/use-ledger";
import { useSettings } from "@/hooks/use-settings";
import { Ledger } from "@/lib/ledger";
import { CategoryProgress } from "@/components/dashboard/CategoryProgress";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { MonthlySummary } from "@/components/dashboard/MonthlySummary";
import { SpendingTrendChart } from "@/components/dashboard/SpendingTrendChart";
import { CategoryBarChart } from "@/components/dashboard/CategoryBarChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { GoalsOverview } from "@/components/dashboard/GoalsOverview";
import { SPTracker } from "@/components/dashboard/SPTracker";
import { createColorMap, FADE_PALETTE } from "@/lib/colors";
import { useGoals } from "@/hooks/use-goals";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const txns = useLedger();
  const settings = useSettings();
  const { goals } = useGoals();
  const C = settings.currency || "$";
  
  // Load bills
  const [bills, setBills] = useState<any[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("twocents.recurring.v1");
      setBills(stored ? JSON.parse(stored) : []);
    } catch {
      setBills([]);
    }
  }, []);

  // ---- month filter ----
  const today = new Date();
  const thisMonth = txns.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  });

  // ---- rollups ----
  const income = thisMonth.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const spending = thisMonth.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);

  // ---- categories (spent vs limit) & pie data ----
  const spentByCat: Record<string, number> = {};
  for (const t of thisMonth) {
    if (t.amount < 0) {
      const key = t.category || "Uncategorized";
      spentByCat[key] = (spentByCat[key] ?? 0) + Math.abs(t.amount);
    }
  }

  // recent list (latest 5)
  const recent = [...txns]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Build a stable color map by category index from the user's Settings categories
  const categoryOrder = (settings.categories?.length
    ? settings.categories.map(c => c.name)
    : Array.from(new Set(Object.keys(spentByCat))).sort());

  const colorMap = createColorMap(categoryOrder, FADE_PALETTE);
  const colorFor = (name: string) => colorMap.get(name) ?? FADE_PALETTE[0];

  const isMinimalist = settings.uiMode === "minimalist";

  if (isMinimalist) {
    return (
      <Page title="Dashboard" className="p-0">
        <div className="py-0 space-y-2">
          {/* Minimalist View - Simple List */}
          <div className="border rounded p-4 bg-background">
            <h2 className="text-lg font-medium mb-4">Overview</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Income</span>
                <span className="font-mono">{C}{income.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Spending</span>
                <span className="font-mono">{C}{spending.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-t pt-2">
                <span className="font-medium">Net</span>
                <span className="font-mono font-medium">{C}{(income - spending).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border rounded p-4 bg-background">
            <h2 className="text-lg font-medium mb-4">Categories</h2>
            <div className="space-y-2 text-sm">
              {settings.categories.map(cat => {
                const spent = spentByCat[cat.name] || 0;
                return (
                  <div key={cat.id} className="flex justify-between py-1">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-mono">{C}{spent.toFixed(0)} / {C}{cat.limit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="border rounded p-4 bg-background">
            <h2 className="text-lg font-medium mb-4">Recent</h2>
            <div className="space-y-2 text-sm">
              {recent.slice(0, 5).map(t => (
                <div key={t.id} className="flex justify-between py-1">
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{t.note || t.category}</div>
                    <div className="text-xs text-muted-foreground">{t.date}</div>
                  </div>
                  <span className={`font-mono ml-4 ${t.amount >= 0 ? 'text-emerald-600' : ''}`}>
                    {t.amount >= 0 ? '+' : ''}{C}{Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Dashboard" className="p-0">
      <Particles className="absolute inset-0 -z-10" quantity={50} ease={80} refresh />
      <div className="py-0 space-y-4">
        {/* Top Row: Summary + Charts */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <MonthlySummary income={income} spending={spending} currency={C} />
          <SpendingTrendChart transactions={txns} currency={C} />
          <CategoryBarChart categories={settings.categories} spentByCategory={spentByCat} currency={C} />
        </div>

        {/* Middle Row: Widgets */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <UpcomingBills bills={bills} currency={C} />
          <GoalsOverview goals={goals} currency={C} />
          <SPTracker />
          <QuickActions />
        </div>

        {/* Bottom Row: Budget Details */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <CategoryProgress
              categories={settings.categories}
              spentByCategory={spentByCat}
              colorMap={colorFor}
              currency={C}
            />
          </CardContent>
        </Card>
            <div className="flex items-center justify-end gap-2">
            <Link to="/transactions">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">View all transactions</Button>
            </Link>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                if (confirm("Delete ALL transactions?")) {
                    Ledger.clear();
                }
                }}
            >
                Clear all
            </Button>
            </div>
        {/* Recent */}
        <Card>
          <CardHeader><CardTitle>Recent</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <RecentTransactions transactions={recent} currency={C} />
          </CardContent>
        </Card>

        {/* FAB */}
        <Link to="/add" className="fixed bottom-6 right-6">
          <Button size="lg" className="rounded-full shadow-lg text-white bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-5 w-5 mr-1" /> Add
          </Button>
        </Link>
      </div>
    </Page>
  );
}

