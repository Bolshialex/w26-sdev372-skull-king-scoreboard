import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/players': 'http://localhost:3056',
      '/game': 'http://localhost:3056',
    },
  },
})
