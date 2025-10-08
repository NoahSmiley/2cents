import { useState, useEffect } from "react";

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

const STORAGE_KEY = "twocents-goals";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setGoals(stored ? JSON.parse(stored) : []);
      } catch {
        setGoals([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event for same-window updates
    window.addEventListener("goals-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("goals-updated", handleStorageChange);
    };
  }, []);

  const updateGoal = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const newCurrent = g.isDebt 
          ? g.current - amount  // Debt: subtract payment
          : g.current + amount; // Savings: add contribution
        
        return { ...g, current: Math.max(0, newCurrent) };
      }
      return g;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
    window.dispatchEvent(new Event("goals-updated"));
  };

  return { goals, updateGoal };
}
