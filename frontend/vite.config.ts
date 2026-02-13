import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      // Proxy API requests to Nginx
      '/api': {
        target: 'http://nginx:80',
        changeOrigin: true,
      },
      // 🚨 NEW: Proxy WebSocket/SSE requests to Mercure
      '/.well-known/mercure': {
        target: 'http://mercure:80', // Internal Docker service name
        changeOrigin: true,
        // We don't need to rewrite the path, it matches exactly
      }
    }
  }
})
