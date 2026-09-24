import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // three.js lives in the lazily loaded hero scene chunk
  build: { chunkSizeWarningLimit: 1000 },
})
