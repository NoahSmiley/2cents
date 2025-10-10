import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  isDebt?: boolean;
}

interface ContributeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  amount: string;
  setAmount: (amount: string) => void;
  currency: string;
  onContribute: (isWithdraw: boolean) => void;
}

export function ContributeModal({
  open,
  onOpenChange,
  goal,
  amount,
  setAmount,
  currency,
  onContribute,
}: ContributeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {goal?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currency}
              </span>
              <Input
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onContribute(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {goal?.isDebt ? "Pay Down" : "Add Money"}
            </Button>
            <Button
              onClick={() => onContribute(true)}
              variant="outline"
              className="text-amber-600 hover:text-amber-700"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              {goal?.isDebt ? "Increase Debt" : "Withdraw"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
