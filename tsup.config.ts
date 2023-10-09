import { defineConfig } from 'tsup';

export default defineConfig({
  // The entry to bundle.
  entry: ['src/index.ts'],

  // The output formats. We want to generate both CommonJS and ESM bundles.
  // https://tsup.egoist.dev/#bundle-formats
  format: ['cjs', 'esm'],

  // Generate sourcemaps as separate files.
  // https://tsup.egoist.dev/#generate-sourcemap-file
  sourcemap: true,

  // Clean the dist folder before bundling.
  clean: true,

  // Enables TypeScript declaration files.
  // https://tsup.egoist.dev/#generate-declaration-file
  dts: true,

  // Enables shimming of `__dirname` and `import.meta.url`, so that they work
  // in both CommonJS and ESM.
  // https://tsup.egoist.dev/#inject-cjs-and-esm-shims
  shims: true,

  // Hide unnecessary logs from the console. Warnings and errors will still be
  // shown.
  silent: true,
});
