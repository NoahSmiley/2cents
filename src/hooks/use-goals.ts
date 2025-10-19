import { useSyncExternalStore, useEffect } from "react";
import GoalsStore from "@/lib/goals";

export type { Goal } from "@/lib/goals";

export function useGoals() {
  const goals = useSyncExternalStore(
    GoalsStore.subscribe,
    GoalsStore.get,
    GoalsStore.get
  );

  // Ensure data is loaded on first mount
  useEffect(() => {
    GoalsStore.ensureInitialized();
  }, []);

  const updateGoal = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const newCurrent = goal.isDebt 
      ? goal.current - amount  // Debt: subtract payment
      : goal.current + amount; // Savings: add contribution
    
    await GoalsStore.updateGoal(goalId, { current: Math.max(0, newCurrent) });
  };

  return {
    goals,
    updateGoal,
    addGoal: GoalsStore.addGoal.bind(GoalsStore),
    updateGoalDirect: GoalsStore.updateGoal.bind(GoalsStore),
    removeGoal: GoalsStore.removeGoal.bind(GoalsStore),
    refresh: GoalsStore.refresh.bind(GoalsStore),
    loading: false, // With sync store, we don't need loading state
  };
}
