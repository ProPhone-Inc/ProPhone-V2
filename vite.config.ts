import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react'],
          'auth': ['@react-oauth/google'],
          'dashboard': ['recharts'],
          'phone': []
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', '@react-oauth/google', 'recharts']
  },
  server: {
    fs: {
      strict: true
    },
    host: true
  }
})