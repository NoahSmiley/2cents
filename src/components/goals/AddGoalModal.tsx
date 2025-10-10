import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "./CategorySelector";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  target: string;
  setTarget: (target: string) => void;
  category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other";
  setCategory: (category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other") => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  currency: string;
  onAdd: () => void;
}

export function AddGoalModal({
  open,
  onOpenChange,
  name,
  setName,
  target,
  setTarget,
  category,
  setCategory,
  targetDate,
  setTargetDate,
  currency,
  onAdd,
}: AddGoalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Select Category</Label>
            <CategorySelector 
              value={category} 
              onChange={(val) => setCategory(val)}
            />
          </div>
          <div className="space-y-2">
            <Label>Goal Name</Label>
            <Input
              placeholder={category === "debt" ? "e.g., Student Loan" : "e.g., Emergency Fund"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{category === "debt" ? "Current Debt Amount" : "Target Amount"}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currency}
              </span>
              <Input
                type="number"
                placeholder={category === "debt" ? "25000" : "5000"}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="pl-8"
              />
            </div>
            {category === "debt" && (
              <p className="text-xs text-muted-foreground">
                Enter your current debt balance. Goal is to pay it down to $0.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Target Date (Optional)</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <Button onClick={onAdd} className="w-full text-white bg-emerald-600 hover:bg-emerald-700">
            Create Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
