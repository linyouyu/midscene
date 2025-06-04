# AI Model Integration Analysis

This document details how the system integrates with AI models, focusing on model types, prompt generation, communication with AI services, and prompt engineering techniques. The primary logic resides in `packages/core/src/ai-model/` (including `prompt/` and `service-caller/` subdirectories) and `packages/mcp/src/prompts.ts`.

## 1. AI Models Used

The system is designed to be flexible with the AI models it can use:

*   **Explicitly Named Default**: `gpt-4o` is mentioned as a default model in `service-caller/index.ts`.
*   **Configurable Models**: The actual model used is determined by environment variables:
    *   `MIDSCENE_MODEL_NAME`: Specifies the primary model name.
    *   `vlLocateMode`: This crucial environment variable implies the use of various Vision Language Models (VLMs) and determines how visual information is processed. Mentions and specific handling logic exist for:
        *   **Qwen-VL** (`MIDSCENE_USE_QWEN_VL`)
        *   **Gemini** (implied by `vlMode === 'gemini'` in `prompt/common.ts` and `ai-model/common.ts`)
        *   **Doubao-Vision** (implied by `vlMode === 'doubao-vision'` in `service-caller/index.ts` and `ai-model/common.ts`)
        *   **UI-TARS** (`MIDSCENE_USE_VLM_UI_TARS`, `vlLocateMode() === 'vlm-ui-tars'`). This seems to be a distinct model or family of models with its own prompting and parsing flow (`ui-tars-planning.ts`, `@ui-tars/action-parser`).
*   **SDK Abstraction**: The system can interface with:
    *   **OpenAI-compatible APIs**: Via the `openai` npm package. This includes Azure OpenAI services (`MIDSCENE_USE_AZURE_OPENAI`, `AZURE_OPENAI_ENDPOINT`, etc.).
    *   **Anthropic models**: Via the `@anthropic-ai/sdk` package (`MIDSCENE_USE_ANTHROPIC_SDK`, `ANTHROPIC_API_KEY`).

Generic interfaces are defined by the types of messages exchanged (`ChatCompletionMessageParam` from OpenAI) and the expected structure of responses for different tasks (e.g., `PlanningAIResponse`, `AIElementLocatorResponse`).

## 2. Prompt Generation

Prompt engineering is a critical aspect, primarily managed within `packages/core/src/ai-model/prompt/`.

### 2.1. Core Utility: `describeUserPage`

Located in `prompt/util.ts`, `describeUserPage` is fundamental. It takes the UI context (screenshot, element tree, size) and generates a textual representation of the page. This description can include:
*   Page dimensions.
*   A DOM-like tree structure of elements (`descriptionOfTree`), detailing element types, attributes, content, and bounding boxes.
*   This serialized page information forms a core part of many prompts.

### 2.2. Task-Specific Prompts

Different files within `prompt/` cater to specific AI tasks:
*   **`llm-planning.ts`**: For generating multi-step action plans.
    *   `systemPromptToTaskPlanning`: Defines the LLM's role, objectives, supported actions (Tap, Input, Scroll, etc.), and the JSON output schema (`planSchema`). It has variants for VLM (`systemTemplateOfVLPlanning`) vs. non-VLM (`systemTemplateOfLLM`) modes.
    *   `generateTaskBackgroundContext` and `automationUserPrompt`: Format the user's instruction, previous action logs, and the page description into the user message.
*   **`llm-locator.ts`**: For identifying specific UI elements.
    *   `systemPromptToLocateElement`: Instructs the LLM on how to identify elements based on a description, screenshot, and serialized element data. VLM versions expect bounding box (`bbox`) output, while non-VLM versions expect element IDs from the provided list.
    *   `findElementPrompt`: Structures the user's request.
    *   `locatorSchema`: Defines the JSON output for element location.
*   **`llm-section-locator.ts`**: For identifying larger regions on the page.
    *   `systemPromptToLocateSection` and `sectionLocatorInstruction`: Guide the VLM to identify a main bounding box for a described section and related reference boxes.
*   **`assertion.ts`**: For boolean assertions about the UI state.
    *   `systemPromptToAssert`: Asks the LLM to verify a statement against the screenshot.
    *   `assertSchema`: Defines the JSON output (`{ pass: boolean, thought: string }`).
*   **`extraction.ts`**: For extracting structured data from the UI.
    *   `systemPromptToExtract`: Guides the LLM to extract data according to a user-defined schema (`DATA_DEMAND`).
    *   `extractDataQueryPrompt`: Formats the page description and data query.
    *   `extractDataSchema`: Defines the JSON output for extracted data.
*   **`describe.ts`**: For generating a natural language description of a specific element (marked by a red rectangle).
    *   `elementDescriberInstruction`: Asks the LLM to describe the element, its visual cues, text, and relative position.
*   **`ui-tars-planning.ts` and `ui-tars-locator.ts`**: Contain specialized prompts for the UI-TARS models, which have a different action syntax and output format (text-based, parsed by `@ui-tars/action-parser`).

