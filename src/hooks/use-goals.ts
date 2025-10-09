import { useState, useEffect } from "react";
import * as dbService from "@/lib/db-service";

export interface Goal {
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

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load goals from database on mount
  useEffect(() => {
    dbService.getAllGoals().then(data => {
      setGoals(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = async () => {
      const data = await dbService.getAllGoals();
      setGoals(data);
    };

    // Listen for custom event for same-window updates
    window.addEventListener("goals-updated", handleStorageChange);

    return () => {
      window.removeEventListener("goals-updated", handleStorageChange);
    };
  }, []);

  const updateGoal = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const newCurrent = goal.isDebt 
      ? goal.current - amount  // Debt: subtract payment
      : goal.current + amount; // Savings: add contribution
    
    await dbService.updateGoal(goalId, { current: Math.max(0, newCurrent) });
    
    // Update local state
    setGoals(goals.map(g => 
      g.id === goalId ? { ...g, current: Math.max(0, newCurrent) } : g
    ));
    
    window.dispatchEvent(new Event("goals-updated"));
  };

  return { goals, updateGoal, loading };
}
