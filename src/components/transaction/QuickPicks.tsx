import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { colorFor } from "@/lib/colors";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type QuickPick = {
  id: string;
  label: string;
  mode: "expense" | "income";
  amount: number;
  category: string;
  note?: string;
};

interface QuickPicksProps {
  picks: QuickPick[];
  onApply: (pick: QuickPick) => void;
  onRemove: (id: string) => void;
  onSaveCurrent: () => void;
}

export function QuickPicks({ picks, onApply, onRemove, onSaveCurrent }: QuickPicksProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-2">
        <Label className="text-xs">Quick Picks</Label>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-2"
          onClick={onSaveCurrent}
        >
          Save current as quick pick
        </Button>
      </div>

      {picks.length ? (
        <div className="flex flex-wrap gap-2 pl-1">
          {picks.map((q) => (
            <motion.div
              key={q.id}
              layout
              className="group relative inline-flex items-center"
            >
              <button
                type="button"
                onClick={() => onApply(q)}
                className="inline-flex items-center justify-center rounded-full px-3 h-8 text-xs font-medium transition-colors"
                style={{
                  background: colorFor(q.category),
                  color: "white",
                }}
              >
                {q.label}
              </button>
              <button
                type="button"
                onClick={() => onRemove(q.id)}
                className={cn(
                  "absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black/70 text-white text-xs leading-none border border-white/20",
                  "opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-opacity"
                )}
                title="Remove"
                aria-label={`Remove ${q.label}`}
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No quick picks yet. Fill the form and save.
        </div>
      )}
    </div>
  );
}

// Storage utilities
export const QUICK_KEY = "twocents.quick.v1";

export function loadQuick(): QuickPick[] {
  try {
    const raw = localStorage.getItem(QUICK_KEY);
    return raw ? (JSON.parse(raw) as QuickPick[]) : [];
  } catch {
    return [];
  }
}

export function saveQuick(list: QuickPick[]) {
  localStorage.setItem(QUICK_KEY, JSON.stringify(list));
}
