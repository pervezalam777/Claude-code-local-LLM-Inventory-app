import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '**/*.d.ts'],
    setupFiles: ['./src/test/setup.ts'],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
  },
});
