import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

interface StatProps {
  title: string;
  value: string;
  numericValue?: number;
  prefix?: string;
  accent?: boolean;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}

export function Stat({ title, value, numericValue, prefix = "", accent, subtitle, trend }: StatProps) {
  return (
    <Card className={accent ? "border-primary shadow-[0_0_0_1px_oklch(var(--fx-pink))/20]" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {numericValue !== undefined ? (
          <div className="text-2xl font-semibold">
            {prefix}
            <NumberTicker value={numericValue} />
          </div>
        ) : (
          <div className="text-2xl font-semibold">{value}</div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
