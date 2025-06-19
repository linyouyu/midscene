# Web Agent - Frontend

## Overview

This package contains the frontend components of the Web Agent system. It's designed to be injected into a browser environment to capture web page information, communicate with the backend for AI-driven task planning, and execute the generated action plans.

## Key Features

*   **DOM and Screenshot Capture**: Utilizes the `DomCapturer` module to capture detailed DOM structure, element attributes, and visual screenshots of the current page.
*   **Backend Communication**: Employs the `ApiClient` to send page data and instructions to the `@web-agent/backend` and receive action plans.
*   **Plan Execution**: Includes a `PlanExecutor` (currently simulating execution) responsible for carrying out the steps defined in an action plan.
*   **Special Control Analysis**: Integrates with the `@web-agent/special-controls-plugin` to identify complex UI elements and generate interaction hints.

## Setup

Details on bundling this package and injecting it into a browser environment (e.g., as part of a browser extension or automation script) are TBD. It requires `window.midscene_element_inspector` to be available for DOM capture.

## Core Modules

### `DomCapturer`
*   **Functionality**: Captures the state of the current web page.
*   **DOM Capture**: Relies on `window.midscene_element_inspector.webExtractNodeTree()` (expected to be injected separately, e.g., from `@midscene/shared`) to get a structured representation of the DOM.
*   **Screenshot Capture**: Uses the `html2canvas` library to take a screenshot of `document.body`.
*   **Output**: Produces a `DomData` object (from `@web-agent/shared-types`) containing the `rootNode` (DOM tree), current `url`, and `windowSize`.

### `ApiClient`
*   **Functionality**: Manages all HTTP communication with the `@web-agent/backend`.
*   **Key Methods**:
    *   `sendPageData(domData: DomData, screenshotData: string, instruction: string, recommendations?: SpecialControlRecommendation[]): Promise<ActionPlan>`: Sends the captured page state, user instruction, and any special control recommendations to the backend's `/api/v1/process-page` endpoint to get an initial action plan.
    *   `sendReplanRequest(problematicStep: ActionStep, domData: DomData, screenshotData: string, instruction: string, recommendations?: SpecialControlRecommendation[]): Promise<ActionPlan>`: Sends data to the `/api/v1/replan` endpoint when a previous plan encountered issues, requesting a new plan.

### `PlanExecutor`
*   **Functionality**: Responsible for executing the steps of an `ActionPlan` received from the backend.
*   **Current Status**: The current implementation simulates the execution of actions (e.g., CLICK, INPUT, SCROLL) by logging them to the console. Future work will involve actual DOM interactions.

## Usage Example (Conceptual)

The following shows how the frontend components might be orchestrated:

```typescript
// Assume DomCapturer, ApiClient, PlanExecutor, identifySpecialControls are initialized/available.
// And userInstruction is provided.

async function runWebAgentTask(userInstruction: string) {
  const domCapturer = new DomCapturer();
  const apiClient = new ApiClient('http://localhost:3001'); // Backend URL
  const planExecutor = new PlanExecutor();

  // 1. Capture page state
  const domData = domCapturer.captureDom();
  const screenshotData = await domCapturer.captureScreenshot();

  if (!domData) {
    console.error("Failed to capture DOM data.");
    return;
  }

  // 2. Identify special controls (if plugin is used)
  let recommendations = [];
  if (domData.rootNode) {
    // identifySpecialControls would be imported from '@web-agent/special-controls-plugin'
    // This example assumes identifySpecialControls is available in the same scope or imported.
    // import { identifySpecialControls } from '@web-agent/special-controls-plugin';
    recommendations = identifySpecialControls(domData.rootNode, userInstruction);
  }

  // 3. Send data to backend for planning
  try {
    const initialResponse = await apiClient.sendPageData(domData, screenshotData, userInstruction, recommendations);
    const actionPlan = initialResponse.plan; // Assuming backend returns { plan: ActionPlan }
    console.log("Received plan:", actionPlan);

    // 4. Execute the plan
    const executionResult = await planExecutor.executePlan(actionPlan);
    console.log("Plan execution result:", executionResult);

    if (!executionResult.success && actionPlan.steps.length > 0) {
      // Handle replanning if needed
      // const updatedDomData = domCapturer.captureDom(); // Recapture
      // const updatedScreenshotData = await domCapturer.captureScreenshot();
      // if (updatedDomData) {
      //   const replanResponse = await apiClient.sendReplanRequest(
      //     actionPlan.steps[0], // Example: failed step
      //     updatedDomData,
      //     updatedScreenshotData,
      //     userInstruction,
      //     recommendations // Potentially re-run plugin or send original
      //   );
      //   const newPlan = replanResponse.plan;
      //   // ... execute newPlan
      // }
    }
  } catch (error) {
    console.error("Error during web agent operation:", error);
  }
}

// Example invocation:
// runWebAgentTask("Book a flight to Paris for next Tuesday.");
```
This example illustrates the general flow of capturing data, getting a plan, and executing it.
