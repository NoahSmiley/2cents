// electron/launcher.js
// Simple launcher that spawns Electron with the correct entry point
const { spawn } = require('child_process');
const { join } = require('path');

const electronPath = require('electron');
const appPath = join(__dirname, 'main.cjs');

console.log('Launching Electron...');
console.log('Electron path:', electronPath);
console.log('App path:', appPath);

const child = spawn(electronPath, [appPath], {
  stdio: 'inherit',
  env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined }
});

child.on('close', (code) => {
  process.exit(code);
});
