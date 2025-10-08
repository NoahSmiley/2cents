import { Shield, PiggyBank, Sparkles, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";

type GoalCategory = "emergency" | "savings" | "fun" | "investment" | "debt" | "other";

interface CategoryOption {
  value: GoalCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    value: "emergency",
    label: "Emergency",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    description: "Safety net fund"
  },
  {
    value: "savings",
    label: "Savings",
    icon: PiggyBank,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
    description: "General savings"
  },
  {
    value: "fun",
    label: "Fun",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
    description: "Vacation & hobbies"
  },
  {
    value: "investment",
    label: "Investment",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
    description: "Grow your wealth"
  },
  {
    value: "debt",
    label: "Debt Payoff",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    description: "Pay down debt"
  },
  {
    value: "other",
    label: "Other",
    icon: Package,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800",
    description: "Miscellaneous"
  },
];

interface CategorySelectorProps {
  value: GoalCategory;
  onChange: (value: GoalCategory) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = value === cat.value;
        
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all text-left",
              "hover:scale-105 hover:shadow-md",
              isSelected 
                ? `${cat.bgColor} border-current ring-2 ring-offset-2 ring-current` 
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className={cn("flex items-center gap-2", isSelected && cat.color)}>
                <Icon className="h-5 w-5" />
                <span className="font-semibold">{cat.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className={cn("h-2 w-2 rounded-full", cat.color.replace('text-', 'bg-'))} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
