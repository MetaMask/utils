import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Vitest enables watch mode by default. We disable it here, so it can be
    // explicitly enabled with `yarn test:watch`.
    watch: false,

    // Make `describe`, `it`, `expect`, etc. available globally without importing.
    globals: true,

    // Restore mocks between tests, matching Jest's default behavior.
    restoreMocks: true,

    // Some node_modules use relative ESM imports without file extensions,
    // which Vite cannot resolve at runtime. Inlining these modules causes
    // Vite to process them through esbuild so the imports resolve correctly.
    server: {
      deps: {
        inline: ['ethereum-cryptography', 'web3'],
      },
    },

    // The files to include in the test run.
    include: ['src/**/*.test.ts'],

    coverage: {
      enabled: true,

      // Configure the coverage provider. We use `istanbul` here, because it
      // is more stable than `v8`.
      provider: 'istanbul',

      // The files to include in the coverage report.
      include: ['src/**/*.ts'],

      // The files to exclude from the coverage report.
      exclude: [
        'src/__fixtures__/**/*',
        'src/**/*.test.ts',
        'src/**/*.test-d.ts',
        'src/index.ts',
        'src/node.ts',
      ],

      // Coverage thresholds. If the coverage is below these thresholds, the
      // test will fail.
      thresholds: {
        // Auto-update the coverage thresholds. When this is enabled, the
        // thresholds will be updated automatically when the coverage is
        // above the current thresholds.
        autoUpdate: true,

        branches: 98.8,
        functions: 100,
        lines: 99.53,
        statements: 99.54,
      },
    },

    typecheck: {
      enabled: true,

      // The path to the tsconfig file to use for type checking.
      tsconfig: './tsconfig.test.json',
    },
  },
});