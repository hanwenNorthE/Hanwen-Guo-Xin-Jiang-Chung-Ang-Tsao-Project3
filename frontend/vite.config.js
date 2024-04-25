import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //testing
  //define: {
  //  'process.env.API_URL': JSON.stringify(process.env.API_URL)
  //},
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // URL
        changeOrigin: true, 
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  }
})
