import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

interface MonthlySummaryProps {
  income: number;
  spending: number;
  currency: string;
}

export function MonthlySummary({ income, spending, currency }: MonthlySummaryProps) {
  const net = income - spending;
  const savingsRate = income > 0 ? ((net / income) * 100) : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          This Month Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Income */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Income</span>
          </div>
          <div className="text-base font-semibold text-emerald-600 tabular-nums shrink-0">
            {currency}<NumberTicker value={income} decimalPlaces={0} />
          </div>
        </div>

        {/* Spending */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <TrendingDown className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Spending</span>
          </div>
          <div className="text-base font-semibold text-red-600 tabular-nums shrink-0">
            {currency}<NumberTicker value={spending} decimalPlaces={0} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Net */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <PiggyBank className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="text-xs font-medium truncate">Net Savings</span>
          </div>
          <div className={`text-lg font-bold tabular-nums shrink-0 ${net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {currency}<NumberTicker value={net} decimalPlaces={0} />
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-muted/50 rounded-lg p-2.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-muted-foreground truncate">Savings Rate</span>
            <div className="text-xl font-bold tabular-nums shrink-0">
              <NumberTicker value={savingsRate} decimalPlaces={1} />%
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                savingsRate >= 20 ? 'bg-emerald-500' : savingsRate >= 10 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
