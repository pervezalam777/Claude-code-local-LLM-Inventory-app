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
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: '../.sonarqube/coverage-js',
    include: ['src/**/*.tsx', 'src/**/*.ts'],
    exclude: [
      '**/*.test.{ts,tsx}',
      '**/*.d.ts',
      'node_modules/**',
      '**/vitest.config.*',
    ],
  },
});
