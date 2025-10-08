import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Category {
  id: string;
  name: string;
  limit: number;
}

interface CategoryBarChartProps {
  categories: Category[];
  spentByCategory: Record<string, number>;
  currency: string;
}

export function CategoryBarChart({ categories, spentByCategory, currency }: CategoryBarChartProps) {
  // Prepare data for chart
  const chartData = categories
    .map((cat) => ({
      name: cat.name,
      spent: Math.round(spentByCategory[cat.name] || 0),
      limit: cat.limit,
      remaining: Math.max(0, cat.limit - (spentByCategory[cat.name] || 0)),
    }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5); // Top 5 categories

  const chartConfig = {
    spent: {
      label: "Spent",
      color: "hsl(262, 83%, 58%)", // Purple
    },
    remaining: {
      label: "Remaining",
      color: "hsl(142, 76%, 36%)", // Green
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis 
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              tickFormatter={(value) => `${currency}${value}`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              width={80}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="spent"
              fill="hsl(262, 83%, 58%)"
              radius={[0, 4, 4, 0]}
              stackId="a"
            />
            <Bar
              dataKey="remaining"
              fill="hsl(142, 76%, 36%)"
              radius={[0, 4, 4, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
