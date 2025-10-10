import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { Trophy, Trash2 } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current: number;
  isDebt?: boolean;
  originalDebt?: number;
  completedAt?: string;
}

interface CompletedGoalCardProps {
  goal: Goal;
  currency: string;
  onDelete: (id: string) => void;
}

export function CompletedGoalCard({ goal, currency, onDelete }: CompletedGoalCardProps) {
  const displayAmount = goal.isDebt 
    ? `${currency}${(goal.originalDebt || 0).toFixed(0)}`
    : `${currency}${goal.current.toFixed(0)}`;
  
  return (
    <Card className="relative overflow-hidden ring-2 ring-emerald-500/50">
      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
        <Trophy className="h-3 w-3" fill="currentColor" />
        Complete
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{goal.name}</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              Completed {new Date(goal.completedAt!).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <AnimatedCircularProgressBar
            max={100}
            min={0}
            value={100}
            gaugePrimaryColor="#059669"
            gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            className="w-32 h-32"
            displayValue={displayAmount}
          />
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
