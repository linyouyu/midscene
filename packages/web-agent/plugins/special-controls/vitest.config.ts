import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths'; // Only if you have tsconfig.compilerOptions.paths

export default defineConfig({
  // plugins: [tsconfigPaths()], // Only if you have tsconfig.compilerOptions.paths
  test: {
    globals: true,
    environment: 'node', // Set to 'node' as we are testing logic, not direct DOM manipulation
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'], // Added lcov for better CI integration
      // Optional: specify directories to include/exclude
      // include: ['src/**/*.ts'],
      // exclude: ['src/types.ts', 'src/**/index.ts'], // Example: exclude type files or main index if they are just exports
    },
    // Optional: if using TypeScript paths in tests themselves
    // alias: {
    //   '@/*': './src/*',
    // },
  },
});
