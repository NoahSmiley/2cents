// src/types/electron.d.ts
// Type definitions for Electron API exposed via preload

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category?: string;
  note?: string;
  who?: string;
}

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

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  lastPaid?: string;
  linkedGoalId?: string;
  category?: string;
}

export interface Settings {
  currency: string;
  uiMode: "professional" | "minimalist";
  categories: Array<{ id: string; name: string; limit: number }>;
}

export interface ElectronAPI {
  getAllTransactions: () => Promise<Transaction[]>;
  addTransaction: (txn: Omit<Transaction, 'id'>) => Promise<Transaction>;
  removeTransaction: (id: string) => Promise<void>;
  clearTransactions: () => Promise<void>;
  
  getAllGoals: () => Promise<Goal[]>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  
  getAllBills: () => Promise<Bill[]>;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<Bill>;
  updateBill: (id: string, updates: Partial<Bill>) => Promise<void>;
  removeBill: (id: string) => Promise<void>;
  
  getSettings: () => Promise<Settings>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  addCategory: (category: { id?: string; name: string; limit: number }) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  
  migrateFromLocalStorage: (data: any) => Promise<void>;
  onDatabaseUpdate: (callback: (event: string) => void) => () => void;
  
  // Auto-update functions
  checkForUpdates: () => Promise<{ available: boolean; version?: string; message?: string; error?: string }>;
  downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
  installUpdate: () => void;
  onUpdateAvailable: (callback: (info: any) => void) => () => void;
  onUpdateDownloaded: (callback: (info: any) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
