import { DomCapturer } from './dom-capturer';
import { ApiClient } from './api-client';
import { PlanExecutor } from './plan-executor';
import {
  ActionPlan,
  ActionType,
  DomData,
  DomNode, // Now using the canonical DomNode from shared-types
  SpecialControlRecommendation, // This also comes from shared-types now
  // WebElementInfo, // If needed directly
} from '@web-agent/shared-types';
import {
  identifySpecialControls,
  // DomElementNode as SpecialControlDomNode, // Plugin will be updated to use shared DomNode
} from '@web-agent/special-controls-plugin';


// Export classes for library usage
export { DomCapturer, ApiClient, PlanExecutor };
export * from '@web-agent/shared-types'; // Re-export shared types

// Example usage function (not exported by default)
async function main() {
  console.log('Web Agent Frontend Demo');

  // Instantiate components
  const domCapturer = new DomCapturer();
  const apiClient = new ApiClient('http://localhost:3001'); // Corrected to common backend port
  const planExecutor = new PlanExecutor();

  // 1. Capture DOM and Screenshot
  // domCapturer.captureDom() now returns DomData with the canonical DomNode structure.
  const domData: DomData | null = domCapturer.captureDom();
  const screenshotData: string = await domCapturer.captureScreenshot();

  if (!domData || !domData.rootNode) {
    console.error('Failed to capture DOM or DOM rootNode is missing. Exiting demo.');
    return;
  }

  console.log('Captured DomData (shared type):', domData);
  console.log('Captured Screenshot Data:', screenshotData);

  // User Instruction (example)
  const userInstruction = "Please select March 15, 2024 on the date picker and book the flight.";
  console.log("User instruction:", userInstruction);

  // 1.5 Identify Special Controls
  // The plugin now expects the canonical DomNode directly.
  let recommendations: SpecialControlRecommendation[] = [];
  if (domData.rootNode) {
    try {
      // No adaptation needed if domData.rootNode is already the correct shared DomNode type
      // and identifySpecialControls expects that.
      console.log("Running special controls plugin with shared DomNode...");
      recommendations = identifySpecialControls(domData.rootNode, userInstruction);
      console.log('Generated Special Control Recommendations:', recommendations);
    } catch (pluginError) {
      console.error("Error running special controls plugin:", pluginError);
    }
  }


  // 2. Send data to backend
  try {
    // apiClient.sendPageData now expects domData (which contains rootNode and url), screenshot, instruction, and recommendations
    const initialResponse = await apiClient.sendPageData(domData, screenshotData, userInstruction, recommendations);
    console.log('API response for page data:', initialResponse);

    // 3. Simulate receiving an action plan and executing it
    // This is a placeholder plan. In a real scenario, this would come from the backend.
    // 3. Simulate receiving an action plan and executing it
    // This is a placeholder plan. In a real scenario, this would come from the backend
    // or be constructed from initialResponse. The backend now returns a plan.
    const examplePlan: ActionPlan | null = initialResponse?.plan || null;

    if (!examplePlan) {
      console.error("No plan received from backend.");
      return;
    }

    console.log('Received plan from backend:', examplePlan);
    const executionResult = await planExecutor.executePlan(examplePlan); // PlanExecutor still uses local ActionPlan type
    console.log('Plan execution result:', executionResult);

    // The replan logic
    if (!executionResult.success && executionResult.error && examplePlan.steps.length > 0) {
      console.warn(`Plan execution failed: ${executionResult.error}. Simulating a replan request.`);

      const firstInteractiveStep = examplePlan.steps.find(s => s.type !== ActionType.WAIT && s.type !== ActionType.NAVIGATE);

      if (firstInteractiveStep) {
        const currentDom = domCapturer.captureDom(); // Recapture DOM
        const currentScreenshot = await domCapturer.captureScreenshot(); // Recapture screenshot

        if (currentDom && currentDom.rootNode) {
          // For replan, we might or might not re-run special controls.
          // For simplicity here, we'll pass the recommendations obtained earlier, or an empty array.
          // A more advanced scenario might re-run or update recommendations.
          const replanRecommendations = recommendations; // Or re-calculate if needed

          const replanResponse = await apiClient.sendReplanRequest(
            firstInteractiveStep,
            currentDom,       // This is Frontend's DomData
            currentScreenshot,
            userInstruction,  // Pass original instruction for replan context
            replanRecommendations
          );
          console.log('API response for replan request:', replanResponse);
          if (replanResponse?.plan) {
            console.log("Executing new plan from replan response...");
            await planExecutor.executePlan(replanResponse.plan);
          }
        } else {
          console.error("Failed to capture DOM for replan.");
        }
      } else {
         console.log("No interactive step found to simulate replan for.");
      }
    }

  } catch (error) {
    console.error('Error in main demo flow:', error);
  }
}

// Self-executing anonymous async function for demonstration
(async () => {
  // Ensure this runs only in a browser-like environment, not during Node.js build
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // A small delay to allow the page to fully load in a test environment
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await main();
    } catch (e) {
      console.error("Error running main demo:", e)
    }
  } else {
    console.log("Skipping main() execution as not in browser environment.")
  }
})();
