// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import type { Transaction, Goal, Bill, Settings } from './database';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Transaction operations
  getAllTransactions: () => ipcRenderer.invoke('db:getAllTransactions'),
  addTransaction: (txn: Omit<Transaction, 'id'>) => ipcRenderer.invoke('db:addTransaction', txn),
  removeTransaction: (id: string) => ipcRenderer.invoke('db:removeTransaction', id),
  clearTransactions: () => ipcRenderer.invoke('db:clearTransactions'),
  
  // Goal operations
  getAllGoals: () => ipcRenderer.invoke('db:getAllGoals'),
  addGoal: (goal: Omit<Goal, 'id'>) => ipcRenderer.invoke('db:addGoal', goal),
  updateGoal: (id: string, updates: Partial<Goal>) => ipcRenderer.invoke('db:updateGoal', id, updates),
  removeGoal: (id: string) => ipcRenderer.invoke('db:removeGoal', id),
  
  // Bill operations
  getAllBills: () => ipcRenderer.invoke('db:getAllBills'),
  addBill: (bill: Omit<Bill, 'id'>) => ipcRenderer.invoke('db:addBill', bill),
  updateBill: (id: string, updates: Partial<Bill>) => ipcRenderer.invoke('db:updateBill', id, updates),
  removeBill: (id: string) => ipcRenderer.invoke('db:removeBill', id),
  
  // Settings operations
  getSettings: () => ipcRenderer.invoke('db:getSettings'),
  updateSettings: (settings: Partial<Settings>) => ipcRenderer.invoke('db:updateSettings', settings),
  addCategory: (category: { id?: string; name: string; limit: number }) => ipcRenderer.invoke('db:addCategory', category),
  removeCategory: (id: string) => ipcRenderer.invoke('db:removeCategory', id),
  
  // Migration
  migrateFromLocalStorage: (data: any) => ipcRenderer.invoke('db:migrateFromLocalStorage', data),
  
  // Listen for database updates from other windows
  onDatabaseUpdate: (callback: (event: string) => void) => {
    const listener = (_: any, event: string) => callback(event);
    ipcRenderer.on('db:update', listener);
    return () => ipcRenderer.removeListener('db:update', listener);
  },
  
  // Auto-update functions
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdateAvailable: (callback: (info: any) => void) => {
    const listener = (_: any, info: any) => callback(info);
    ipcRenderer.on('update-available', listener);
    return () => ipcRenderer.removeListener('update-available', listener);
  },
  onUpdateDownloaded: (callback: (info: any) => void) => {
    const listener = (_: any, info: any) => callback(info);
    ipcRenderer.on('update-downloaded', listener);
    return () => ipcRenderer.removeListener('update-downloaded', listener);
  },
  
  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  windowIsMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  getPlatform: () => ipcRenderer.invoke('window:getPlatform'),
});

// Type definitions for TypeScript
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
  
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  onUpdateAvailable: (callback: (info: any) => void) => () => void;
  onUpdateDownloaded: (callback: (info: any) => void) => () => void;
  
  windowMinimize: () => Promise<void>;
  windowMaximize: () => Promise<void>;
  windowClose: () => Promise<void>;
  windowIsMaximized: () => Promise<boolean>;
  getPlatform: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
