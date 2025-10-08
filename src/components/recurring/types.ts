export type Bill = {
  id: string;
  name: string;
  amount: number;      // monthly amount
  dueDay: number;      // 1..28/31
  lastPaid?: string;   // ISO yyyy-mm-dd when last marked paid
  linkedGoalId?: string; // Goal to auto-contribute to
  category?: string;   // Transaction category when marking paid
};

export type FxMode = "confetti" | "burst" | "spray" | "sparkles";

export const KEY = "twocents.recurring.v1";
export const FX_KEY = "twocents.recurring.fx.v1";
