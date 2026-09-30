import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // Absolute base: the site is served from the domain root, and relative asset
  // URLs resolve against the current route (so /games/dragon-city would look for
  // /games/assets/*.js and /games/logo.svg). Must match the pages origin.
  base: '/',
  resolve: {
    // Mirrors the `@/*` path in tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});