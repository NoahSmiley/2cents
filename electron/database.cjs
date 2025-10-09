// electron/database.cjs
const Database = require('better-sqlite3');
const { app } = require('electron');
const { join } = require('node:path');
const { existsSync, mkdirSync } = require('node:fs');

let db = null;

function initDatabase() {
  // Store database in user's app data directory
  const userDataPath = app.getPath('userData');
  
  // Ensure directory exists
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true });
  }
  
  const dbPath = join(userDataPath, 'twocents.db');
  console.log('Database path:', dbPath);
  
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL'); // Better performance
  
  // Create tables
  createTables();
  
  return db;
}

function createTables() {
  if (!db) throw new Error('Database not initialized');
  
  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      note TEXT,
      who TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
  `);
  
  // Goals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
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
  `);
  
  // Goal linked categories (many-to-many)
  db.exec(`
    CREATE TABLE IF NOT EXISTS goal_linked_categories (
      goal_id TEXT NOT NULL,
      category TEXT NOT NULL,
      PRIMARY KEY (goal_id, category),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );
  `);
  
  // Goal linked bills (many-to-many)
  db.exec(`
    CREATE TABLE IF NOT EXISTS goal_linked_bills (
      goal_id TEXT NOT NULL,
      bill_name TEXT NOT NULL,
      PRIMARY KEY (goal_id, bill_name),
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );
  `);
  
  // Recurring bills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recurring_bills (
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
  `);
  
  // Settings table (key-value store)
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      limit_amount REAL NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function getDatabase() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// ==================== Transaction Operations ====================

function getAllTransactions() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM transactions ORDER BY date DESC');
  return stmt.all();
}

function addTransaction(txn) {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const stmt = db.prepare(`
    INSERT INTO transactions (id, date, amount, category, note, who)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, txn.date, txn.amount, txn.category || null, txn.note || null, txn.who || null);
  return { id, ...txn };
}

function removeTransaction(id) {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
  stmt.run(id);
}

function clearTransactions() {
  const db = getDatabase();
  db.prepare('DELETE FROM transactions').run();
}

// ==================== Goal Operations ====================

function getAllGoals() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM goals');
  const rows = stmt.all();
  
  return rows.map(row => {
    // Get linked categories
    const catStmt = db.prepare('SELECT category FROM goal_linked_categories WHERE goal_id = ?');
    const linkedCategories = catStmt.all(row.id).map(r => r.category);
    
    // Get linked bills
    const billStmt = db.prepare('SELECT bill_name FROM goal_linked_bills WHERE goal_id = ?');
    const linkedBillNames = billStmt.all(row.id).map(r => r.bill_name);
    
    return {
      id: row.id,
      name: row.name,
      current: row.current,
      target: row.target,
      category: row.category,
      targetDate: row.target_date || undefined,
      color: row.color,
      isDebt: row.is_debt === 1,
      originalDebt: row.original_debt || undefined,
      completedAt: row.completed_at || undefined,
      linkedCategories: linkedCategories.length > 0 ? linkedCategories : undefined,
      linkedBillNames: linkedBillNames.length > 0 ? linkedBillNames : undefined,
    };
  });
}

function addGoal(goal) {
  const db = getDatabase();
  const id = crypto.randomUUID();
  
  const stmt = db.prepare(`
    INSERT INTO goals (id, name, current, target, category, target_date, color, is_debt, original_debt, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    goal.name,
    goal.current,
    goal.target,
    goal.category,
    goal.targetDate || null,
    goal.color,
    goal.isDebt ? 1 : 0,
    goal.originalDebt || null,
    goal.completedAt || null
  );
  
  // Insert linked categories
  if (goal.linkedCategories && goal.linkedCategories.length > 0) {
    const catStmt = db.prepare('INSERT INTO goal_linked_categories (goal_id, category) VALUES (?, ?)');
    for (const cat of goal.linkedCategories) {
      catStmt.run(id, cat);
    }
  }
  
  // Insert linked bills
  if (goal.linkedBillNames && goal.linkedBillNames.length > 0) {
    const billStmt = db.prepare('INSERT INTO goal_linked_bills (goal_id, bill_name) VALUES (?, ?)');
    for (const billName of goal.linkedBillNames) {
      billStmt.run(id, billName);
    }
  }
  
  return { id, ...goal };
}

function updateGoal(id, updates) {
  const db = getDatabase();
  
  // Build dynamic update query
  const fields = [];
  const values = [];
  
  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.current !== undefined) { fields.push('current = ?'); values.push(updates.current); }
  if (updates.target !== undefined) { fields.push('target = ?'); values.push(updates.target); }
  if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
  if (updates.targetDate !== undefined) { fields.push('target_date = ?'); values.push(updates.targetDate || null); }
  if (updates.color !== undefined) { fields.push('color = ?'); values.push(updates.color); }
  if (updates.isDebt !== undefined) { fields.push('is_debt = ?'); values.push(updates.isDebt ? 1 : 0); }
  if (updates.originalDebt !== undefined) { fields.push('original_debt = ?'); values.push(updates.originalDebt || null); }
  if (updates.completedAt !== undefined) { fields.push('completed_at = ?'); values.push(updates.completedAt || null); }
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  if (fields.length > 0) {
    const stmt = db.prepare(`UPDATE goals SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values, id);
  }
  
  // Update linked categories if provided
  if (updates.linkedCategories !== undefined) {
    db.prepare('DELETE FROM goal_linked_categories WHERE goal_id = ?').run(id);
    if (updates.linkedCategories.length > 0) {
      const catStmt = db.prepare('INSERT INTO goal_linked_categories (goal_id, category) VALUES (?, ?)');
      for (const cat of updates.linkedCategories) {
        catStmt.run(id, cat);
      }
    }
  }
  
  // Update linked bills if provided
  if (updates.linkedBillNames !== undefined) {
    db.prepare('DELETE FROM goal_linked_bills WHERE goal_id = ?').run(id);
    if (updates.linkedBillNames.length > 0) {
      const billStmt = db.prepare('INSERT INTO goal_linked_bills (goal_id, bill_name) VALUES (?, ?)');
      for (const billName of updates.linkedBillNames) {
        billStmt.run(id, billName);
      }
    }
  }
}

