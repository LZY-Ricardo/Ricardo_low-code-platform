import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/dist/',
  server: {
    port: 3333,
    open: true,
  },
  plugins: [react()],
})
