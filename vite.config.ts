// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
          'charts': ['chart.js'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  define: {
    // Required for Supabase Realtime
    global: 'globalThis',
  },
})
