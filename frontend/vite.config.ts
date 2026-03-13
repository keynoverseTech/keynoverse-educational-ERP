import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://erp-api-production-024c.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/admin-api': {
        target: 'https://erp-api-production-024c.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/admin-api/, '/api'),
      },
      '/privilege-api': {
        target: 'https://erp-api-production-024c.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/privilege-api/, '/api'),
      },
      
    },
  },
})
