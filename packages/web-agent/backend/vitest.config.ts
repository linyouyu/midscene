import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths'; // Only if tsconfig.compilerOptions.paths are used extensively

export default defineConfig({
  // plugins: [tsconfigPaths()], // Uncomment if needed
  test: {
    globals: true,
    environment: 'node', // Backend tests run in Node
    setupFiles: ['./src/tests/setupTests.ts'], // Optional: For global test setup, like clearing mocks
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/types.ts', // Usually re-exports
        'src/**/index.ts', // If main index is just exports or startup
        'src/tests/**' // Test setup files
      ],
    },
  },
});
