import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { PlanExecutor } from './plan-executor';
import { ActionPlan, ActionType, ActionStep } from '@web-agent/shared-types';

describe('PlanExecutor', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.log and other console methods if used
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console methods
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('should log each step of the plan and return success', async () => {
    const executor = new PlanExecutor();
    const mockPlan: ActionPlan = {
      goal: 'Test execution of a simple plan',
      steps: [
        { type: ActionType.TAP, targetElementId: 'button1', description: 'Tap on button1' },
        { type: ActionType.INPUT, targetElementId: 'input1', value: 'hello world', description: 'Input text into input1' },
        { type: ActionType.SCROLL, description: 'Scroll down', parameters: { direction: 'down' } },
        // @ts-expect-error
        { type: 'UNKNOWN_ACTION', description: 'Perform an unknown action' }
      ],
    };

    const result = await executor.executePlan(mockPlan);

    expect(result.success).toBe(true);
    expect(result.result).toBe('Plan execution simulated.');

    // Check console logs for each step
    expect(consoleSpy).toHaveBeenCalledWith('Executing plan:', mockPlan);

    // Check specific logs for each step type
    // The exact number of console.log calls per step might vary based on implementation details,
    // so checking for specific content is more robust.
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Attempting to execute step: Tap on button1'), expect.anything());
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Executing ${ActionType.TAP} on element: button1`), expect.anything());

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Attempting to execute step: Input text into input1'), expect.anything());
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Executing ${ActionType.INPUT} on element: input1 with value: "hello world"`), expect.anything());

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Attempting to execute step: Scroll down'), expect.anything());
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Executing ${ActionType.SCROLL} on element: document`), expect.anything());

    // Check for warning on unknown action type
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Unknown action type: UNKNOWN_ACTION'),
      expect.anything()
    );
  });

  it('should handle an empty plan gracefully', async () => {
    const executor = new PlanExecutor();
    const mockEmptyPlan: ActionPlan = {
      goal: 'Test an empty plan',
      steps: [],
    };

    const result = await executor.executePlan(mockEmptyPlan);

    expect(result.success).toBe(true);
    expect(result.result).toBe('Plan execution simulated.');
    expect(consoleSpy).toHaveBeenCalledWith('Executing plan:', mockEmptyPlan);
    // Ensure no errors or unexpected logs for empty steps array
  });
});
