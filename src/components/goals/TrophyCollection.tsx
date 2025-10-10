import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  completedAt?: string;
}

interface TrophyCollectionProps {
  completedGoals: Goal[];
}

export function TrophyCollection({ completedGoals }: TrophyCollectionProps) {
  if (completedGoals.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          Trophy Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {completedGoals.slice(0, 10).map((goal) => (
              <div
                key={goal.id}
                className="relative group"
                title={`${goal.name} - Completed ${new Date(goal.completedAt!).toLocaleDateString()}`}
              >
                <Trophy 
                  className="h-12 w-12 text-amber-500 hover:text-amber-600 transition-all hover:scale-110" 
                  fill="currentColor"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full h-4 w-4 flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold text-lg text-amber-600">{completedGoals.length} Goals Completed!</div>
            <div>Keep up the amazing work! You're doing great!</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
