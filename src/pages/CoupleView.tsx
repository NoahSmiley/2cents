import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const num = "font-mono tabular-nums text-3xl md:text-4xl tracking-tight";

export default function CoupleView() {
  const txns = [
    { date: "10/02", desc: "Groceries", who: "Noah", amount: -65.12 },
    { date: "10/03", desc: "Dinner", who: "Sam", amount: -42.90 },
    { date: "10/04", desc: "Paycheck", who: "Noah", amount: 1800.00 },
  ];
  const Noah = txns.filter(t=>t.who==="Noah").reduce((s,t)=>s+t.amount,0);
  const Sam = txns.filter(t=>t.who==="Sam").reduce((s,t)=>s+t.amount,0);
  const diff = Noah - Sam;

  return (
    <Page>
    <div className="container py-6 space-y-6 relative">
      <div className="grid gap-4 md:grid-cols-3">
        <FancyStat title="Noah (net)" value={Noah} />
        <FancyStat title="Sam (net)" value={Sam} />
        <Card className="shadow-sm border-dashed">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Settle Up</CardTitle></CardHeader>
          <CardContent className={cn(num, "pt-0")}>
            {diff>0 ? `Sam owes $${diff.toFixed(2)}`
                     : diff<0 ? `Noah owe $${(-diff).toFixed(2)}`
                              : "Even"}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader><CardTitle>Who Paid What</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Who</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.map((t,i)=>(
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{t.date}</TableCell>
                  <TableCell>{t.desc}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                      {t.who}
                    </span>
                  </TableCell>
                  <TableCell className={cn("text-right", t.amount<0 ? "text-destructive" : "text-emerald-400")}>
                    {t.amount<0?`-$${(-t.amount).toFixed(2)}`:`$${t.amount.toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div></Page>
  );
}

import { cn } from "@/lib/utils";
import Page from "./Page";
function FancyStat({ title, value }: { title:string; value:number }) {
  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="font-mono tabular-nums text-3xl md:text-4xl tracking-tight select-text">
          {value < 0 ? `-$${(-value).toFixed(2)}` : `$${value.toFixed(2)}`}
        </div>
      </CardContent>
    </Card>
  );
}
