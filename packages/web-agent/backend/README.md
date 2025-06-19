# Web Agent - Backend

## Overview

This package implements the backend server for the Web Agent system. It's a Node.js application built with Express, responsible for receiving page data from the frontend agent, orchestrating AI-driven action planning, and returning plans for execution in the browser.

## Features

*   **API Endpoints**: Provides HTTP endpoints for frontend communication.
*   **AI Planning Integration**: Leverages `@midscene/core` to generate action plans based on user instructions and captured page context.
*   **Special Control Consideration**: Incorporates hints from the `@web-agent/special-controls-plugin` (sent by the frontend) into the AI planning context to improve interaction with complex UI elements.
*   **State Processing**: Handles DOM tree structures, screenshot data, and other metadata sent from the frontend.

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### `POST /process-page`
*   **Purpose**: Receives initial page data and a user instruction to generate an action plan.
*   **Request Payload**:
    ```json
    {
      "instruction": "string (user's goal)",
      "domTree": "DomNode (serialized DOM structure from @web-agent/shared-types)",
      "screenshotData": "string (base64 encoded image data)",
      "url": "string (URL of the page)",
      "windowSize": { "width": "number", "height": "number" },
      "recommendations": "SpecialControlRecommendation[] (optional, from @web-agent/shared-types)"
    }
    ```
*   **Response**:
    ```json
    {
      "message": "string",
      "plan": "ActionPlan (from @web-agent/shared-types)"
    }
    ```

### `POST /replan`
*   **Purpose**: Called when a previous plan failed or needs adjustment. Receives current page state and information about the problematic step to generate a new plan.
*   **Request Payload**:
    ```json
    {
      "instruction": "string (original user's goal)",
      "problematicStep": "ActionStep (the step that caused issues, from @web-agent/shared-types)",
      "domTree": "DomNode",
      "screenshotData": "string",
      "url": "string",
      "windowSize": { "width": "number", "height": "number" },
      "recommendations": "SpecialControlRecommendation[] (optional)"
    }
    ```
*   **Response**:
    ```json
    {
      "message": "string",
      "plan": "ActionPlan"
    }
    ```

## Configuration

The backend requires API keys and configuration for AI services, primarily managed through environment variables. Create a `.env` file in the `packages/web-agent/backend/` directory by copying from `.env.example`.

Key environment variables:
*   `OPENAI_API_KEY`: Your OpenAI API key.
*   `MIDSCENE_MODEL_NAME`: The specific OpenAI model to be used for planning (e.g., "gpt-4o", "gpt-4-turbo").
*   `PORT`: (Optional) The port on which the server will run (defaults to 3001).

## Running the Server

1.  Ensure you have Node.js and npm/yarn installed.
2.  Install dependencies: `npm install` (or `yarn install`) from the root of the monorepo, or within this package.
3.  Set up your `.env` file as described above.
4.  **Development Mode (with auto-reloading)**:
    ```bash
    npm run dev
    ```
5.  **Production Mode**:
    ```bash
    npm run build
    npm start
    ```
The server will typically start on `http://localhost:3001`.
