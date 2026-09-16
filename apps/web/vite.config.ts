import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@preview-bond/shared': path.resolve(__dirname, '../../packages/shared'),
      '@preview-bond/simulator': path.resolve(__dirname, '../../packages/simulator'),
      '@preview-bond/types': path.resolve(__dirname, '../../packages/types'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
