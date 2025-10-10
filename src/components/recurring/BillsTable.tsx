import { Th, Td, LegendSwatch } from "./TableHelpers";
import { BillRow } from "./BillRow";
import type { Bill } from "./types";

interface BillRowData {
  bill: Bill;
  dueNext: Date;
  daysUntil: number;
  status: "overdue" | "soon" | "ok";
  isPaidThisCycle: boolean;
}

interface BillsTableProps {
  rows: BillRowData[];
  onMarkPaid: (id: string, event?: React.MouseEvent) => void;
  onResetPaid: (id: string) => void;
  onEdit: (id: string, data: { name: string; amount: number; dueDay: number; linkedGoalId?: string; category?: string }) => void;
  onDelete: (id: string) => void;
  formatShort: (date: Date) => string;
}

export function BillsTable({
  rows,
  onMarkPaid,
  onResetPaid,
  onEdit,
  onDelete,
  formatShort,
}: BillsTableProps) {
  return (
    <>
      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <Th className="w-[28px]"> </Th>
              <Th>Bill</Th>
              <Th className="text-right">Amount</Th>
              <Th className="w-[140px] text-center">Due</Th>
              <Th className="w-[120px] text-center">Status</Th>
              <Th className="w-[260px] text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ bill, dueNext, daysUntil, status, isPaidThisCycle }) => (
              <BillRow
                key={bill.id}
                bill={bill}
                dueNext={dueNext}
                daysUntil={daysUntil}
                status={status}
                isPaidThisCycle={isPaidThisCycle}
                onMarkPaid={onMarkPaid}
                onResetPaid={onResetPaid}
                onEdit={onEdit}
                onDelete={onDelete}
                formatShort={formatShort}
              />
            ))}

            {!rows.length && (
              <tr>
                <Td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No recurring bills yet — add one above.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend & Info */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <LegendSwatch className="bg-emerald-500" label="Paid this cycle" />
          <LegendSwatch className="bg-red-500" label="Overdue" />
          <LegendSwatch className="bg-amber-500" label="Due soon (≤3d)" />
          <LegendSwatch className="bg-blue-500" label="Upcoming" />
        </div>
        <div className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Bills automatically reset each cycle based on their due date. 
          Paid bills move to the bottom and will reappear at the top when the next cycle begins.
        </div>
      </div>
    </>
  );
}