### 2.3. External Context from `packages/mcp/src/prompts.ts`

This file loads content from `API.mdx` (likely API documentation) and `playwright-example.txt`. This text is exported as `PROMPTS.MIDSCENE_API_DOCS` and `PROMPTS.PLAYWRIGHT_CODE_EXAMPLE` and is likely injected into relevant prompts (e.g., via `actionContext` in `llm-planning.ts`) to provide the LLM with specific domain knowledge or coding examples.

## 3. Communication with AI Model Services

The `packages/core/src/ai-model/service-caller/index.ts` module handles the direct communication:

*   **Client Creation (`createChatClient`)**: Dynamically instantiates an OpenAI or Anthropic client based on environment variables. It configures API keys, base URLs, Azure deployment details, and proxy settings.
*   **Core API Call Function (`call`)**:
    *   Sends the prepared messages (system and user prompts, including image data for VLMs) to the selected AI model.
    *   Handles differences in request/response formats between OpenAI and Anthropic SDKs (e.g., image content representation).
    *   Sets common parameters like `temperature` and `max_tokens`.
    *   Includes specific parameters for certain models (e.g., `vl_high_resolution_images` for Qwen-VL).
*   **JSON-Focused Calls (`callToGetJSONObject`)**:
    *   A wrapper around `call` that specifically requests JSON output from the AI model by setting `response_format: { type: "json_object" }` or by providing a specific JSON schema (like `planSchema`, `locatorSchema`) for supported models (e.g., GPT-4).
*   **Robust JSON Parsing**:
    *   `extractJSONFromCodeBlock`: Extracts JSON content from markdown code blocks (e.g., \`\`\`json ... \`\`\`).
    *   `safeParseJson`: Attempts to parse the (potentially dirty) JSON string using `JSON.parse()` and falls back to `dJSON.parse()` for robustness.
    *   `preprocessDoubaoBboxJson`: Contains specific preprocessing logic for bounding box data from Doubao vision models.
*   **Error Handling and Debugging**: Includes error handling for API calls and extensive debug logging capabilities. LangSmith integration is also supported (`MIDSCENE_LANGSMITH_DEBUG`).

The higher-level functions in `ai-model/inspect.ts` and `ai-model/llm-planning.ts` use `callAiFn` (which in turn uses `callToGetJSONObject`) to interact with the models.

## 4. Prompt Engineering & Optimization Techniques

Several techniques are employed to enhance the quality and reliability of AI model responses:

*   **Role Playing**: Assigning a specific persona to the LLM (e.g., "You are a versatile professional in software UI automation").
*   **Detailed Instructions & Constraints**: Providing clear objectives, workflows, supported actions, and things to avoid.
*   **Few-Shot Examples / In-Context Learning**: Including examples of input-output pairs directly within the prompt (e.g., in `llm-planning.ts` and `llm-locator.ts`).
*   **JSON Output Enforcement**:
    *   Explicitly requesting JSON output.
    *   Providing JSON schemas to the model (for OpenAI's JSON mode).
    *   Using robust client-side parsing for resilience.
*   **Chain of Thought (CoT) Encouragement**: Some prompts include fields like `"thought": string` or `"what_the_user_wants_to_do_next_by_instruction": string` to implicitly encourage the model to outline its reasoning process.
*   **Rich Contextual Information**:
    *   **Visual Context**: Screenshots are provided, often with markup (`markupImageForLLM`) for non-VLM models, or cropped to specific sections (`AiLocateSection`) for focused analysis.
    *   **Textual UI Representation**: `describeUserPage` provides a detailed textual description of the UI elements.
    *   **Historical Context**: `previous_logs` inform the model about actions already taken.
    *   **Domain Knowledge**: `API.mdx` and Playwright examples from `packages/mcp/src/prompts.ts`.
*   **VLM-Specific Adaptations**:
    *   Prompts are tailored for VLMs to directly output bounding boxes.
    *   Extensive logic (`adaptBbox`, `fillBboxParam`) exists to normalize bounding box data from various VLMs (Qwen, Gemini, Doubao, UI-TARS) due to differing coordinate systems or output formats.
*   **Structured Input Formatting**: Using XML-like tags (e.g., `<instruction>`, `<PageDescription>`) to clearly delineate different parts of the input for the LLM.
*   **Language Control**: Using `getPreferredLanguage()` to request responses in a user-specified language where appropriate.
*   **Iterative Refinement (Implied by `AiLocateSection`)**: The process of first locating a general section and then a specific element within that section is a form of iterative refinement, making the element identification task easier for the AI.
*   **Specialized Parsers**: For models like UI-TARS that have a more structured textual output, a dedicated parser (`@ui-tars/action-parser`) is used instead of relying solely on JSON.
*   **Image Resizing**: `resizeImageForUiTars` and warnings like `warnGPT4oSizeLimit` indicate awareness of model-specific input constraints for images.

This multi-faceted approach to AI integration allows the system to leverage the strengths of different models and prompting strategies for various UI automation tasks.
