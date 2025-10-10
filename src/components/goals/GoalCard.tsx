import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { Edit, TrendingUp, TrendingDown, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other";
  targetDate?: string;
  color: string;
  isDebt?: boolean;
  originalDebt?: number;
  completedAt?: string;
  linkedCategories?: string[];
  linkedBillNames?: string[];
}

interface GoalCardProps {
  goal: Goal;
  currency: string;
  categoryLabel: string;
  onEdit: (goal: Goal) => void;
  onContribute: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, currency, categoryLabel, onEdit, onContribute, onDelete }: GoalCardProps) {
  // Calculate progress
  let percentage = 0;
  let displayAmount = "";
  
  if (goal.isDebt && goal.originalDebt) {
    const paidOff = goal.originalDebt - goal.current;
    percentage = Math.min(100, Math.max(0, (paidOff / goal.originalDebt) * 100));
    displayAmount = `${currency}${paidOff.toFixed(0)}`;
  } else {
    percentage = Math.min(100, (goal.current / goal.target) * 100);
    displayAmount = `${currency}${goal.current.toFixed(0)}`;
  }
  
  // Dynamic color based on progress
  let progressColor = goal.color;
  if (percentage < 25) {
    progressColor = "#ef4444";
  } else if (percentage < 50) {
    progressColor = "#f97316";
  } else if (percentage < 75) {
    progressColor = "#eab308";
  } else if (percentage < 100) {
    progressColor = "#10b981";
  } else {
    progressColor = "#059669";
  }
  
  const isComplete = goal.isDebt 
    ? goal.current <= 0 
    : goal.current >= goal.target;
  
  const remaining = goal.isDebt 
    ? goal.current 
    : goal.target - goal.current;
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      isComplete && "ring-2 ring-emerald-500"
    )}>
      {isComplete && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          ✓ Complete
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{goal.name}</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              {categoryLabel}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(goal)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Circular Progress */}
        <div className="flex justify-center">
          <AnimatedCircularProgressBar
            max={100}
            min={0}
            value={percentage}
            gaugePrimaryColor={progressColor}
            gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            className="w-32 h-32"
            displayValue={displayAmount}
          />
        </div>
        
        {/* Amounts */}
        <div className="space-y-2">
          {goal.isDebt ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original Debt</span>
                <span className="font-semibold">{currency}{(goal.originalDebt || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid Off</span>
                <span className="font-semibold text-emerald-600">
                  {currency}{((goal.originalDebt || 0) - goal.current).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-orange-600">{currency}{goal.current.toFixed(2)}</span>
              </div>
              {/* Debt Payoff Timeline */}
              {goal.current > 0 && goal.originalDebt && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {(() => {
                      const paidOff = (goal.originalDebt || 0) - goal.current;
                      const monthsElapsed = 1;
                      const avgPayment = paidOff / monthsElapsed;
                      
                      if (avgPayment > 0) {
                        const monthsRemaining = Math.ceil(goal.current / avgPayment);
                        const payoffDate = new Date();
                        payoffDate.setMonth(payoffDate.getMonth() + monthsRemaining);
                        
                        return (
                          <div>
                            <div className="font-medium text-blue-600">Payoff Timeline</div>
                            <div>At current rate: {payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                            <div className="text-xs">~{monthsRemaining} months ({currency}{avgPayment.toFixed(0)}/mo)</div>
                          </div>
                        );
                      }
                      return <div className="text-xs">Make payments to see timeline</div>;
                    })()}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current</span>
                <span className="font-semibold">{currency}{goal.current.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span className="font-semibold">{currency}{goal.target.toFixed(2)}</span>
              </div>
              {!isComplete && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-amber-600">{currency}{remaining.toFixed(2)}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Target Date */}
        {goal.targetDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
          </div>
        )}
        
        {/* Linked Items */}
        {(goal.linkedCategories?.length || goal.linkedBillNames?.length) ? (
          <div className="text-xs space-y-1">
            <div className="font-medium text-muted-foreground">Auto-linked:</div>
            {goal.linkedCategories?.map((cat) => (
              <div key={cat} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded mr-1">
                📊 {cat}
              </div>
            ))}
            {goal.linkedBillNames?.map((bill) => (
              <div key={bill} className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded mr-1">
                🔄 {bill}
              </div>
            ))}
          </div>
        ) : null}
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onContribute(goal)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {goal.isDebt ? "Pay Down" : "Add"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onContribute(goal)}
          >
            <TrendingDown className="h-4 w-4 mr-1" />
            {goal.isDebt ? "Increase" : "Withdraw"}
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(goal.id)}
          className="w-full text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Goal
        </Button>
      </CardContent>
    </Card>
  );
}
