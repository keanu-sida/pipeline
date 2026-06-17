import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Portfolio: VITE_BASE_PATH=/pipeline/ via .env.portfolio (see npm run build:portfolio)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            dexie: ['dexie', 'dexie-react-hooks'],
          },
        },
      },
    },
  }
})