function removeGoal(id) {
  const db = getDatabase();
  // Cascading deletes will handle linked tables
  db.prepare('DELETE FROM goals WHERE id = ?').run(id);
}

// ==================== Bill Operations ====================

function getAllBills() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM recurring_bills');
  const rows = stmt.all();
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    amount: row.amount,
    dueDay: row.due_day,
    lastPaid: row.last_paid || undefined,
    linkedGoalId: row.linked_goal_id || undefined,
    category: row.category || undefined,
  }));
}

function addBill(bill) {
  const db = getDatabase();
  const id = crypto.randomUUID();
  
  const stmt = db.prepare(`
    INSERT INTO recurring_bills (id, name, amount, due_day, last_paid, linked_goal_id, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    bill.name,
    bill.amount,
    bill.dueDay,
    bill.lastPaid || null,
    bill.linkedGoalId || null,
    bill.category || null
  );
  
  return { id, ...bill };
}

function updateBill(id, updates) {
  const db = getDatabase();
  
  const fields = [];
  const values = [];
  
  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.amount !== undefined) { fields.push('amount = ?'); values.push(updates.amount); }
  if (updates.dueDay !== undefined) { fields.push('due_day = ?'); values.push(updates.dueDay); }
  if (updates.lastPaid !== undefined) { fields.push('last_paid = ?'); values.push(updates.lastPaid || null); }
  if (updates.linkedGoalId !== undefined) { fields.push('linked_goal_id = ?'); values.push(updates.linkedGoalId || null); }
  if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category || null); }
  
  if (fields.length > 0) {
    const stmt = db.prepare(`UPDATE recurring_bills SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values, id);
  }
}

function removeBill(id) {
  const db = getDatabase();
  db.prepare('DELETE FROM recurring_bills WHERE id = ?').run(id);
}

// ==================== Settings Operations ====================

function getSettings() {
  const db = getDatabase();
  
  // Get currency and UI mode
  const settingsStmt = db.prepare('SELECT key, value FROM settings WHERE key IN (?, ?)');
  const settingsRows = settingsStmt.all('currency', 'uiMode');
  
  const settingsMap = new Map(settingsRows.map(r => [r.key, r.value]));
  
  // Get categories
  const categoriesStmt = db.prepare('SELECT id, name, limit_amount FROM categories');
  const categories = categoriesStmt.all().map(row => ({
    id: row.id,
    name: row.name,
    limit: row.limit_amount,
  }));
  
  return {
    currency: settingsMap.get('currency') || '$',
    uiMode: settingsMap.get('uiMode') || 'professional',
    categories: categories.length > 0 ? categories : [
      { id: crypto.randomUUID(), name: 'Groceries', limit: 600 },
      { id: crypto.randomUUID(), name: 'Eating Out', limit: 250 },
      { id: crypto.randomUUID(), name: 'Fun', limit: 200 },
      { id: crypto.randomUUID(), name: 'Bills', limit: 1600 },
    ],
  };
}

function updateSettings(settings) {
  const db = getDatabase();
  
  if (settings.currency !== undefined) {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run('currency', settings.currency);
  }
  
  if (settings.uiMode !== undefined) {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run('uiMode', settings.uiMode);
  }
  
  if (settings.categories !== undefined) {
    // Clear existing categories
    db.prepare('DELETE FROM categories').run();
    
    // Insert new categories
    const stmt = db.prepare('INSERT INTO categories (id, name, limit_amount) VALUES (?, ?, ?)');
    for (const cat of settings.categories) {
      stmt.run(cat.id, cat.name, cat.limit);
    }
  }
}

function addCategory(category) {
  const db = getDatabase();
  const id = category.id || crypto.randomUUID();
  
  const stmt = db.prepare('INSERT OR REPLACE INTO categories (id, name, limit_amount) VALUES (?, ?, ?)');
  stmt.run(id, category.name, category.limit);
}

function removeCategory(id) {
  const db = getDatabase();
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
}

// Export all functions
module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  getAllTransactions,
  addTransaction,
  removeTransaction,
  clearTransactions,
  getAllGoals,
  addGoal,
  updateGoal,
  removeGoal,
  getAllBills,
  addBill,
  updateBill,
  removeBill,
  getSettings,
  updateSettings,
  addCategory,
  removeCategory,
};
