import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@omnivy/ui'],
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        settings: resolve(__dirname, 'settings.html'),
        background: resolve(__dirname, 'src/services/background/main.ts'),
        content: resolve(__dirname, 'src/services/content/content.ts'),
        popupScript: resolve(__dirname, 'src/main.tsx'),
        settingsScript: resolve(__dirname, 'src/mainsettings.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: undefined,
        assetFileNames: undefined,
        manualChunks: undefined,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
