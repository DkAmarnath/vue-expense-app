import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/expenses': 'http://localhost:3000' // Proxy API calls to Express backend
    }
  }
})
