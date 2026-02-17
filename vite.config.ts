import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

import Vue from '@vitejs/plugin-vue'
import ESLint from 'vite-plugin-eslint2'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    ESLint(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },

  define: {
    'process.env': {}
  },

  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false,
    watch: {
      usePolling: true
    }
  }
})
