import { DomData, DomNode, WebElementInfo } from '@web-agent/shared-types';
import html2canvas from 'html2canvas';

// Minimal interface for the inspector, aligning with shared DomNode
interface MidSceneElementInspector {
  // webExtractNodeTree is expected to return the shared DomNode structure
  webExtractNodeTree: (initNode?: Node, debugMode?: boolean) => DomNode;
  webExtractNodeTreeAsString: (initNode?: Node, visibleOnly?: boolean, debugMode?: boolean) => string;
  // Add other methods if they are planned to be used soon
}

declare global {
  interface Window {
    midscene_element_inspector?: MidSceneElementInspector;
  }
}

export class DomCapturer {
  private ensureInspectorScript(): boolean {
    // In a real build, the content of 'packages/shared/dist/script/htmlElement.js'
    // would be injected and executed here.
    if (!window.midscene_element_inspector) {
      console.warn(
        "MidScene Element Inspector script not found. DOM extraction will not work. Ensure 'htmlElement.js' from packages/shared is bundled and executed."
      );
      return false;
    }
    return true;
  }

  public captureDom(): DomData | null {
    if (!this.ensureInspectorScript()) {
      console.error(
        'DOM capture failed because MidScene Element Inspector is not available.'
      );
      return null;
    }

    if (window.midscene_element_inspector?.webExtractNodeTree) {
      try {
        const capturedRootNode: DomNode = window.midscene_element_inspector.webExtractNodeTree(document.body, false);

        // Construct the DomData object using the new shared types
        const domData: DomData = {
          rootNode: capturedRootNode,
          url: window.location.href,
          // TODO: Get actual windowSize from browser
          windowSize: { width: window.innerWidth || 1920, height: window.innerHeight || 1080 },
          // treeString: window.midscene_element_inspector.webExtractNodeTreeAsString?.(document.body, true, false) // Optional
        };
        // console.log('Captured DOM Data (shared type):', domData);
        return domData;
      } catch (error) {
        console.error('Error capturing DOM:', error);
        return null;
      }
    } else {
      console.warn(
        'window.midscene_element_inspector.webExtractNodeTree is not available.'
      );
      return null;
    }
  }

  public async captureScreenshot(): Promise<string> {
    console.log('captureScreenshot called, using html2canvas.');
    try {
      const canvas = await html2canvas(document.body);
      return canvas.toDataURL();
    } catch (error) {
      console.error('Error capturing screenshot with html2canvas:', error);
      // Return a placeholder or re-throw, depending on desired error handling
      return 'screenshot_error_placeholder';
    }
  }
}
