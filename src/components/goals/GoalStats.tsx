import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

interface GoalStatsProps {
  totalSaved: number;
  totalTarget: number;
  completedGoals: number;
  totalGoals: number;
  currency: string;
}

export function GoalStats({ totalSaved, totalTarget, completedGoals, totalGoals, currency }: GoalStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Saved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currency}<NumberTicker value={totalSaved} decimalPlaces={2} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currency}<NumberTicker value={totalTarget} decimalPlaces={2} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedGoals} / {totalGoals}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
