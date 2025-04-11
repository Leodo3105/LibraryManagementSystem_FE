import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7042', // Hoặc cổng HTTPS của backend
        changeOrigin: true,
        secure: false // Thêm option này nếu bạn dùng chứng chỉ SSL tự ký
      }
    }
  }
})