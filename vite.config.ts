import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
          'auth': ['@react-oauth/google'],
          'charts': ['recharts']
        }
      }
    },
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false,
    emptyOutDir: true,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    entries: ['./index.html'],
    include: ['react', 'react-dom'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    host: true,
    port: 3000,
    fs: {
      strict: true
    },
    hmr: {
      overlay: false
    },
    watch: {
      usePolling: false
    }
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  }
}))