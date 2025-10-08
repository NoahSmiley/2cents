import { motion, AnimatePresence } from "framer-motion";
import { colorFor } from "@/lib/colors";

interface TransactionPreviewProps {
  amount: number;
  date: string;
  category: string;
  note: string;
  mode: "expense" | "income";
  currency: string;
}

export function TransactionPreview({
  amount,
  date,
  category,
  note,
  mode,
  currency,
}: TransactionPreviewProps) {
  if (amount <= 0) return null;

  const displayCategory = mode === "expense" ? category : "Income";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="rounded-xl border p-3 text-sm flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full ring-1 ring-border"
            style={{
              background: colorFor(displayCategory),
            }}
          />
          {displayCategory} • {new Date(date).toLocaleDateString()}
          {note && <span className="text-muted-foreground"> — {note}</span>}
        </span>
        <span className={mode === "expense" ? "text-red-500" : "text-emerald-500"}>
          {mode === "expense" ? "-" : "+"}
          {currency}
          {amount.toFixed(2)}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
