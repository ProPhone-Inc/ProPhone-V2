import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configure Vite for production server deployment
export default defineConfig(({ command }) => ({
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
  },
  server: {
    // Configure server for both development and production
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    fs: {
      strict: true
    },
    hmr: {
      protocol: 'ws',
      host: process.env.HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '3000')
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  preview: {
    port: parseInt(process.env.PORT || '4173'),
    host: process.env.HOST || '0.0.0.0',
    strictPort: true
  }
}));