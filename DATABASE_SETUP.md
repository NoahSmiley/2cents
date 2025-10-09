# Database Setup Guide

## Overview

**2cents** now uses **SQLite** as its local database, providing a robust, file-based storage solution that requires zero configuration from end users. Each user who downloads the app gets their own isolated database file.

## Architecture

### Technology Stack
- **Database**: SQLite via `better-sqlite3`
- **Location**: User's app data directory (automatically managed by Electron)
- **Communication**: IPC (Inter-Process Communication) between renderer and main process
- **Fallback**: localStorage for browser-based development

### File Structure
```
electron/
├── database.ts       # Database initialization, schema, and operations
├── main.ts          # IPC handlers and app lifecycle
└── preload.ts       # Secure API exposure to renderer

src/
├── lib/
│   └── db-service.ts    # Abstraction layer with localStorage fallback
├── types/
│   └── electron.d.ts    # TypeScript definitions
└── components/
    └── DataMigration.tsx # Auto-migration from localStorage
```

## Database Schema

### Tables

#### `transactions`
Stores all income and expense transactions.
```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT,
  note TEXT,
  who TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `goals`
Stores savings goals and debt tracking.
```sql
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current REAL NOT NULL DEFAULT 0,
  target REAL NOT NULL,
  category TEXT NOT NULL,
  target_date TEXT,
  color TEXT NOT NULL,
  is_debt INTEGER DEFAULT 0,
  original_debt REAL,
  completed_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `recurring_bills`
Stores monthly recurring bills.
```sql
CREATE TABLE recurring_bills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  due_day INTEGER NOT NULL,
  last_paid TEXT,
  linked_goal_id TEXT,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (linked_goal_id) REFERENCES goals(id) ON DELETE SET NULL
);
```

#### `settings`
Key-value store for app settings.
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `categories`
Budget categories with spending limits.
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  limit_amount REAL NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## User Data Isolation

### How It Works
1. **Installation**: When a user installs the app, Electron automatically creates a user-specific data directory
2. **Database Creation**: On first launch, SQLite creates `twocents.db` in that directory
3. **Automatic Migration**: Existing localStorage data is automatically migrated to SQLite on first run
4. **Per-User Storage**: Each OS user account gets their own database file

### Database Locations by OS
- **Windows**: `%APPDATA%\2cents\twocents.db`
- **macOS**: `~/Library/Application Support/2cents/twocents.db`
- **Linux**: `~/.config/2cents/twocents.db`

## Data Migration

The app automatically migrates data from localStorage to SQLite on first run:

1. Checks if migration has already occurred
2. Reads all localStorage data (transactions, goals, bills, settings)
3. Inserts data into SQLite database
4. Marks migration as complete
5. Shows loading screen during migration

Users don't need to do anything - it happens automatically!

## Development

### Running in Dev Mode
```bash
npm run dev
```
- Uses SQLite database when running in Electron
- Falls back to localStorage when running in browser (Vite dev server)

### Database Service Layer
The `db-service.ts` file provides a unified API that:
- Uses SQLite when running in Electron
- Falls back to localStorage in browser mode
- Maintains consistent API across both modes

Example usage:
```typescript
import * as dbService from '@/lib/db-service';

// Add a transaction
await dbService.addTransaction({
  date: '2025-10-08',
  amount: -50.00,
  category: 'Groceries',
  note: 'Weekly shopping'
});

// Get all transactions
const transactions = await dbService.getAllTransactions();
```

## Building for Distribution

### Build Commands
```bash
# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

### What Gets Packaged
- Compiled Electron app
- SQLite native module (automatically bundled)
- React frontend (built with Vite)
- Database schema (created on first run)

### Native Module Handling
`better-sqlite3` is a native Node.js module that gets automatically compiled for the target platform during the build process. electron-builder handles this automatically.

## Security Considerations

### Context Isolation
- ✅ `contextIsolation: true` - Renderer process is isolated
- ✅ `nodeIntegration: false` - No direct Node.js access from renderer
- ✅ Preload script exposes only necessary APIs

### Data Security
- Database file is stored in user's protected app data directory
- No network access - purely local storage
- No external API calls for data storage

## API Reference

### Transaction Operations
```typescript
getAllTransactions(): Promise<Transaction[]>
addTransaction(txn: Omit<Transaction, 'id'>): Promise<Transaction>
removeTransaction(id: string): Promise<void>
clearTransactions(): Promise<void>
```

### Goal Operations
```typescript
getAllGoals(): Promise<Goal[]>
addGoal(goal: Omit<Goal, 'id'>): Promise<Goal>
updateGoal(id: string, updates: Partial<Goal>): Promise<void>
removeGoal(id: string): Promise<void>
```

### Bill Operations
```typescript
getAllBills(): Promise<Bill[]>
addBill(bill: Omit<Bill, 'id'>): Promise<Bill>
updateBill(id: string, updates: Partial<Bill>): Promise<void>
removeBill(id: string): Promise<void>
```

### Settings Operations
```typescript
getSettings(): Promise<Settings>
updateSettings(settings: Partial<Settings>): Promise<void>
addCategory(category: { id?: string; name: string; limit: number }): Promise<void>
removeCategory(id: string): Promise<void>
```

## Troubleshooting

### Database Not Found
If you see "Database not initialized" errors:
1. Check that the app has write permissions to the user data directory
2. Verify SQLite native module is properly installed: `npm install better-sqlite3`

### Migration Issues
If data doesn't migrate:
1. Check browser console for migration errors
2. Verify localStorage data exists before migration
3. Delete `twocents.migrated` from localStorage to retry migration

### Build Errors
If native module build fails:
1. Ensure you have build tools installed:
   - Windows: `npm install --global windows-build-tools`
   - macOS: Xcode Command Line Tools
   - Linux: `build-essential` package
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Future Enhancements

Potential improvements:
- [ ] Database backup/restore functionality
- [ ] Export data to CSV/JSON
- [ ] Database encryption for sensitive data
- [ ] Sync between devices (optional cloud backup)
- [ ] Database vacuum/optimization on app close

## For Your Wife

When your wife downloads and installs the app:
1. **Double-click the installer** - That's it!
2. **Her data is completely separate** from yours
3. **No setup required** - Database is created automatically
4. **No internet needed** - Everything runs locally
5. **Privacy guaranteed** - Data never leaves her computer

Each installation is completely independent with its own database file.
