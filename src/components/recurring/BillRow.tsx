import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Td } from "./TableHelpers";
import { BillEditForm } from "./BillEditForm";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoals } from "@/hooks/use-goals";
import { useSettings } from "@/hooks/use-settings";
import { Ledger } from "@/lib/ledger";
import type { Bill } from "./types";

interface BillRowProps {
  bill: Bill;
  dueNext: Date;
  daysUntil: number;
  status: "overdue" | "soon" | "ok";
  isPaidThisCycle: boolean;
  onMarkPaid: (id: string, event?: React.MouseEvent) => void;
  onResetPaid: (id: string) => void;
  onEdit: (id: string, data: { name: string; amount: number; dueDay: number; linkedGoalId?: string; category?: string }) => void;
  onDelete: (id: string) => void;
  formatShort: (date: Date) => string;
}

export function BillRow({
  bill,
  dueNext,
  daysUntil,
  status,
  isPaidThisCycle,
  onMarkPaid,
  onResetPaid,
  onEdit,
  onDelete,
  formatShort,
}: BillRowProps) {
  const { updateGoal, goals } = useGoals();
  const { categories } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: bill.name,
    amount: String(bill.amount),
    dueDay: String(bill.dueDay),
    linkedGoalId: bill.linkedGoalId || "",
    category: bill.category || "",
  });

  const handleSave = () => {
    const amt = Number(editForm.amount);
    const day = Math.max(1, Math.min(31, Number(editForm.dueDay)));
    if (!editForm.name.trim() || !Number.isFinite(amt)) return;
    
    onEdit(bill.id, {
      name: editForm.name.trim(),
      amount: Math.abs(amt),
      dueDay: day,
      linkedGoalId: editForm.linkedGoalId || undefined,
      category: editForm.category || undefined,
    });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditForm({
      name: bill.name,
      amount: String(bill.amount),
      dueDay: String(bill.dueDay),
      linkedGoalId: bill.linkedGoalId || "",
      category: bill.category || "",
    });
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <motion.tr 
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("border-t hover:bg-muted/50 transition-colors", isPaidThisCycle && "opacity-60")}
    >
      {/* Status Indicator */}
      <Td className="pl-3 w-12">
        <span
          className={cn(
            "inline-block h-3 w-3 rounded-full",
            status === "overdue" && "bg-red-500",
            status === "soon" && "bg-amber-500",
            status === "ok" && !isPaidThisCycle && "bg-blue-500",
            isPaidThisCycle && "bg-emerald-500"
          )}
        />
      </Td>

      {/* Name */}
      <Td className="font-medium">
        {isEditing ? (
          <Input
            value={editForm.name}
            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            className="h-8 text-sm"
            autoFocus
          />
        ) : (
          bill.name
        )}
      </Td>

      {/* Amount */}
      <Td className="text-right tabular-nums">
        {isEditing ? (
          <Input
            type="number"
            value={editForm.amount}
            onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
            className="h-8 text-sm w-24 ml-auto"
          />
        ) : (
          `$${bill.amount.toFixed(2)}`
        )}
      </Td>

      {/* Due Date */}
      <Td className="text-center">
        {isEditing ? (
          <BillEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            categories={categories}
            goals={goals}
          />
        ) : (
          <>
            <div className="text-sm">{formatShort(dueNext)}</div>
            <div className="text-xs text-muted-foreground">
              {daysUntil < 0
                ? `${Math.abs(daysUntil)}d late`
                : daysUntil === 0
                ? "Today"
                : `in ${daysUntil}d`}
            </div>
            {(bill.category || bill.linkedGoalId) && (
              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                {bill.category && <div>Category: {bill.category}</div>}
                {bill.linkedGoalId && (
                  <div>Goal: {goals.find(g => g.id === bill.linkedGoalId)?.name}</div>
                )}
              </div>
            )}
          </>
        )}
      </Td>

      {/* Status Badge */}
      <Td className="text-center">
        {isPaidThisCycle ? (
          <Badge className="bg-emerald-600 text-white">Paid</Badge>
        ) : status === "overdue" ? (
          <Badge variant="destructive">Overdue</Badge>
        ) : status === "soon" ? (
          <Badge variant="secondary">Due soon</Badge>
        ) : (
          <Badge variant="outline">Upcoming</Badge>
        )}
      </Td>

      {/* Actions */}
      <Td className="text-right">
        <div className="flex items-center gap-1 justify-end">
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {!isPaidThisCycle ? (
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={(e) => {
                    // Create transaction for this bill payment
                    // Use bill's category, or first available category, or "Uncategorized"
                    const txCategory = bill.category || categories[0]?.name || "Uncategorized";
                    
                    Ledger.add({
                      amount: -bill.amount, // Negative for expense
                      date: new Date().toISOString().slice(0, 10),
                      category: txCategory,
                      note: `${bill.name} - Monthly payment`,
                      who: undefined,
                    });
                    
                    // If bill is linked to a goal, auto-contribute
                    if (bill.linkedGoalId) {
                      updateGoal(bill.linkedGoalId, bill.amount);
                    }
                    
                    onMarkPaid(bill.id, e);
                  }}
                >
                  Mark paid
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => onResetPaid(bill.id)}
                >
                  Reset
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleStartEdit}
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(bill.id)}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </Td>
    </motion.tr>
  );
}
