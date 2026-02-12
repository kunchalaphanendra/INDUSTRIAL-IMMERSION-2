import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/',
    },
  },
  build: {
    rollupOptions: {
      // Mark dependencies as external to prevent Rollup from trying to resolve them locally
      // when they are provided by the browser's importmap or ESM URLs.
      external: ['@supabase/supabase-js'],
    },
  },
});
