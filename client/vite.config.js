import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: [
      '9f4e66a4-d1e3-46df-9404-d83e97114607-00-1scq8n2y3b1bv.worf.replit.dev',
      '.replit.dev'
    ],
    hmr: {
      clientPort: 443
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
