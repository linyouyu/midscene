import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths'; // Only if using tsconfig.compilerOptions.paths

export default defineConfig({
  // plugins: [tsconfigPaths()], // Uncomment if needed
  test: {
    globals: true,
    environment: 'jsdom', // Essential for frontend tests that interact with DOM/window
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/types.ts', // Usually re-exports shared types
        'src/**/index.ts', // If main index is just exports or example runner
        'src/**/*.test.ts', // Test files themselves
      ],
    },
    // Optional: setup files for mocks or global configurations
    // setupFiles: ['./src/tests/setup.ts'],
  },
});
