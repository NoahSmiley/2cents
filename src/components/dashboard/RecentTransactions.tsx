interface Transaction {
  id: string;
  date: string;
  amount: number;
  category?: string;
  note?: string;
  who?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export function RecentTransactions({ transactions, currency }: RecentTransactionsProps) {
  if (!transactions.length) {
    return <div className="text-sm text-muted-foreground">No transactions yet.</div>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between text-sm">
          <div className="truncate">
            <span className="text-muted-foreground">
              {new Date(t.date).toLocaleDateString()}
            </span>
            <span className="mx-2">•</span>
            <span className="font-medium">{t.category || "Uncategorized"}</span>
            {t.note ? <span className="text-muted-foreground"> — {t.note}</span> : null}
            {t.who ? <span className="ml-2 text-xs opacity-70">({t.who})</span> : null}
          </div>
          <div className={t.amount < 0 ? "text-destructive" : "text-green-600"}>
            {t.amount < 0 ? "-" : "+"}
            {currency}{Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
