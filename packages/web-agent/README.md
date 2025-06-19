# Web Agent Architecture

## Overview

The Web Agent system provides a decoupled architecture for advanced browser automation. It separates frontend components (designed for in-browser injection and execution) from a backend service. The frontend captures detailed page information (DOM structure, screenshots, metadata). This data is sent to the backend, which utilizes AI planning (via `@midscene/core`) to generate robust action plans. The system also incorporates a plugin model, exemplified by the "Special Controls Plugin," to enhance interaction with complex or non-standard UI elements by providing targeted recommendations.

## Components

### `@web-agent/frontend`
*   **Role**: Acts as the in-browser agent. It's responsible for capturing comprehensive data about the current web page, sending this data to the backend for processing, and executing the action plans received from the backend.
*   **Key Modules**:
    *   `DomCapturer`: Captures the live DOM tree (using `window.midscene_element_inspector`) and screenshots (using `html2canvas`).
    *   `ApiClient`: Manages communication with the `@web-agent/backend` via HTTP requests.
    *   `PlanExecutor`: Receives an action plan and (currently simulates) executes the steps on the page.

### `@web-agent/backend`
*   **Role**: A Node.js Express server that acts as the "brain" for the web agent. It receives page data from the frontend, processes it, and leverages the `@midscene/core` AI planning capabilities to generate detailed action plans.
*   **Key Endpoints**:
    *   `POST /api/v1/process-page`: Receives initial page data (DOM tree, screenshot, URL, window size, user instruction, and special control recommendations) and returns an action plan.
    *   `POST /api/v1/replan`: Receives current page state along with a problematic step from a previous plan and user instruction, then returns a revised action plan.

### `@web-agent/plugins/special-controls`
*   **Role**: A plugin designed to run in the frontend environment. It analyzes the DOM and user instruction to identify "special" UI controls (e.g., date pickers, sliders, complex dropdowns) that might require non-trivial interaction sequences. It then provides structured recommendations for interacting with these controls.
*   **Output**: An array of `SpecialControlRecommendation` objects, which are sent to the backend to inform the AI planning process.

### `@web-agent/shared-types`
*   **Role**: Provides a centralized repository of common TypeScript data structures, interfaces, and enums (e.g., `DomNode`, `DomData`, `ActionPlan`, `SpecialControlRecommendation`) used across all `@web-agent/*` packages. This ensures type safety and consistency throughout the ecosystem.

## Data Flow

1.  **Capture (Frontend)**: The `@web-agent/frontend`'s `DomCapturer` captures the current page's DOM, screenshot, URL, and window size.
2.  **Special Control Analysis (Frontend)**: The `special-controls-plugin` (within the frontend) analyzes the captured DOM and user instruction to generate interaction recommendations for any identified special UI elements.
3.  **Send to Backend (Frontend)**: The `ApiClient` sends the captured data, user instruction, and any special control recommendations to the `@web-agent/backend`'s `/api/v1/process-page` endpoint.
4.  **AI Planning (Backend)**: The backend uses the received information, including the special control hints (formatted into the `actionContext`), to generate an `ActionPlan` via `@midscene/core`.
5.  **Return Plan (Backend)**: The generated `ActionPlan` is sent back to the frontend.
6.  **Execution (Frontend)**: The `PlanExecutor` in the frontend receives the plan and (currently simulates) executes its steps.
7.  **Replanning (If Needed)**: If a step fails or an unexpected state is encountered, the frontend can send the current state, the problematic step, the original instruction, and current special control recommendations to the `/api/v1/replan` endpoint for a new plan.

## Setup & Usage

Detailed setup and usage instructions for each component can be found in their respective README files:
*   [Frontend README](./frontend/README.md)
*   [Backend README](./backend/README.md)
*   [Special Controls Plugin README](./plugins/special-controls/README.md)
*   [Shared Types README](./shared-types/README.md)

Typically, the backend server would be started first. The frontend components would then be bundled and injected into a target browser environment (e.g., via a browser extension or a Puppeteer script) to interact with web pages.
