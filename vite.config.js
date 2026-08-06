import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Community_Issue_Reporting_System/', // Exact repository base path for GitHub Pages
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  }
});
