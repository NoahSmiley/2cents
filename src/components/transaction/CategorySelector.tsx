import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { colorFor } from "@/lib/colors";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  limit: number;
}

interface CategorySelectorProps {
  categories: Category[];
  selected: string;
  onSelect: (name: string) => void;
  mode: "expense" | "income";
}

export function CategorySelector({ categories, selected, onSelect, mode }: CategorySelectorProps) {
  if (mode === "income") {
    return (
      <div className="grid gap-1">
        <Label className="text-xs">Category</Label>
        <div className="inline-flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center rounded-full px-3 h-9 text-sm text-white"
            style={{ background: colorFor("Income") }}
          >
            Income
          </span>
          <span className="text-muted-foreground text-xs">
            (Income category is fixed)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label className="text-xs">Category</Label>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = selected === c.name;
          return (
            <motion.button
              type="button"
              key={c.id}
              onClick={() => onSelect(c.name)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 h-9 text-sm border leading-none transition-colors",
                active
                  ? "text-white border-transparent"
                  : "border-border text-foreground/80 hover:bg-accent"
              )}
              style={{
                background: active ? colorFor(c.name) : "transparent",
              }}
            >
              {c.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
