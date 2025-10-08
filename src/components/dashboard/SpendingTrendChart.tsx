import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Transaction {
  date: string;
  amount: number;
}

interface SpendingTrendChartProps {
  transactions: Transaction[];
  currency: string;
}

export function SpendingTrendChart({ transactions, currency }: SpendingTrendChartProps) {
  // Get last 30 days of data
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Group transactions by day
  const dailyData: Record<string, { income: number; spending: number }> = {};
  
  transactions.forEach((t) => {
    const date = new Date(t.date);
    if (date >= thirtyDaysAgo && date <= today) {
      const dateKey = date.toISOString().split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { income: 0, spending: 0 };
      }
      if (t.amount > 0) {
        dailyData[dateKey].income += t.amount;
      } else {
        dailyData[dateKey].spending += Math.abs(t.amount);
      }
    }
  });

  // Convert to array and sort by date
  const chartData = Object.entries(dailyData)
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: Math.round(data.income),
      spending: Math.round(data.spending),
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(142, 76%, 36%)", // Emerald green
    },
    spending: {
      label: "Spending",
      color: "hsl(0, 84%, 60%)", // Red
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 30 Days Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              tickFormatter={(value) => `${currency}${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(142, 76%, 36%)"
              fill="hsl(142, 76%, 36%)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="hsl(0, 84%, 60%)"
              fill="hsl(0, 84%, 60%)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
