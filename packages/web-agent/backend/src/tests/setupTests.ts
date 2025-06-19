import { vi } from 'vitest';

// Mock @midscene/core
export const mockPlan = vi.fn();
vi.mock('@midscene/core/ai-model/llm-planning', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any), // Spread actual exports if there are others needed
    plan: mockPlan,
  };
});

// Mock Insight class from @midscene/core - simple mock for now
export class MockInsight {
  constructor(public uiContextFetcher: () => Promise<any>) {}
  // Add any methods that might be called on Insight instances if necessary
  async getContext() {
    return this.uiContextFetcher();
  }
}
vi.mock('@midscene/core/insight', () => ({
  Insight: MockInsight,
}));


// Mock @midscene/shared
export const mockGetAIConfig = vi.fn();
vi.mock('@midscene/shared/env', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    getAIConfig: mockGetAIConfig,
  };
});

// Mock ElementTreeNode from @midscene/shared/types if needed, though it's a type.
// Usually, direct type imports don't need mocking unless they come with runtime components.
// For now, no specific mock for ElementTreeNode itself beyond its usage in function signatures.

// This setup file will be run before each test file.
// You can add other global setup tasks here.
beforeEach(() => {
  // Reset mocks before each test
  mockPlan.mockClear();
  mockGetAIConfig.mockClear();

  // Default mock implementations
  mockGetAIConfig.mockReturnValue({
    apiKey: 'test-api-key',
    model: 'test-model-from-mock',
    // Add other AIConfig fields if your code uses them
  });

  mockPlan.mockResolvedValue({
    plan: [{ type: 'TAP', description: 'Mocked tap action from default mockPlan' }],
    usage: { totalTokens: 100, promptTokens: 50, completionTokens: 50 }, // Example usage
    cost: 0.01, // Example cost
    error: null,
    model: 'test-model-from-mockPlan',
    // Add other fields from PlanningResponse if your code uses them
  });
});

afterEach(() => {
  // vi.restoreAllMocks(); // Or clear mocks individually if preferred
});
