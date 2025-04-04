import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
      port: 4173,
      clientPort: 4173,
      timeout: 120000
    }
  },
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
          'vendor': ['react', 'react-dom', 'lucide-react', '@react-oauth/google', 'recharts'],
          'auth': ['@react-oauth/google', 'jsonwebtoken', 'bcryptjs'],
          'ui': ['lucide-react', 'recharts'],
          'utils': ['axios', 'zustand']
        }
      },
      treeshake: true
    },
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      polyfill: true
    },
    reportCompressedSize: false,
    emptyOutDir: true,
    assetsInlineLimit: 8192,
    sourcemap: true
  },
  optimizeDeps: {
    entries: ['./index.html'],
    include: [
      'react',
      'react-dom'
    ],
    esbuildOptions: {
      target: 'esnext',
      treeShaking: true,
      minify: true
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});