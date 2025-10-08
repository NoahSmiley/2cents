import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category?: string;
  note?: string;
  who?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currency: string;
  onDelete: (id: string) => void;
  income: number;
  spending: number;
}

function Th({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={cn("text-left font-medium px-3 py-2", className)}>{children}</th>;
}

function Td({
  children,
  className,
  colSpan,
}: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return <td className={cn("px-3 py-2 align-top", className)} colSpan={colSpan}>{children}</td>;
}

export function TransactionTable({
  transactions,
  currency,
  onDelete,
  income,
  spending,
}: TransactionTableProps) {
  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10">
          <tr>
            <Th className="w-[110px]">Date</Th>
            <Th>Category</Th>
            <Th className="w-[35%]">Note</Th>
            <Th className="text-right">Amount</Th>
            <Th className="w-[100px] text-center">Who</Th>
            <Th className="w-[90px]"></Th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <Td className="tabular-nums">{new Date(t.date).toLocaleDateString()}</Td>
              <Td>{t.category || "Uncategorized"}</Td>
              <Td className="text-muted-foreground">
                <span className="line-clamp-2">{t.note}</span>
              </Td>
              <Td className={cn("text-right tabular-nums", t.amount < 0 ? "text-destructive" : "text-emerald-600")}>
                {t.amount < 0 ? "-" : "+"}{currency}{Math.abs(t.amount).toFixed(2)}
              </Td>
              <Td className="text-center">{t.who || "-"}</Td>
              <Td className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7"
                  onClick={() => onDelete(t.id)}
                  aria-label="Delete transaction"
                >
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
          {!transactions.length && (
            <tr>
              <Td colSpan={6} className="text-center py-10 text-muted-foreground">
                No transactions match your filters.
              </Td>
            </tr>
          )}
        </tbody>
        {!!transactions.length && (
          <tfoot>
            <tr className="border-t bg-muted/30">
              <Td colSpan={3} className="font-medium">Totals</Td>
              <Td className="text-right tabular-nums font-medium">
                <span className="text-emerald-600 mr-3">+{currency}{Math.abs(income).toFixed(2)}</span>
                <span className="text-destructive">-{currency}{Math.abs(spending).toFixed(2)}</span>
              </Td>
              <Td colSpan={2}></Td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
