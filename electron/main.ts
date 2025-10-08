// electron/main.ts
import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const isDev = !!process.env.VITE_DEV_SERVER_URL;

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    title: 'Minimal Electron',
    webPreferences: {
      // If Noah add a preload later, point to compiled JS:
      // preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

// electron/main.ts
if (isDev && process.env.VITE_DEV_SERVER_URL) {
  await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  if (process.env.OPEN_DEVTOOLS) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
} else {
    // __dirname points to dist-electron at runtime
    await win.loadFile(join(__dirname, '../dist/index.html'));
  }

  win.on('closed', () => (win = null));
}

app.whenReady()
  .then(() => {
    createWindow().catch(err => {
      console.error('Failed to create window:', err);
      app.quit();
    });

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
  if (process.platform !== 'darwin') app.quit();
});
