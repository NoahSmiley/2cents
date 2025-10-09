// electron/main.cjs
const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('node:path');
const { autoUpdater } = require('electron-updater');

const db = require('./database.cjs');

let win = null;

// Configure auto-updater
autoUpdater.autoDownload = false; // Don't auto-download, ask user first
autoUpdater.autoInstallOnAppQuit = true;

async function createWindow() {
  const isDev = !app.isPackaged;
  
  // Determine correct paths based on environment
  let preloadPath, indexPath;
  
  if (isDev) {
    // Development: files are in project structure
    preloadPath = join(__dirname, '../dist-electron/preload.js');
    indexPath = 'http://localhost:5173';
  } else {
    // Production: files are in app.asar
    // __dirname in production is: app.asar/electron
    // preload is at: app.asar/dist-electron/preload.js
    // index.html is at: app.asar/dist/index.html
    preloadPath = join(__dirname, '../dist-electron/preload.js');
    indexPath = join(__dirname, '../dist/index.html');
  }
  
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    title: '2cents - Budget Tracker',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    await win.loadURL(indexPath);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    await win.loadFile(indexPath);
  }

  win.on('closed', () => (win = null));
}

// Initialize database and IPC handlers
function setupDatabase() {
  db.initDatabase();
  
  // Transaction handlers
  ipcMain.handle('db:getAllTransactions', () => db.getAllTransactions());
  ipcMain.handle('db:addTransaction', (_, txn) => db.addTransaction(txn));
  ipcMain.handle('db:removeTransaction', (_, id) => db.removeTransaction(id));
  ipcMain.handle('db:clearTransactions', () => db.clearTransactions());
  
  // Goal handlers
  ipcMain.handle('db:getAllGoals', () => db.getAllGoals());
  ipcMain.handle('db:addGoal', (_, goal) => db.addGoal(goal));
  ipcMain.handle('db:updateGoal', (_, id, updates) => db.updateGoal(id, updates));
  ipcMain.handle('db:removeGoal', (_, id) => db.removeGoal(id));
  
  // Bill handlers
  ipcMain.handle('db:getAllBills', () => db.getAllBills());
  ipcMain.handle('db:addBill', (_, bill) => db.addBill(bill));
  ipcMain.handle('db:updateBill', (_, id, updates) => db.updateBill(id, updates));
  ipcMain.handle('db:removeBill', (_, id) => db.removeBill(id));
  
  // Settings handlers
  ipcMain.handle('db:getSettings', () => db.getSettings());
  ipcMain.handle('db:updateSettings', (_, settings) => db.updateSettings(settings));
  ipcMain.handle('db:addCategory', (_, category) => db.addCategory(category));
  ipcMain.handle('db:removeCategory', (_, id) => db.removeCategory(id));
  
  // Migration handler
  ipcMain.handle('db:migrateFromLocalStorage', (_, data) => {
    if (data.transactions && Array.isArray(data.transactions)) {
      for (const txn of data.transactions) {
        db.addTransaction(txn);
      }
    }
    if (data.goals && Array.isArray(data.goals)) {
      for (const goal of data.goals) {
        db.addGoal(goal);
      }
    }
    if (data.bills && Array.isArray(data.bills)) {
      for (const bill of data.bills) {
        db.addBill(bill);
      }
    }
    if (data.settings) {
      db.updateSettings(data.settings);
    }
  });
}

// Auto-updater event handlers
autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  if (win) {
    win.webContents.send('update-available', info);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`Download progress: ${progressObj.percent}%`);
  if (win) {
    win.webContents.send('download-progress', progressObj);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  if (win) {
    win.webContents.send('update-downloaded', info);
  }
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
  if (win) {
    win.webContents.send('update-error', err.message);
  }
});

// IPC handlers for updates
ipcMain.handle('check-for-updates', async () => {
  if (!app.isPackaged) {
    return { available: false, message: 'Updates only work in production' };
  }
  try {
    const result = await autoUpdater.checkForUpdates();
    return { available: true, version: result?.updateInfo?.version };
  } catch (error) {
    return { available: false, error: error.message };
  }
});

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

// Catch any unhandled errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

app.whenReady()
  .then(() => {
    setupDatabase();
    
    createWindow().catch(err => {
      console.error('Failed to create window:', err);
      app.quit();
    });

    // Check for updates after app starts (only in production)
    if (app.isPackaged) {
      setTimeout(() => {
        autoUpdater.checkForUpdates().catch(err => {
          console.log('Update check failed:', err.message);
        });
      }, 3000); // Wait 3 seconds after app starts
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().catch(err => {
          console.error('Failed to create window on activate:', err);
          app.quit();
        });
      }
    });
  })
  .catch(err => {
    console.error('App failed to get ready:', err);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.closeDatabase();
    app.quit();
  }
});

app.on('before-quit', () => {
  db.closeDatabase();
});
