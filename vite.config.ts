import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@stripe/react-stripe-js': resolve(__dirname, 'node_modules/@stripe/react-stripe-js/dist/react-stripe.esm.js'),
      '@stripe/stripe-js': resolve(__dirname, 'node_modules/@stripe/stripe-js/dist/stripe.esm.js')
    }
  },
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
    // Ensure source maps are generated for debugging
    sourcemap: true
  },
  optimizeDeps: {
    entries: ['./index.html'],
    include: [
      'react', 
      'react-dom', 
      '@stripe/react-stripe-js',
      '@stripe/stripe-js'
    ],
    esbuildOptions: {
      target: 'esnext',
      treeShaking: true,
      minify: true
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