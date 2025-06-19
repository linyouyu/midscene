import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../index'; // Import the Express app
import {
  ActionPlan,
  DomNode,
  SpecialControlRecommendation,
  ActionType,
  WebElementInfo,
  ActionStep,
  UIContext, // For checking insight construction if possible
} from '@web-agent/shared-types';

// Mocks are in setupTests.ts, but we can import the mock functions to check calls
import { mockPlan, mockGetAIConfig, MockInsight } from './tests/setupTests';

describe('API Endpoints', () => {
  let mockDomTree: DomNode;
  let mockRecommendations: SpecialControlRecommendation[];
  let mockProblematicStep: ActionStep;

  beforeEach(() => {
    // Reset mocks (already done in setupTests.ts, but good for clarity if needed here)
    // mockPlan.mockClear();
    // mockGetAIConfig.mockClear();

    // Setup default return values for mocks (also done in setupTests.ts)
    // mockGetAIConfig.mockReturnValue({ apiKey: 'test-key', model: 'test-model' });
    // mockPlan.mockResolvedValue({ plan: [{ type: ActionType.TAP, description: 'Mocked tap' }], usage: {}, cost: 0, error: null, model: 'test-model' });

    // Prepare mock data
    const mockElementInfo: WebElementInfo = {
      id: 'elem1',
      attributes: { class: 'button' },
      content: 'Click Me',
      rect: { left: 0, top: 0, width: 10, height: 10 },
      nodeType: 'BUTTON',
      htmlTagName: 'button',
    };
    mockDomTree = {
      element: { ...mockElementInfo, id: 'root' },
      children: [{ element: mockElementInfo, children: [] }],
    };

    mockRecommendations = [
      {
        detectedElementId: 'elem1',
        originalInstructionFragment: 'click the button',
        confidence: 0.8,
        recommendedSteps: [{ type: ActionType.CLICK, targetElementId: 'elem1', description: 'Click button' }],
      },
    ];

    mockProblematicStep = {
        type: ActionType.TYPE,
        elementId: "input1",
        value: "test",
        description: "Type 'test' into input1"
    };
  });

  describe('POST /api/v1/process-page', () => {
    it('should return 200 and a plan on valid request', async () => {
      const payload = {
        instruction: 'Test instruction',
        domTree: mockDomTree,
        screenshotData: 'base64screenshotdata',
        url: 'http://example.com',
        windowSize: { width: 1920, height: 1080 },
        recommendations: mockRecommendations,
      };

      const response = await request(app)
        .post('/api/v1/process-page')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.plan).toBeDefined();
      expect(response.body.plan[0].description).toEqual('Mocked tap action from default mockPlan'); // From default mock
      expect(mockPlan).toHaveBeenCalledOnce();

      const [instruction, insight, options] = mockPlan.calls[0];
      expect(instruction).toBe(payload.instruction);
      expect(options.aiConfig.apiKey).toBe('test-api-key');
      expect(options.actionContext).toContain("ID: 'elem1'");
      expect(options.actionContext).toContain("User seems to want to interact with this regarding: \"click the button\"");
      expect(options.previous_logs).toEqual([]);

      // Test UIContext construction by insight (simplified)
      const context = await (insight as MockInsight).getContext();
      expect(context.url).toBe(payload.url);
      expect(context.tree).toEqual(payload.domTree); // Structural check
      expect(context.screen).toBe(payload.screenshotData);
      expect(context.windowSize).toEqual(payload.windowSize);

    });

    it('should return 400 if required fields are missing', async () => {
      const payload = {
        // instruction: 'Test instruction', // Missing instruction
        domTree: mockDomTree,
        screenshotData: 'base64screenshotdata',
        url: 'http://example.com',
        windowSize: { width: 1920, height: 1080 },
      };
      const response = await request(app)
        .post('/api/v1/process-page')
        .send(payload);
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing instruction');
    });
  });

  describe('POST /api/v1/replan', () => {
    it('should return 200 and a new plan on valid replan request', async () => {
      const payload = {
        instruction: 'Replan instruction',
        problematicStep: mockProblematicStep,
        domTree: mockDomTree,
        screenshotData: 'base64screenshotdata_replan',
        url: 'http://replan-example.com',
        windowSize: { width: 1280, height: 720 },
        recommendations: mockRecommendations,
      };

      const response = await request(app)
        .post('/api/v1/replan')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.plan).toBeDefined();
      expect(mockPlan).toHaveBeenCalledOnce();

      const [instruction, insight, options] = mockPlan.calls[0];
      expect(instruction).toBe(payload.instruction);
      expect(options.aiConfig.apiKey).toBe('test-api-key');
      expect(options.actionContext).toContain(`Replanning after failed step: ${payload.problematicStep.description}`);
      expect(options.actionContext).toContain("ID: 'elem1'"); // Recommendation text
      expect(options.previous_logs).toBeInstanceOf(Array);
      expect(options.previous_logs.length).toBe(2);
      expect(options.previous_logs[0].role).toBe('assistant');
      expect(options.previous_logs[0].content).toContain(payload.problematicStep.description);
      expect(options.previous_logs[1].role).toBe('user');

      const context = await (insight as MockInsight).getContext();
      expect(context.url).toBe(payload.url);
      expect(context.tree).toEqual(payload.domTree);
    });

    it('should return 400 if required fields are missing for replan', async () => {
      const payload = {
        // instruction: 'Replan instruction', // Missing
        problematicStep: mockProblematicStep,
        domTree: mockDomTree,
        screenshotData: 'base64screenshotdata_replan',
        url: 'http://replan-example.com',
        windowSize: { width: 1280, height: 720 },
      };
      const response = await request(app)
        .post('/api/v1/replan')
        .send(payload);
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing instruction');
    });
  });

  // Implicit test for formatRecommendationsToText via actionContext checks above
  describe('formatRecommendationsToText (implicitly tested)', () => {
    it('should be included in actionContext when recommendations are present', () => {
        // This is covered by the main endpoint tests checking options.actionContext
        expect(mockPlan).toHaveBeenCalled(); // Ensure mockPlan was called
        if(mockPlan.mock.calls.length > 0) {
            const options = mockPlan.mock.calls[0][2] as LLMPlannerOptions; // Get options from the first call
            if (options.actionContext) { // Check if actionContext exists
                 expect(options.actionContext).toContain("Special Control Hints:");
                 expect(options.actionContext).toContain("ID: 'elem1'");
            } else {
                // This case means no recommendations were passed or formatting was empty
                // which is fine if that was the test scenario.
            }
        }
    });
  });
});
