import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DomCapturer } from './dom-capturer';
import { DomData, DomNode, WebElementInfo } from '@web-agent/shared-types'; // Assuming shared types are used
import html2canvas from 'html2canvas';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

describe('DomCapturer', () => {
  const mockHtml2Canvas = vi.mocked(html2canvas);
  const originalWindow = { ...window }; // Store original window properties

  beforeEach(() => {
    mockHtml2Canvas.mockClear();
    // Reset window properties and midscene_element_inspector for each test
    // @ts-ignore
    delete window.midscene_element_inspector;
    window.location.href = 'http://testpage.com';
    window.innerWidth = 1920;
    window.innerHeight = 1080;
  });

  afterEach(() => {
    // Restore any global mocks or window properties if necessary
    // window = originalWindow; // This might be too broad or complex if other tests rely on window changes
  });

  describe('captureDom', () => {
    it('should return null and warn if inspector script is missing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const capturer = new DomCapturer();
      const result = capturer.captureDom(); // captureDom is synchronous

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('MidScene Element Inspector script not found')
      );
      consoleWarnSpy.mockRestore();
    });

    it('should call webExtractNodeTree and return DomData if inspector is present', () => {
      const mockRootNode: DomNode = {
        element: {
          id: 'root',
          attributes: {},
          content: '',
          rect: { left: 0, top: 0, width: 10, height: 10 },
          nodeType: 'DIV',
          htmlTagName: 'div',
        },
        children: [],
      };
      const mockInspector = {
        webExtractNodeTree: vi.fn().mockReturnValue(mockRootNode),
        webExtractNodeTreeAsString: vi.fn().mockReturnValue('<mock>dom</mock>'),
      };
      // @ts-ignore
      window.midscene_element_inspector = mockInspector;

      const capturer = new DomCapturer();
      const result = capturer.captureDom();

      expect(mockInspector.webExtractNodeTree).toHaveBeenCalledWith(document.body, false);
      expect(result).toEqual({
        rootNode: mockRootNode,
        url: 'http://testpage.com',
        windowSize: { width: 1920, height: 1080 },
        // treeString: '<mock>dom</mock>', // This is currently commented out in dom-capturer.ts
      });
    });

    it('should return null if webExtractNodeTree is missing from inspector', () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // @ts-ignore
        window.midscene_element_inspector = {
            // webExtractNodeTree is missing
            webExtractNodeTreeAsString: vi.fn().mockReturnValue('<mock>dom</mock>'),
        };
        const capturer = new DomCapturer();
        const result = capturer.captureDom();
        expect(result).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('window.midscene_element_inspector.webExtractNodeTree is not available.')
        );
        consoleWarnSpy.mockRestore();
    });

  });

  describe('captureScreenshot', () => {
    it('should call html2canvas and return data URL', async () => {
      const mockCanvas = { toDataURL: vi.fn().mockReturnValue('data:image/png;base64,fakedata') };
      mockHtml2Canvas.mockResolvedValue(mockCanvas as any);

      const capturer = new DomCapturer();
      const dataUrl = await capturer.captureScreenshot();

      expect(mockHtml2Canvas).toHaveBeenCalledWith(document.body);
      expect(mockCanvas.toDataURL).toHaveBeenCalled();
      expect(dataUrl).toBe('data:image/png;base64,fakedata');
    });

    it('should return a placeholder on html2canvas error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockHtml2Canvas.mockRejectedValue(new Error('html2canvas failed'));

      const capturer = new DomCapturer();
      const dataUrl = await capturer.captureScreenshot();

      expect(dataUrl).toBe('screenshot_error_placeholder');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error capturing screenshot with html2canvas:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
