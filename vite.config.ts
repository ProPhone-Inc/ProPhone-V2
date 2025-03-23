import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
      port: 3000,
      clientPort: 3000,
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
      polyfill: true
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
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});