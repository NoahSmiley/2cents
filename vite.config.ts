// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"
import tailwindcss from "@tailwindcss/vite"
// ⬇️ use the simple preset here
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
  plugins: [
    react(),tailwindcss(),
    electron({
      main: { entry: 'electron/main.ts' },
    }),
    
  ],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
