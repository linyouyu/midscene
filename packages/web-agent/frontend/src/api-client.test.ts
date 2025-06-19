import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from './api-client';
import { DomData, ActionStep, SpecialControlRecommendation, DomNode, WebElementInfo, ActionType } from '@web-agent/shared-types';

// Mock global fetch
global.fetch = vi.fn();

describe('ApiClient', () => {
  const mockFetch = vi.mocked(global.fetch);
  let apiClient: ApiClient;

  const mockElementInfo: WebElementInfo = {
    id: 'root',
    attributes: {},
    content: '',
    rect: { left: 0, top: 0, width: 10, height: 10 },
    nodeType: 'DIV',
    htmlTagName: 'div',
  };
  const mockRootNode: DomNode = { element: mockElementInfo, children: [] };
  const mockDomData: DomData = {
    rootNode: mockRootNode,
    url: 'http://page.com',
    windowSize: { width: 800, height: 600 },
    treeString: 'mockTreeString',
  };
  const mockScreenshot = 'data:image/png;base64,screenshot';
  const mockInstruction = 'Click the button';
  const mockRecommendations: SpecialControlRecommendation[] = [{
    detectedElementId: 'btn1',
    originalInstructionFragment: 'button',
    confidence: 0.9,
    recommendedSteps: [{ type: ActionType.CLICK, targetElementId: 'btn1', description: 'Click btn1' }]
  }];
  const mockActionStep: ActionStep = { type: ActionType.CLICK, targetElementId: 'btn1', description: 'Click btn1' };

  beforeEach(() => {
    mockFetch.mockClear();
    apiClient = new ApiClient('http://testapi.com');
  });

  describe('sendPageData', () => {
    it('should send page data to the correct endpoint with correct payload', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ plan: [], message: 'Success' }),
      } as Response);

      await apiClient.sendPageData(mockDomData, mockScreenshot, mockInstruction, mockRecommendations);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.calls[0];
      expect(url).toBe('http://testapi.com/api/v1/process-page');
      expect(options?.method).toBe('POST');
      expect(options?.headers).toEqual({ 'Content-Type': 'application/json' });

      const body = JSON.parse(options?.body as string);
      expect(body).toEqual({
        domTree: mockDomData.rootNode,
        url: mockDomData.url,
        windowSize: mockDomData.windowSize,
        screenshotData: mockScreenshot,
        instruction: mockInstruction,
        recommendations: mockRecommendations,
      });
    });

    it('should handle recommendations being undefined', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => ({ plan: [], message: 'Success' }),
        } as Response);

        await apiClient.sendPageData(mockDomData, mockScreenshot, mockInstruction, undefined);
        expect(mockFetch).toHaveBeenCalledOnce();
        const body = JSON.parse(mockFetch.calls[0][1]?.body as string);
        expect(body.recommendations).toBeUndefined();
    });

    it('should throw an error if fetch response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error"
      } as Response);

      await expect(
        apiClient.sendPageData(mockDomData, mockScreenshot, mockInstruction)
      ).rejects.toThrow('HTTP error! status: 500, body: Internal Server Error');
    });
  });

  describe('sendReplanRequest', () => {
    it('should send replan request data to the correct endpoint with correct payload', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ plan: [], message: 'Replan Success' }),
      } as Response);

      await apiClient.sendReplanRequest(mockActionStep, mockDomData, mockScreenshot, mockInstruction, mockRecommendations);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.calls[0];
      expect(url).toBe('http://testapi.com/api/v1/replan');
      expect(options?.method).toBe('POST');

      const body = JSON.parse(options?.body as string);
      expect(body).toEqual({
        problematicStep: mockActionStep,
        domTree: mockDomData.rootNode,
        url: mockDomData.url,
        windowSize: mockDomData.windowSize,
        screenshotData: mockScreenshot,
        instruction: mockInstruction,
        recommendations: mockRecommendations,
      });
    });

     it('should handle recommendations being undefined for replan', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ plan: [], message: 'Replan Success' }),
          } as Response);

        await apiClient.sendReplanRequest(mockActionStep, mockDomData, mockScreenshot, mockInstruction, undefined);
        expect(mockFetch).toHaveBeenCalledOnce();
        const body = JSON.parse(mockFetch.calls[0][1]?.body as string);
        expect(body.recommendations).toBeUndefined();
    });


    it('should throw an error if replan fetch response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => "Bad Request"
      } as Response);

      await expect(
        apiClient.sendReplanRequest(mockActionStep, mockDomData, mockScreenshot, mockInstruction)
      ).rejects.toThrow('HTTP error! status: 400, body: Bad Request');
    });
  });
});
