import { DomData, ActionStep, SpecialControlRecommendation } from '@web-agent/shared-types';
// SpecialControlRecommendation is now also in shared-types, assuming plugin will align.

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash if present
  }

  public async sendPageData(
    domData: DomData, // Changed parameter name to domData for clarity
    screenshot: string,
    instruction: string,
    recommendations?: SpecialControlRecommendation[]
  ): Promise<any> {
    const endpoint = `${this.baseUrl}/api/v1/process-page`;
    try {
      const payload: any = {
        domTree: domData.rootNode,
        url: domData.url,
        windowSize: domData.windowSize,
        screenshotData: screenshot,
        instruction,
      };
      if (recommendations && recommendations.length > 0) {
        payload.recommendations = recommendations;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending page data:', error);
      throw error;
    }
  }

  public async sendReplanRequest(
    step: ActionStep,
    domData: DomData, // Changed parameter name to domData for clarity
    screenshot: string,
    instruction: string,
    recommendations?: SpecialControlRecommendation[]
  ): Promise<any> {
    const endpoint = `${this.baseUrl}/api/v1/replan`;
    try {
      const payload: any = {
        problematicStep: step,
        domTree: domData.rootNode,
        url: domData.url,
        windowSize: domData.windowSize,
        screenshotData: screenshot,
        instruction,
      };
      if (recommendations && recommendations.length > 0) {
        payload.recommendations = recommendations;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending replan request:', error);
      throw error;
    }
  }
}
