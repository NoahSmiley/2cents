import { app as e, BrowserWindow as i } from "electron";
import { dirname as r, join as a } from "node:path";
import { fileURLToPath as l } from "node:url";
const c = l(import.meta.url), s = r(c), d = !!process.env.VITE_DEV_SERVER_URL;
let o = null;
async function n() {
  o = new i({
    width: 1e3,
    height: 700,
    title: "Minimal Electron",
    webPreferences: {
      // If Noah add a preload later, point to compiled JS:
      // preload: join(__dirname, 'preload.js'),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), d && process.env.VITE_DEV_SERVER_URL ? (await o.loadURL(process.env.VITE_DEV_SERVER_URL), process.env.OPEN_DEVTOOLS && o.webContents.openDevTools({ mode: "detach" })) : await o.loadFile(a(s, "../dist/index.html")), o.on("closed", () => o = null);
}
e.whenReady().then(() => {
  n().catch((t) => {
    console.error("Failed to create window:", t), e.quit();
  }), e.on("activate", () => {
    i.getAllWindows().length === 0 && n().catch((t) => {
      console.error("Failed to create window on activate:", t), e.quit();
    });
  });
}).catch((t) => {
  console.error("App failed to get ready:", t), e.quit();
});
e.on("window-all-closed", () => {
  process.platform !== "darwin" && e.quit();
});
