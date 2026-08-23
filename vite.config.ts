import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  test: {
    environment: 'node',
    exclude: ['tests/app-flow.spec.ts', '**/node_modules/**', '**/dist/**'],
  },
});
