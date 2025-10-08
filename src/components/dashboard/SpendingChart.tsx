import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface SpendingChartProps {
  data: Array<{ name: string; value: number }>;
  colorMap: (name: string) => string;
  currency: string;
}

export function SpendingChart({ data, colorMap, currency }: SpendingChartProps) {
  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground h-full flex items-center">
        No spending this month yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          formatter={(v: number) => [`${currency}${Number(v).toLocaleString()}`, "Spent"]}
          contentStyle={{ borderRadius: 12 }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          stroke="hsl(var(--sidebar-border))"
          strokeWidth={2}
        >
          {data.map((slice) => (
            <Cell key={slice.name} fill={colorMap(slice.name)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
