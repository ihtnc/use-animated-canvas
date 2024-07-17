import checker from 'vite-plugin-checker'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'useAnimatedCanvas',
      fileName: 'use-animated-canvas'
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint --ext .ts,.tsx',
      }
    }),
    dts({ rollupTypes: true })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './lib')
    }
  }
})