import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function manifestPlugin(mode: string) {
  const manifestName =
    mode === 'development' ? 'manifest.dev.json' : 'manifest.prod.json'

  return {
    name: 'omnivy-manifest',
    closeBundle() {
      copyFileSync(
        resolve(__dirname, 'public', manifestName),
        resolve(__dirname, 'dist', 'manifest.json'),
      )
      for (const extraManifest of ['manifest.dev.json', 'manifest.prod.json']) {
        const outputPath = resolve(__dirname, 'dist', extraManifest)
        if (existsSync(outputPath)) {
          unlinkSync(outputPath)
        }
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), tsconfigPaths(), manifestPlugin(mode)],
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
}))
