import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  lastPaid?: string;
}

interface UpcomingBillsProps {
  bills: Bill[];
  currency: string;
}

function nextDueDate(dueDay: number, now: Date): Date {
  const year = now.getFullYear();
  const month = now.getMonth();
  let due = new Date(year, month, dueDay);
  
  if (due < now) {
    due = new Date(year, month + 1, dueDay);
  }
  
  return due;
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function UpcomingBills({ bills, currency }: UpcomingBillsProps) {
  const now = new Date();
  
  // Get upcoming bills (not paid this cycle, due within 7 days)
  const upcoming = bills
    .map(bill => {
      const dueNext = nextDueDate(bill.dueDay, now);
      const days = daysBetween(now, dueNext);
      const isPaid = bill.lastPaid && new Date(bill.lastPaid) >= new Date(now.getFullYear(), now.getMonth(), 1);
      
      return { ...bill, dueNext, days, isPaid };
    })
    .filter(b => !b.isPaid && b.days <= 7)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  if (upcoming.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bills Due Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No bills due in the next 7 days</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Bills Due Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.map(bill => (
          <div key={bill.id} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium">{bill.name}</div>
              <div className="text-sm text-muted-foreground">
                {currency}{bill.amount.toFixed(2)}
              </div>
            </div>
            <Badge variant={bill.days === 0 ? "destructive" : bill.days <= 3 ? "secondary" : "outline"}>
              {bill.days === 0 ? "Today" : `in ${bill.days}d`}
            </Badge>
          </div>
        ))}
        <Link to="/recurring" className="block">
          <button className="text-sm text-primary hover:underline w-full text-left">
            View all bills →
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}
