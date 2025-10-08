import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  completedAt?: string;
  isDebt?: boolean;
  originalDebt?: number;
}

interface GoalsOverviewProps {
  goals: Goal[];
  currency: string;
}

export function GoalsOverview({ goals, currency }: GoalsOverviewProps) {
  const activeGoals = goals.filter(g => !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);
  
  // Calculate total progress
  const totalSaved = goals.reduce((sum, g) => {
    if (g.isDebt) return sum; // Don't count debt balances
    return sum + g.current;
  }, 0);
  
  const totalTarget = goals.reduce((sum, g) => {
    if (g.isDebt) return sum + (g.originalDebt || 0);
    return sum + g.target;
  }, 0);
  
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Active Goals</span>
          <span className="font-semibold">{activeGoals.length}</span>
        </div>
        
        {completedGoals.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3 w-3 text-amber-500" />
              Completed
            </span>
            <span className="font-semibold text-amber-600">{completedGoals.length}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Progress</span>
            <span className="font-semibold">
              {currency}{totalSaved.toFixed(0)} / {currency}{totalTarget.toFixed(0)}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">
            {overallProgress}% complete
          </div>
        </div>
        
        <Link to="/goals" className="block">
          <button className="text-sm text-primary hover:underline w-full text-left">
            View all goals →
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}
