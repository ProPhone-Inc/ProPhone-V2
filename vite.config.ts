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
    assetsInlineLimit: 4096,
    // Ensure source maps are generated for debugging
    sourcemap: true
  },
  optimizeDeps: {
    entries: ['./index.html'],
    include: ['react', 'react-dom'],
    esbuildOptions: {
      target: 'esnext'
    }
    // Configure server for both development and production
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});