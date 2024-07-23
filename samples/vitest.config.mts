import react from '@vitejs/plugin-react';
import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.tsx'
  }
});