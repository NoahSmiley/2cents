import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Page from "./Page";
import { useLedger } from "@/hooks/use-ledger";
import { useSettings } from "@/hooks/use-settings";
import { NumberTicker } from "@/components/ui/number-ticker";

type FilterMode = "all" | "partner1" | "partner2";

export default function CoupleView() {
  const txns = useLedger();
  const settings = useSettings();
  const { currency, coupleMode } = settings;
  const [filter, setFilter] = useState<FilterMode>("all");

  if (!coupleMode.enabled) {
    return (
      <Page title="Couple View">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Couple Mode Not Enabled</h2>
              <p className="text-muted-foreground mb-4">
                Enable couple mode in Settings to track shared finances with your partner.
              </p>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  const { partner1Name, partner2Name } = coupleMode;

  // Filter transactions that have a 'who' field
  const coupleTxns = txns.filter(t => t.who);

  // Calculate net for each partner
  const partner1Net = coupleTxns
    .filter(t => t.who === partner1Name)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const partner2Net = coupleTxns
    .filter(t => t.who === partner2Name)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const diff = partner1Net - partner2Net;

  // Filter transactions based on selected filter
  const filteredTxns = filter === "all" 
    ? coupleTxns 
    : coupleTxns.filter(t => t.who === (filter === "partner1" ? partner1Name : partner2Name));

  // Sort by date (newest first)
  const sortedTxns = [...filteredTxns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Page title="Couple View">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <FancyStat title={`${partner1Name} (net)`} value={partner1Net} currency={currency} />
          <FancyStat title={`${partner2Name} (net)`} value={partner2Net} currency={currency} />
          <Card className="shadow-sm border-dashed">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Settle Up</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg font-semibold">
                {diff > 0 
                  ? `${partner2Name} owes ${currency}${diff.toFixed(2)}`
                  : diff < 0 
                  ? `${partner1Name} owes ${currency}${(-diff).toFixed(2)}`
                  : "Even"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Transactions
          </Button>
          <Button
            size="sm"
            variant={filter === "partner1" ? "default" : "outline"}
            onClick={() => setFilter("partner1")}
          >
            {partner1Name} Only
          </Button>
          <Button
            size="sm"
            variant={filter === "partner2" ? "default" : "outline"}
            onClick={() => setFilter("partner2")}
          >
            {partner2Name} Only
          </Button>
        </div>

        {/* Transactions Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Who Paid What</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTxns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found. Start adding transactions with couple mode enabled.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Who</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTxns.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell>{t.note || t.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.category}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                          t.who === partner1Name ? "bg-blue-500/10 border-blue-500/20" : "bg-purple-500/10 border-purple-500/20"
                        )}>
                          {t.who}
                        </span>
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-mono",
                        t.amount < 0 ? "text-red-600" : "text-emerald-600"
                      )}>
                        {t.amount < 0 ? `-${currency}${(-t.amount).toFixed(2)}` : `${currency}${t.amount.toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}

function FancyStat({ title, value, currency }: { title: string; value: number; currency: string }) {
  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="font-mono tabular-nums text-3xl md:text-4xl tracking-tight select-text">
          {value < 0 ? `-${currency}` : `${currency}`}
          <NumberTicker value={Math.abs(value)} decimalPlaces={2} />
        </div>
      </CardContent>
    </Card>
  );
}
