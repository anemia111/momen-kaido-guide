import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import offlinePlugin from './scripts/offline-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  base: '/momen-kaido-guide/',
  plugins: [react(), tailwindcss(), offlinePlugin()],
})
