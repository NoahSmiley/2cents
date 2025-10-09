// src/lib/db-service.ts
// Service layer that abstracts database access
// Falls back to localStorage if running in browser (dev mode without Electron)

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category?: string;
  note?: string;
  who?: string;
};

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
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  lastPaid?: string;
  linkedGoalId?: string;
  category?: string;
};

export type Category = {
  id: string;
  name: string;
  limit: number;
};

export type Settings = {
  currency: string;
  uiMode: "professional" | "minimalist";
  categories: Category[];
};

// Check if we're running in Electron
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

// Helper to get Electron API with type safety
const getElectronAPI = () => {
  if (!window.electronAPI) {
    throw new Error('Electron API not available');
  }
  return window.electronAPI;
};

// ==================== Transaction Operations ====================

export async function getAllTransactions(): Promise<Transaction[]> {
  if (isElectron()) {
    return getElectronAPI().getAllTransactions();
  }
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('twocents.ledger.v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addTransaction(txn: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (isElectron()) {
    return getElectronAPI().addTransaction(txn);
  }
  // Fallback to localStorage
  const id = crypto.randomUUID();
  const newTxn = { id, ...txn };
  const all = await getAllTransactions();
  all.unshift(newTxn);
  localStorage.setItem('twocents.ledger.v1', JSON.stringify(all));
  return newTxn;
}

export async function removeTransaction(id: string): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().removeTransaction(id);
  }
  // Fallback to localStorage
  const all = await getAllTransactions();
  const filtered = all.filter(t => t.id !== id);
  localStorage.setItem('twocents.ledger.v1', JSON.stringify(filtered));
}

export async function clearTransactions(): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().clearTransactions();
  }
  // Fallback to localStorage
  localStorage.removeItem('twocents.ledger.v1');
}

// ==================== Goal Operations ====================

export async function getAllGoals(): Promise<Goal[]> {
  if (isElectron()) {
    return getElectronAPI().getAllGoals();
  }
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('twocents-goals');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  if (isElectron()) {
    return getElectronAPI().addGoal(goal);
  }
  // Fallback to localStorage
  const id = crypto.randomUUID();
  const newGoal = { id, ...goal };
  const all = await getAllGoals();
  all.push(newGoal);
  localStorage.setItem('twocents-goals', JSON.stringify(all));
  return newGoal;
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().updateGoal(id, updates);
  }
  // Fallback to localStorage
  const all = await getAllGoals();
  const index = all.findIndex(g => g.id === id);
  if (index >= 0) {
    all[index] = { ...all[index], ...updates };
    localStorage.setItem('twocents-goals', JSON.stringify(all));
  }
}

export async function removeGoal(id: string): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().removeGoal(id);
  }
  // Fallback to localStorage
  const all = await getAllGoals();
  const filtered = all.filter(g => g.id !== id);
  localStorage.setItem('twocents-goals', JSON.stringify(filtered));
}

// ==================== Bill Operations ====================

export async function getAllBills(): Promise<Bill[]> {
  if (isElectron()) {
    return getElectronAPI().getAllBills();
  }
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('twocents.recurring.v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  if (isElectron()) {
    return getElectronAPI().addBill(bill);
  }
  // Fallback to localStorage
  const id = crypto.randomUUID();
  const newBill = { id, ...bill };
  const all = await getAllBills();
  all.push(newBill);
  localStorage.setItem('twocents.recurring.v1', JSON.stringify(all));
  return newBill;
}

export async function updateBill(id: string, updates: Partial<Bill>): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().updateBill(id, updates);
  }
  // Fallback to localStorage
  const all = await getAllBills();
  const index = all.findIndex(b => b.id === id);
  if (index >= 0) {
    all[index] = { ...all[index], ...updates };
    localStorage.setItem('twocents.recurring.v1', JSON.stringify(all));
  }
}

export async function removeBill(id: string): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().removeBill(id);
  }
  // Fallback to localStorage
  const all = await getAllBills();
  const filtered = all.filter(b => b.id !== id);
  localStorage.setItem('twocents.recurring.v1', JSON.stringify(filtered));
}

// ==================== Settings Operations ====================

const DEFAULT_SETTINGS: Settings = {
  currency: '$',
  uiMode: 'professional',
  categories: [
    { id: crypto.randomUUID(), name: 'Groceries', limit: 600 },
    { id: crypto.randomUUID(), name: 'Eating Out', limit: 250 },
    { id: crypto.randomUUID(), name: 'Fun', limit: 200 },
    { id: crypto.randomUUID(), name: 'Bills', limit: 1600 },
  ],
};

export async function getSettings(): Promise<Settings> {
  if (isElectron()) {
    return getElectronAPI().getSettings();
  }
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('twocents.settings.v1');
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().updateSettings(settings);
  }
  // Fallback to localStorage
  const current = await getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('twocents.settings.v1', JSON.stringify(updated));
}

export async function addCategory(category: { id?: string; name: string; limit: number }): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().addCategory(category);
  }
  // Fallback to localStorage
  const settings = await getSettings();
  const id = category.id || crypto.randomUUID();
  const existingIndex = settings.categories.findIndex(c => c.id === id || c.name === category.name);
  
  if (existingIndex >= 0) {
    settings.categories[existingIndex] = { id, name: category.name, limit: category.limit };
  } else {
    settings.categories.push({ id, name: category.name, limit: category.limit });
  }
  
  await updateSettings(settings);
}

export async function removeCategory(id: string): Promise<void> {
  if (isElectron()) {
    return getElectronAPI().removeCategory(id);
  }
  // Fallback to localStorage
  const settings = await getSettings();
  settings.categories = settings.categories.filter(c => c.id !== id);
  await updateSettings(settings);
}

// ==================== Migration ====================

export async function migrateFromLocalStorage(): Promise<void> {
  if (!isElectron()) {
    console.log('Migration only works in Electron mode');
    return;
  }
  
  // Check if we've already migrated
  const migrated = localStorage.getItem('twocents.migrated');
  if (migrated === 'true') {
    console.log('Already migrated');
    return;
  }
  
  // Gather all localStorage data
  const data: any = {};
  
  try {
    const txnRaw = localStorage.getItem('twocents.ledger.v1');
    if (txnRaw) data.transactions = JSON.parse(txnRaw);
  } catch (e) {
    console.error('Failed to load transactions for migration:', e);
  }
  
  try {
    const goalsRaw = localStorage.getItem('twocents-goals');
    if (goalsRaw) data.goals = JSON.parse(goalsRaw);
  } catch (e) {
    console.error('Failed to load goals for migration:', e);
  }
  
  try {
    const billsRaw = localStorage.getItem('twocents.recurring.v1');
    if (billsRaw) data.bills = JSON.parse(billsRaw);
  } catch (e) {
    console.error('Failed to load bills for migration:', e);
  }
  
  try {
    const settingsRaw = localStorage.getItem('twocents.settings.v1');
    if (settingsRaw) data.settings = JSON.parse(settingsRaw);
  } catch (e) {
    console.error('Failed to load settings for migration:', e);
  }
  
  // Perform migration
  if (Object.keys(data).length > 0) {
    console.log('Migrating data to SQLite...', data);
    await getElectronAPI().migrateFromLocalStorage(data);
    localStorage.setItem('twocents.migrated', 'true');
    console.log('Migration complete!');
  }
}
