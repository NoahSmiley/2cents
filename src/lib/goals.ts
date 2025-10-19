// src/lib/goals.ts
import * as dbService from './db-service';

export type Goal = {
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
  household_id?: string;
};

// --- cache + listeners ------------------
let current: Goal[] = [];
let _initialized = false;
let _initPromise: Promise<void> | null = null;

async function initialize() {
  if (!_initialized && !_initPromise) {
    _initPromise = (async () => {
      try {
        current = await dbService.getAllGoals();
      } catch (error) {
        console.error('Failed to load goals:', error);
        current = [];
      }
      _initialized = true;
    })();
  }
  return _initPromise;
}

// Initialize on module load
initialize();

const listeners = new Set<() => void>();
const emit = () => {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("goals:update"));
  }
};

async function refresh() {
  try {
    current = await dbService.getAllGoals();
    emit();
  } catch (error) {
    console.error('Failed to refresh goals:', error);
  }
}

export const GoalsStore = {
  // Stable snapshot: always the SAME reference until we update
  get(): Goal[] {
    return current;
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  async ensureInitialized() {
    await initialize();
  },

  async addGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    const newGoal = await dbService.addGoal(goal);
    current = [newGoal, ...current];
    emit();
    return newGoal;
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    await dbService.updateGoal(id, updates);
    current = current.map((g) => (g.id === id ? { ...g, ...updates } : g));
    emit();
  },

  async removeGoal(id: string): Promise<void> {
    await dbService.removeGoal(id);
    current = current.filter((g) => g.id !== id);
    emit();
  },

  async refresh() {
    await refresh();
  },

  // Local-only update (for optimistic UI updates)
  updateLocal(id: string, updates: Partial<Goal>) {
    current = current.map((g) => (g.id === id ? { ...g, ...updates } : g));
    emit();
  },
};

export default GoalsStore;
