import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://email-scheduler-5lgq.onrender.com', // Your backend port
        changeOrigin: true,
        secure: false
      }
    }
  }
})
