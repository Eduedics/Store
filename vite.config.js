import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Store/',
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:800',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}'],
    },
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  base: process.env.NODE_ENV === 'production' ? '/my-app/' : '/',
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  json: {
    namedExports: true,
  },
  worker: {
    format: 'es',
    plugins: [
      {
        name: 'worker-plugin',
        transform(code, id) {
          if (id.endsWith('.worker.js')) {
            return {
              code: `export default ${code}`,
              map: null,
            };
          }
        },
      },
    ],
  },
  optimizeDeps: {
    entries: ['src/main.jsx'],
  },
  resolve: {
    conditions: ['browser'],
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'react-router-dom'],
  },
  json: {
    stringify: true,
  },
  cacheDir: 'node_modules/.vite',
  clearScreen: false,
  logLevel: 'info',   

})
