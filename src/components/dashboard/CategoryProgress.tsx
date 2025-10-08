import { Progress } from "@/components/ui/progress";
import { DotSwatch } from "./DotSwatch";

interface Category {
  id: string;
  name: string;
  limit: number;
}

interface CategoryProgressProps {
  categories: Category[];
  spentByCategory: Record<string, number>;
  colorMap: (name: string) => string;
  currency: string;
}

export function CategoryProgress({
  categories,
  spentByCategory,
  colorMap,
  currency,
}: CategoryProgressProps) {
  if (!categories.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No categories yet. Add them in Settings.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((c) => {
        const spent = +(spentByCategory[c.name] ?? 0).toFixed(2);
        const pct = c.limit > 0 ? Math.min(100, Math.round((spent / c.limit) * 100)) : 0;
        const isOverBudget = spent > c.limit;
        const isNearLimit = !isOverBudget && pct >= 80;

        return (
          <div key={c.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2">
                <DotSwatch color={colorMap(c.name)} />
                {c.name}
                {isOverBudget && (
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">
                    Over!
                  </span>
                )}
                {isNearLimit && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                    {pct}%
                  </span>
                )}
              </span>
              <span className={`tabular-nums ${isOverBudget ? 'text-red-600 font-semibold' : ''}`}>
                {currency}{spent.toLocaleString()} / {currency}{c.limit.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={pct} 
              className={isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-amber-500' : ''}
            />
          </div>
        );
      })}
    </div>
  );
}
