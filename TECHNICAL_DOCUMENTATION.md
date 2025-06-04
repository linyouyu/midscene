# Midscene Technical Documentation

## 1. Introduction/Overview

Midscene is an innovative AI-driven automation framework designed to radically simplify how users and developers interact with and automate web and mobile applications. In an era where digital interfaces are ubiquitous and increasingly complex, Midscene addresses the inherent brittleness and high maintenance cost of traditional automation scripts. It achieves this by leveraging the power of artificial intelligence, particularly advanced Vision Language Models (VLMs) and Large Language Models (LLMs), to interpret user intent and understand UI structures dynamically.

The core premise of Midscene is to enable automation through natural language instructions. Instead of writing explicit, selector-dependent code for every interaction (e.g., "find element with ID 'foo' and click it"), users can specify their goals in human language (e.g., "log in with username 'test' and password 'pass', then navigate to the dashboard and check for new messages"). Midscene's AI engine then takes over, perceiving the application's UI, planning a sequence of actions, and executing them using the appropriate browser or device controls. This approach aims to make automation scripts more robust against minor UI changes, as the AI can often adapt to variations that would break traditional scripts.

Beyond natural language, Midscene also supports automation via structured YAML scripts for more deterministic and repeatable workflows, and provides comprehensive JavaScript/TypeScript SDKs for deep integration into developer environments and complex scripting scenarios. This multi-modal approach caters to a wide spectrum of users, from no-code business users and QA testers to experienced automation engineers and developers.

**Key Features and Capabilities:**

*   **Natural Language Automation**: Users can describe their objectives and operational steps in plain language. Midscene's AI then plans and operates the user interface to achieve these goals. This significantly lowers the barrier to creating automations.
*   **Cross-Platform Support**:
    *   **Web Automation**: Offers flexibility by integrating with existing browser instances via its Chrome Extension and "Bridge Mode," or by programmatically controlling browsers using popular libraries like Puppeteer and Playwright.
    *   **Android Automation**: Enables control over local Android devices and emulators through an ADB-based JavaScript SDK, allowing for automation of native mobile applications.
*   **Versatile Tooling for Development and Debugging**:
    *   **Visual Reports**: Generates detailed HTML reports after each automation run. These reports include screenshots for each step, the actions taken, AI reasoning (if applicable), and timing information, which are invaluable for debugging and understanding the automation flow.
    *   **Interactive Playgrounds**: The Chrome Extension and a dedicated Android Playground application provide immediate, interactive environments for testing Midscene's capabilities and for step-by-step debugging of automation logic.
    *   **Caching Mechanism**: Improves efficiency, especially during script development and iterative testing, by caching the results of AI operations (like element location or planning). This allows for faster replay of scripts when the underlying UI or instructions haven't changed significantly.
    *   **Midscene Copilot Package (MCP)**: A component suggesting advanced agent-like functionalities or integrations, potentially allowing other systems or AI agents to leverage Midscene's core automation power as a specialized tool.
*   **Flexible API Styles**:
    *   **Interaction APIs**: High-level commands such as `agent.aiTap("login button")` or `agent.aiInput("search term", "search bar")` that are driven by natural language descriptions of elements and actions.
    *   **Data Extraction APIs**: Functions like `agent.aiQuery("get the list of products")`, `agent.aiString("extract the order total")`, `agent.aiNumber(...)`, `agent.aiBoolean(...)` to extract structured or specific information from UIs using natural language queries.
    *   **Utility APIs**: Helper functions including `agent.aiAssert("the login was successful")` for making assertions about UI state, `agent.aiLocate("find the help icon")` to identify specific elements without interacting, and `agent.aiWaitFor("wait until the loading spinner disappears")` to pause execution until a certain UI condition is met.
*   **Broad AI Model Compatibility**: Supports a range of AI models, allowing users to choose based on capability, cost, and access:
    *   Multimodal LLMs like OpenAI's GPT-4o, which can process both text and images.
    *   Specialized Vision Language Models (VLMs) such as Qwen-VL, Doubao Vision, Google's Gemini series, and the open-source UI-TARS models. VLMs are particularly recommended for their strong UI understanding capabilities.
    *   The system is designed with configurable model endpoints and API keys, primarily managed through environment variables or the Chrome Extension's settings.
*   **Adaptable Automation Styles**:
    *   **Auto Planning (`agent.aiAction(instruction)`)**: The AI takes full control of decomposing high-level natural language instructions (e.g., "book a flight from London to New York for next Tuesday") into a sequence of executable steps. While powerful, its success can be highly dependent on the sophistication of the chosen AI model and the complexity of the task.
    *   **Workflow Style**: Users can define more granular steps and control logic in JavaScript/TypeScript (using the SDK) or in YAML scripts. In this style, Midscene's APIs are used for individual interactions or insights (e.g., `agent.aiTap()`, `agent.aiQuery()`), giving the developer greater control over the automation flow and error handling, which often leads to more stable and reliable automations for complex processes.

Midscene aims to democratize UI automation by making it more accessible through natural language, while also providing the tools and flexibility needed by professional developers to build robust and maintainable automation solutions. This document provides a comprehensive technical overview of its architecture, core components, AI integration, command execution strategies, and various operational modes.

## 2. Project Architecture

Midscene is architected as a modular monorepo, managed using pnpm workspaces for handling inter-package dependencies and Nx for orchestrating build processes, testing, and other development tasks. This structure is chosen for its benefits in managing a complex project with multiple interrelated applications and libraries:
*   **Code Reusability**: Common functionalities (e.g., DOM extraction, image processing, AI prompting utilities) are encapsulated in shared packages and reused across different parts of the system, reducing duplication and promoting consistency.
*   **Simplified Dependency Management**: pnpm workspaces efficiently manage dependencies across local packages.
*   **Streamlined Development Workflow**: Nx provides tools for managing tasks like building, testing, and linting across the entire monorepo or for specific projects, improving developer productivity.
*   **Atomic Changes**: Enables making changes across multiple packages/apps in a single commit/PR, ensuring consistency when features span different parts of the system.

### 2.1. Monorepo Structure

The repository is broadly divided into two main directories, reflecting a clear separation of concerns between end-user applications and core/shared libraries:

*   **`apps/`**: This directory contains applications that provide user-facing interfaces or serve specific roles in the Midscene ecosystem. These are typically the deployable units of the project.
    *   `chrome-extension`: The Midscene Chrome Extension. It acts as a primary interface for users to interact with Midscene directly within their browser (via the "Playground") and is the client-side component for the "Bridge Mode," enabling SDK-driven automation of existing browser sessions.
    *   `android-playground`: A web application designed for demonstrating and interacting with Midscene's Android automation capabilities. It likely integrates with `packages/android` and may use technologies like `scrcpy` (via `yadb` or similar) for screen mirroring and remote control.
    *   `report`: An application dedicated to displaying the visual HTML reports generated after automation script executions. These reports are crucial for debugging by showing screenshots, actions taken, and AI reasoning for each step.
    *   `site`: The official documentation website (midscenejs.com), built using Rspress.
*   **`packages/`**: This directory houses the collection of libraries that provide the core functionalities, shared utilities, and specific integrations of Midscene. These packages are typically published independently (e.g., to npm) and can be consumed by the applications in `apps/` or by third-party developers building on Midscene.
    *   Key libraries include `core`, `shared`, `web-integration`, `android`, `cli`, `evaluation`, `mcp` (Midscene Copilot Package), and `visualizer`.

The root of the monorepo contains configuration files like `nx.json` (defining Nx task dependencies and defaults), `pnpm-workspace.yaml` (defining the pnpm workspace), `biome.json` (for code formatting and linting), and various build/test configurations.

### 2.2. Key Components Overview and Interactions

The major components within `packages/` and `apps/` collaborate to deliver Midscene's comprehensive automation capabilities. The interaction flow often starts from a user interface (CLI, Chrome Extension) or SDK usage, which then leverages integration packages (`web-integration`, `android`) that, in turn, utilize the `core` package for AI-driven logic and perception, all while depending on `shared` for common utilities.

*   **`packages/core` (Core Logic Engine)**: This is the conceptual heart of Midscene.
    *   **Responsibilities**: It's responsible for the AI-driven decision-making processes. This includes advanced prompt engineering for various tasks (planning, element location, data extraction, assertion), communication with different AI model services (OpenAI, Anthropic, Azure OpenAI, and other VLM providers via `service-caller`), adaptation of VLM outputs (like bounding box normalization), and the high-level orchestration of UI understanding using the `Insight` class. It also defines the schema for Midscene's YAML automation language and a rich set of TypeScript types for data structures used throughout the system.
    *   **Interactions**: It consumes fundamental utilities from `packages/shared` (e.g., for DOM element representation, image processing primitives). It provides the AI and automation primitives that are then leveraged by higher-level packages like `packages/web-integration`, `packages/android`, and `packages/cli` to perform platform-specific actions. For example, when `packages/web-integration`'s `PageAgent` needs to understand a page, it provides a `UIContext` to `packages/core`'s `Insight` class, which then uses its AI capabilities to return actionable information.
*   **`packages/shared` (Shared Utilities)**: This package is the foundational toolkit providing common functionalities essential for all other parts of Midscene.
    *   **Responsibilities**: Its most critical sub-component is the **DOM Element Extractor (`extractor/`)**, which includes the client-side JavaScript (`htmlElement.js`, also known as `midscene_element_inspector`) that is injected into web browsers to parse the live DOM, identify elements, and extract their properties (geometry, attributes, text). Other key responsibilities include image processing utilities (`img/` using `jimp`), a namespaced logging system (`logger.ts`) with file output capabilities, centralized environment variable management (`env.ts`), standardized output directory management (`common.ts` for `midscene_run`), and fundamental data types (`types/`) like `Rect` and `BaseElement`.
    *   **Interactions**: `packages/shared` is imported by almost all other `packages/` and `apps/`. For instance, `packages/web-integration` uses the extractor script from `shared` to understand page structures across different browser drivers (Playwright, Puppeteer, CDP). `packages/core` uses `shared`'s image utilities for preparing VLM inputs and its type definitions for UI elements.
*   **`packages/web-integration` (Web Automation Layer)**: This package manages all direct interactions with web browsers.
    *   **Responsibilities**: It implements the `AbstractPage` interface, providing concrete strategies for different web automation modes:
        *   **Playwright & Puppeteer Drivers**: Contains adapter classes that allow Midscene to control browsers using these popular Node.js automation libraries. These adapters use the respective driver's `page.evaluate()` method to inject and run the DOM extractor from `packages/shared`.
        *   **Chrome Extension Logic (`chrome-extension/`)**: Includes `ChromeExtensionProxyPage`, which uses the Chrome Debugger Protocol (CDP) for fine-grained browser control from within the extension's environment.
        *   **Bridge Mode (`bridge-mode/`)**: Implements both the server-side (`BridgeServer`, typically run by the SDK/CLI) and the client-side (`ExtensionBridgePageBrowserSide`, run in the Chrome extension) of a WebSocket (Socket.IO) bridge. This bridge allows the Node.js SDK to remotely control a browser instance through the Chrome extension.
    *   **Interactions**: It consumes `packages/core` (via the `PageAgent` class which orchestrates AI tasks) for AI-driven decision making. It relies on `packages/shared` for the DOM extraction script. It provides the actual browser control capabilities to the `packages/cli` for YAML script execution and to developers using the Midscene SDK. A typical flow: `PageAgent` (in `web-integration`) gets a task, captures page context using its `AbstractPage` implementation, sends this context to `Insight` (in `core`), receives an AI-generated plan, and then uses `AbstractPage` methods to execute the plan.
*   **`packages/android` (Android Automation Layer)**:
    *   **Responsibilities**: Provides the tools and abstractions for automating Android devices and emulators, likely using Android Debug Bridge (ADB) for command execution and possibly `scrcpy` (via `yadb` or similar libraries mentioned in credits) for screen data capture and UI interaction.
    *   **Interactions**: Similar to web integration, it consumes `packages/core` for AI-driven automation logic adapted for Android UI elements. It's used by `packages/cli` when executing YAML scripts targeting Android and is the backend for the `apps/android-playground`.
*   **`packages/cli` (Command Line Interface)**: This is the main entry point for users running YAML-based automations.
    *   **Responsibilities**: Parses command-line arguments (e.g., script path, `--headed` mode). Loads environment configurations (from `.env` files). Discovers and parses YAML automation scripts. Dynamically sets up the appropriate execution environment (launching Puppeteer, initiating Bridge Mode via `AgentOverChromeBridge`, or connecting to an Android device via `agentFromAdbDevice`). It then uses a `ScriptPlayer` (from `packages/web-integration/src/yaml/`) to execute the tasks defined in the YAML flow. Provides terminal-based feedback.
    *   **Interactions**: It's a primary consumer of `packages/core` (for YAML schema and indirectly AI logic), `packages/web-integration` (for web agent creation and YAML execution via `ScriptPlayer`), and `packages/android` (for Android agent creation).
*   **`apps/chrome-extension` (User Interface & Bridge Client)**:
    *   **Responsibilities**: Provides an accessible graphical interface for users. The "Playground" allows direct, interactive automation of the current tab. It manages user-specific configurations (API keys, model choices) via its Zustand store (`store.tsx`), persisting them in `localStorage`. Crucially, it hosts the client-side component (`ExtensionBridgePageBrowserSide`) for "Bridge Mode," enabling the SDK/CLI to control the browser.
    *   **Interactions**: Uses `packages/web-integration`'s `ChromeExtensionProxyPage` (for CDP interaction) and `ExtensionBridgePageBrowserSide` (for bridge client logic). It may consume components from `packages/visualizer` for its UI. When in Playground mode, it uses an instance of `PageAgent` (from `packages/web-integration`) which in turn uses `packages/core`.
*   **`packages/evaluation` (AI Evaluation Suite)**:
    *   **Responsibilities**: Contains a collection of test cases, datasets (HTML pages, UI scenarios), and evaluation scripts. This suite is used to systematically assess and benchmark the performance of different AI models on various UI automation tasks, such as element location accuracy, planning effectiveness, and assertion correctness.
    *   **Interactions**: It programmatically uses `packages/core`, `packages/web-integration`, and `packages/shared` to run its evaluation scenarios against different AI models and configurations, generating data that helps in model selection and improvement.
*   **`packages/mcp` (Midscene Copilot Package)**:
    *   **Responsibilities**: This package appears to offer higher-level abstractions or tools, potentially for creating more complex, agentic automation behaviors. The presence of `prompts.ts` (which loads API documentation and Playwright code examples) suggests it plays a role in providing rich, structured context to AI models, perhaps for tasks involving code generation or complex API interactions.
    *   **Interactions**: Likely builds upon the capabilities of `packages/core` and the various integration packages (`web-integration`, `android`) to perform its tasks.
*   **`packages/visualizer` (UI Components Library)**:
    *   **Responsibilities**: Provides a set of reusable React components and associated logic for rendering Midscene-specific UIs. This could include components for displaying automation reports, visualizing element trees or bounding boxes, creating configuration interfaces, or parts of the Playground UIs.
    *   **Interactions**: Consumed by the various `apps/` like `apps/report` (for displaying reports), `apps/chrome-extension`, and potentially `apps/android-playground` to build their user interfaces.

The overall architecture is designed for modularity, allowing different parts of the system (e.g., AI core, web interaction, Android interaction, CLI) to be developed and maintained semi-independently while ensuring strong integration through well-defined package APIs and shared utilities. This separation of concerns, facilitated by the monorepo structure, is key to managing the complexity of an AI-driven, multi-platform automation framework.

## 3. Workflows

The Midscene project leverages GitHub Actions for its CI/CD pipeline and various automated repository management tasks. These workflows, defined in YAML files under `.github/workflows/`, are essential for maintaining code quality, ensuring stability across different components, automating the release process, and managing community interactions.

### 3.1. CI/CD Pipeline

The Continuous Integration and Continuous Deployment (CI/CD) pipeline forms the backbone of the development process, ensuring that code changes are automatically built, tested, and prepared for release. This is primarily managed by `ci.yml` and `release.yml`.

#### `ci.yml` (Continuous Integration)

*   **Trigger**: This workflow is automatically executed on every `push` event to the `main` branch and for every `pull_request` that targets the `main` branch. This ensures that all proposed changes and merges are validated.
*   **Purpose**: The primary goal of `ci.yml` is to safeguard the integrity of the codebase. It achieves this by automatically building all packages and applications within the monorepo and running a comprehensive suite of tests to catch regressions or integration issues early.
*   **Key Steps**:
    1.  **Environment Setup**: It begins by setting up a specific Node.js execution environment (e.g., version 18.19.0) and installing the pnpm package manager (e.g., version 9.3.0), which is used for dependency management in the monorepo.
    2.  **Dependency Caching**: To optimize build times, particularly for frequently used large dependencies, it caches Puppeteer browser binaries.
    3.  **Dependency Installation**: All project dependencies are installed using `pnpm install --frozen-lockfile --ignore-scripts`. The `--frozen-lockfile` flag ensures that the exact dependency versions specified in `pnpm-lock.yaml` are used, leading to reproducible builds. The `--ignore-scripts` flag can prevent potentially unwanted post-install scripts from running.
    4.  **Browser Installation**: A Chrome browser instance, required by Puppeteer for testing, is installed. This is specifically noted for use by the `packages/web-integration` component, which handles browser interactions.
    5.  **Project Build**: The entire monorepo, including all applications and packages, is built using the `pnpm run build` command, which Nx likely orchestrates.
    6.  **Testing**: The main test suite is executed using `pnpm run test`. This command would run unit tests, integration tests, and potentially other checks defined across the various packages.
*   **Environment Variables**: The workflow is configured to use secrets such as `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `MIDSCENE_MODEL_NAME`. This indicates that parts of the automated test suite likely involve making live calls to AI models, requiring valid API credentials to ensure that AI-dependent functionalities are working correctly.

#### `release.yml` (Continuous Deployment/Release)

*   **Trigger**: Unlike the CI workflow, the release process is manually initiated by a maintainer via GitHub's `workflow_dispatch` event. This provides control over when releases occur. The trigger requires two inputs:
    *   `version`: The type of version increment for the release (e.g., `minor`, `patch`, `preminor`, `prepatch`), guiding the versioning script.
    *   `branch`: The specific branch from which the release should be created, defaulting to `main`.
*   **Purpose**: This workflow automates the complex and multi-step process of creating a new software release. This includes version bumping, tagging the release in Git, publishing packages to the npm registry, and packaging distributable artifacts like the Chrome extension.
*   **Key Steps**:
    1.  **Code Checkout**: The workflow checks out the source code from the specified `branch`.
    2.  **Protected Branch Push**: It uses a third-party GitHub Action (`zhoushaw/push-protected`), which suggests that the release process might need to push changes (like version bumps in `package.json` files or new tags) to a protected branch, requiring special permissions.
    3.  **Environment Setup**: Similar to CI, it sets up Node.js and pnpm.
    4.  **Dependency Management**: It ensures all dependencies, including Puppeteer, are installed and cached.
    5.  **Browser Installation**: A Chrome browser is installed for `packages/web-integration`, possibly for build-time tasks or verifications.
    6.  **Custom Release Script Execution**: A crucial step is running `node ./scripts/release.js --version=<version_input>`. This custom script encapsulates the core release logic:
        *   Updating version numbers in `package.json` files across the monorepo.
        *   Creating Git tags for the new version.
        *   Publishing the relevant public packages (e.g., `@midscene/core`, `@midscene/cli`) to the npm registry.
    7.  **NPM Authentication**: The workflow uses an `NPM_TOKEN` secret to authenticate with the npm registry, allowing it to publish packages.
    8.  **Artifact Generation & Upload**: After successful publication, it packages the Chrome extension from the `apps/chrome-extension/extension_output` directory and uploads it as a build artifact named `chrome_extension`. This artifact is then typically attached to the corresponding GitHub release, making it easily downloadable for users.

### 3.2. AI-related Workflows

Given Midscene's AI-centric nature, dedicated workflows exist to test and evaluate its AI components. These workflows often interact with an AI service referred to as "Doubao," using specific API tokens and base URLs configured as secrets.

#### `ai-evaluation.yml`

*   **Trigger**: Manually triggered via `workflow_dispatch`, allowing a maintainer to select a specific branch for evaluation (defaults to `main`).
*   **Purpose**: To systematically evaluate the performance of AI models on a predefined set of UI automation tasks. This helps track model improvements, regressions, and benchmark different models or prompting strategies.
*   **Key Steps**:
    1.  Standard environment setup (Node.js, pnpm) and dependency installation.
    2.  Full project build.
    3.  Execution of specialized evaluation scripts located within the `packages/evaluation` directory. These scripts target distinct AI capabilities:
        *   `pnpm run evaluate:locator`: Tests the AI's ability to accurately locate UI elements based on descriptions.
        *   `pnpm run evaluate:planning`: Assesses the AI's proficiency in generating logical and effective action plans from user instructions.
        *   `pnpm run evaluate:assertion`: Evaluates the AI's correctness in verifying UI states against given assertions.
    4.  The detailed logs and raw AI responses from these evaluations are archived from `packages/evaluation/tests/__ai_responses__/` and uploaded as a build artifact named `evaluation-logs`. This data is crucial for offline analysis of model behavior.
*   **Environment Variables**: This workflow is specifically configured to use Doubao AI services, with secrets like `DOUBAO_TOKEN`, `DOUBAO_BASE_URL`, and explicitly setting `MIDSCENE_MODEL_NAME` to a Doubao model (e.g., 'doubao-1-5-thinking-vision-pro-250428') and `MIDSCENE_USE_DOUBAO_VISION: 1`.

#### `ai-unit-test.yml`

*   **Trigger**: Runs automatically on every `push` to the `main` branch, and can also be manually dispatched for a specific branch.
*   **Purpose**: To execute unit tests that are specifically designed to verify the integration and functionality of AI models within the core logic of Midscene. These tests are likely more focused than the broader E2E or evaluation suites.
*   **Key Steps**:
    1.  Environment setup, including the installation of a Puppeteer browser, as AI unit tests might involve `packages/web-integration`.
    2.  Execution of AI-specific unit tests via `pnpm run test:ai`.
    3.  Test outputs and reports are uploaded from `packages/web-integration/midscene_run/report`.
*   **Environment Variables**: Also utilizes the Doubao-related secrets, indicating these unit tests might make live calls to the AI service.

#### `ai.yml` (Playwright E2E for AI)

*   **Trigger**: Similar to `ai-unit-test.yml`, it runs on `push` to `main` or can be manually dispatched.
*   **Purpose**: To conduct comprehensive end-to-end (E2E) tests for AI-driven functionalities, using Playwright as the browser automation driver. This ensures that the AI components work correctly within a full application flow.
*   **Key Steps**:
    1.  Environment setup, including caching for Playwright and Puppeteer dependencies to speed up runs.
    2.  Installation of Playwright and its browser dependencies, as well as a Puppeteer browser.
    3.  Execution of multiple E2E test suites, potentially targeting different features or configurations: `pnpm run e2e`, `pnpm run e2e:cache`, `pnpm run e2e:report`.
    4.  Detailed reports from these E2E test runs are uploaded from `packages/web-integration/midscene_run/report` for each suite.
*   **Environment Variables**: Leverages the same Doubao AI service credentials.

### 3.3. Repository Management Workflows

To maintain a healthy and efficient development environment, Midscene employs several workflows that automate common repository management and community interaction tasks.

#### `lint.yml`

*   **Trigger**: Runs on `push` and `pull_request` events targeting the `main` branch.
*   **Purpose**: To enforce code style consistency across the codebase and catch potential syntax errors or code quality issues early in the development cycle.
*   **Key Steps**:
    1.  Standard environment setup.
    2.  `pnpm run check-dependency-version`: A custom script to verify that dependency versions are consistent across all packages in the monorepo, preventing potential version conflicts.
    3.  `npx biome check . --diagnostic-level=warn --no-errors-on-unmatched`: Executes Biome, a modern formatter and linter, to analyze the codebase for style violations and potential issues.
*   **Environment Variables**: This workflow uses `MIDSCENE_OPENAI_INIT_CONFIG_JSON` and `MIDSCENE_OPENAI_MODEL` secrets. This is unusual for a linting workflow and might imply that some custom linting rules or pre-commit checks could be related to AI configuration string formats or similar, although this is speculative without deeper inspection of the linting setup itself.

#### `issue-labeled.yml`

*   **Trigger**: Activates whenever a label is added to a GitHub issue.
*   **Purpose**: To automate standardized responses to issue labeling, particularly for issues that require more information from the reporter.
*   **Key Steps**: Specifically, if an issue within the `web-infra-dev/midscene` repository is assigned the label `need reproduction`, a GitHub Action (`actions-cool/issues-helper`) automatically posts a comment. This comment typically requests the user to provide a minimal, reproducible example of their reported problem, linking to guidelines on why reproductions are necessary.

#### `issue-close-require.yml`

*   **Trigger**: This is a scheduled workflow, running daily at midnight UTC (`cron: '0 0 * * *'`).
*   **Purpose**: To automatically close stale issues that have been marked as `need reproduction` but have not received the requested information from the reporter after a certain period. This helps keep the issue tracker clean and focused on actionable items.
*   **Key Steps**: If an issue in the `web-infra-dev/midscene` repository has the `need reproduction` label and has remained inactive (no new comments) for 5 days, the `actions-cool/issues-helper` action automatically closes the issue with an explanatory comment.

#### `pr-label.yml`

*   **Trigger**: Activates when a new pull request is opened or when the title or body of an existing pull request is edited.
*   **Purpose**: To automatically apply labels to pull requests based on their content (e.g., keywords in the title or body). This aids in categorizing PRs, routing them to appropriate reviewers, and streamlining the review process.
*   **Key Steps**: Uses the `github/issue-labeler` action, which reads its configuration from `.github/pr-labeler.yml`. This configuration file defines patterns and corresponding labels to be applied.

### 3.4. Overall Data Flow and Control Flow in Workflows

The GitHub Actions workflows in Midscene create a cohesive automated system that supports the entire development lifecycle, from initial code commit to release and ongoing maintenance. This automation is crucial for a complex project with multiple packages and a reliance on external AI services.

The **development and integration pipeline** begins when developers push code or create pull requests. These actions immediately trigger `ci.yml`, which performs essential build and test routines, and `lint.yml`, which enforces code quality and style. For changes specifically affecting AI functionalities, particularly those merged into `main`, the `ai-unit-test.yml` and `ai.yml` (Playwright E2E tests) workflows provide an additional layer of validation, ensuring that the core AI-driven functionalities remain robust. This integrated approach ensures that code merged into `main` is well-tested and adheres to project standards.

**Release management** is a controlled, manual process initiated through `release.yml`. A maintainer triggers this workflow, providing versioning information. The workflow then automates the intricate steps of checking out the designated branch, running a custom release script (`scripts/release.js`) that likely manages version increments in `package.json` files across the monorepo, creating Git tags, and publishing the updated public packages to the npm registry. A significant outcome of this process is the packaging of the `chrome-extension` from its build output (`apps/chrome-extension/extension_output`), which is then uploaded as a GitHub release artifact, ready for distribution.

**AI model performance and reliability** are continuously monitored through the `ai-evaluation.yml` workflow. This allows maintainers to run targeted evaluations of AI models (currently emphasizing "Doubao" models as per current configuration) against a suite of benchmark tasks defined in `packages/evaluation`. The detailed logs and raw AI responses are archived, facilitating in-depth analysis of model behavior, regression tracking, and comparative assessment of different AI solutions or prompting strategies.

The CI/CD setup also reveals **inter-component dependencies and build requirements**. For instance, `packages/web-integration` is frequently involved in various testing scenarios, requiring the setup of browser environments (Puppeteer, Playwright) within the CI jobs. The `apps/chrome-extension` is clearly a key deliverable, as evidenced by its specific packaging step in the release workflow. `packages/evaluation` is the source of test cases and scripts for the AI evaluation workflow. The AI-centric workflows also underscore the project's reliance on external AI services, with API keys and model configurations managed securely via GitHub secrets.

Finally, **repository hygiene and community interaction** are streamlined by automated workflows. `issue-labeled.yml` and `issue-close-require.yml` automate responses and the lifecycle management for issues, particularly for issues needing reproductions from users. `pr-label.yml` aids in PR categorization. These automations free up maintainer time and ensure consistent handling of community contributions and bug reports.

Collectively, this suite of GitHub Actions workflows forms a robust automation infrastructure that supports Midscene's development by ensuring code quality, streamlining the release process, enabling rigorous testing of its critical AI components, and efficiently managing repository activities and community contributions.

## 4. AI Model Integration

The system's ability to understand and interact with web pages is powered by its sophisticated integration with various AI models. This section details the models used, how prompts are generated, communication with AI services, and key prompt engineering techniques. The primary logic resides in `packages/core/src/ai-model/` (including `prompt/` and `service-caller/` subdirectories) and `packages/mcp/src/prompts.ts`.

### 4.1. Models Used

Midscene is designed for flexibility, allowing users to choose from a variety of AI models based on their specific needs, access, and the nature of the automation task. This adaptability is crucial as the AI landscape rapidly evolves.

*   **Explicitly Named Default**: `gpt-4o` is specified as a default model within `service-caller/index.ts`. This suggests it's a well-tested, general-purpose option, known for its strong multimodal capabilities, making it suitable for a wide range of tasks involving both text understanding and image analysis.
*   **Configurable Models**: The choice of AI model is primarily determined by environment variables:
    *   `MIDSCENE_MODEL_NAME`: This variable allows users to specify the primary model name for tasks that are predominantly language-based or involve complex reasoning, such as high-level planning or understanding nuanced user instructions.
    *   `vlLocateMode`: This critical environment variable signals the use of Vision Language Models (VLMs) and dictates how visual information from screenshots is processed for tasks like element location. Midscene includes specific handling logic for several VLMs:
        *   **Qwen-VL**: Activated by setting `MIDSCENE_USE_QWEN_VL`. Qwen-VL models are known for their strong visual understanding capabilities, particularly effective with UIs that might include mixed languages or complex layouts.
        *   **Gemini**: Inferred when `vlMode` is set to `'gemini'`. Google's Gemini family of models also offers powerful multimodal features suitable for UI interpretation.
        *   **Doubao-Vision**: Inferred when `vlMode` is set to `'doubao-vision'`. This likely refers to a model from ByteDance, potentially optimized for certain types of UI understanding tasks or specific visual styles.
        *   **UI-TARS**: Activated by `MIDSCENE_USE_VLM_UI_TARS` or when `vlLocateMode()` returns `'vlm-ui-tars'`. UI-TARS appears to be a distinct model (or family of models, including versions 1.0, 1.5, and specific Doubao variants like 1.5-15B/20B) with its own specialized prompting strategies, a unique textual output format requiring parsing by `@ui-tars/action-parser`, and specific considerations for image input, such as resizing to particular dimensions. The choice of UI-TARS might be preferred for scenarios demanding very precise, structured output for simpler actions.
    *   The selection between a general multimodal model (like GPT-4o) and a specialized VLM often depends on the specific task. VLMs might excel at precise element identification directly from pixels and understanding spatial relationships in UIs with minimal textual context. Advanced LLMs, even with multimodal capabilities, might be preferred for complex multi-step planning, understanding nuanced or ambiguous natural language instructions, or generating code/text as part of an automation sequence.
*   **SDK Abstraction for Service Providers**: To further enhance flexibility and allow users to leverage models from different providers, Midscene abstracts the direct interaction with AI model services:
    *   **OpenAI-compatible APIs**: The system uses the `openai` npm package to communicate with OpenAI's models (like GPT-3.5, GPT-4, GPT-4o) and any other third-party or self-hosted model that adheres to the OpenAI API interface. This also includes robust support for Azure OpenAI services, which can be configured with variables like `MIDSCENE_USE_AZURE_OPENAI`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_API_VERSION`, and `AZURE_OPENAI_DEPLOYMENT`. This allows enterprises using Azure to integrate Midscene within their existing cloud infrastructure.
    *   **Anthropic models**: Integration with Anthropic's models (e.g., the Claude series), known for their strong language understanding and generation capabilities, is available via the `@anthropic-ai/sdk` package, configured using environment variables `MIDSCENE_USE_ANTHROPIC_SDK` and `ANTHROPIC_API_KEY`.

The use of generic interfaces, largely based on OpenAI's `ChatCompletionMessageParam` type for structuring prompts and custom TypeScript interfaces for expected task-specific responses (e.g., `PlanningAIResponse`, `AIElementLocatorResponse`), allows for a degree of interchangeability. This design simplifies the potential addition of new AI models or service providers in the future, as only the client creation and specific parameter mapping in `service-caller` would need significant changes.

### 4.2. Prompt Generation

Effective prompt engineering is paramount to harnessing the capabilities of AI models for UI automation. Midscene dedicates a significant portion of its core logic, primarily within `packages/core/src/ai-model/prompt/`, to crafting detailed and contextually rich prompts designed to elicit accurate and actionable responses from the AI. The goal is to translate user intent and UI state into a language the AI can effectively process.

#### 4.2.1. Core Utility: `describeUserPage`

A foundational element of prompt generation, especially for models that benefit from a textual understanding of the UI structure, is the `describeUserPage` function, located in `packages/core/src/ai-model/prompt/util.ts`.
*   **Input**: It takes the current `UIContext` object, which encapsulates the state of a web page at a specific moment. This context includes the latest screenshot (as a base64 string), the element tree (previously extracted by the `midscene_element_inspector` script from `packages/shared/src/extractor`), and overall page dimensions.
*   **Output**: It generates a detailed textual representation of the page. A key part of this is a serialized, DOM-like tree structure of elements, produced by the `descriptionOfTree` function (from `packages/shared/src/extractor/tree.ts`). This tree string details element types (e.g., `<button>`, `<input>`), unique IDs assigned by Midscene (e.g., `id="a1b2c"`), important HTML attributes (class, name, etc.), visible textual content, and bounding box coordinates.
    *   For example, a button might be represented in the prompt as: `<button id="btn-login1" markerId="5" class="btn primary" left="100" top="200" width="80" height="30">Login</button>`. The `markerId` corresponds to visual labels that can be drawn on screenshots for human debugging or for models that can cross-reference.
*   **Purpose**: This textual representation of the UI is then embedded into the prompts sent to the AI. It provides essential context for tasks like element location (especially for non-VLM models or when VLMs need help disambiguating based on text or attributes), understanding element relationships, and action planning. For VLMs, while the image is primary, this textual context can still be valuable for grounding visual understanding with specific attributes or text content.

#### 4.2.2. Task-Specific Prompts

Midscene employs different prompt strategies tailored to specific AI tasks. These are defined in various files within `packages/core/src/ai-model/prompt/`, each containing system prompts, user prompt construction logic, and often JSON schemas for the expected output. The system prompts set the AI's role, capabilities, and constraints, while user prompts provide the specific task and page context.

*   **Planning (`llm-planning.ts`)**: Used for generating multi-step action plans from user instructions.
    *   `systemPromptToTaskPlanning`: Constructs the system prompt that sets the AI's persona (e.g., "versatile professional in software UI automation"), its objectives (decompose instructions, locate elements, formulate actions), the list of supported actions (Tap, Input, Scroll, KeyboardPress, etc.) along with their expected parameters, and the required JSON output schema (defined by `planSchema`). For example, an action might be described as: `Input: { type: "Input", locate: { id: string, prompt: string }, param: { value: string } }`.
    *   This function often has distinct templates for VLMs (`systemTemplateOfVLPlanning`), which might be instructed to work more directly with visual information and output bounding boxes for located elements, versus non-VLM LLMs (`systemTemplateOfLLM`), which would rely more heavily on the textual page description from `describeUserPage` and element IDs.
    *   A conceptual snippet for a non-VLM planning system prompt might look like: "Given the page description: `[serialized page tree from describeUserPage]` and the user instruction: `[user's goal]`, generate a JSON array of actions. Supported actions are: `TAP(elementId)`, `INPUT(elementId, text)`..."
*   **Element Location (`llm-locator.ts`)**: For identifying specific UI elements based on a natural language description.
    *   `systemPromptToLocateElement`: This system prompt instructs the AI on how to identify elements. VLM versions are typically asked to return a bounding box (`bbox`) for the identified element. Non-VLM versions are expected to return the unique `id` of the element from the list provided in the textual page description. Prompts often include examples of the expected JSON output (e.g., `{"elements": [{"id": "...", "reason": "..."}], "errors": []}`) to guide the model.
*   **Section Location (`llm-section-locator.ts`)**: Primarily used with VLMs to identify larger, semantically meaningful regions on a page (e.g., "the product details section," "the main navigation bar"). This is a form of "deep think" or focused attention.
    *   `systemPromptToLocateSection` and `sectionLocatorInstruction`: Guide the VLM to output a primary bounding box for the described section and, optionally, bounding boxes for related reference elements that help define the section's context. Identifying a section first can help narrow down the search area for subsequent, more granular element location tasks, improving accuracy and efficiency, especially on visually dense pages.
*   **Assertion (`assertion.ts`)**: For performing boolean assertions about the UI state (e.g., "Is the login button visible and enabled?").
    *   `systemPromptToAssert`: Instructs the AI to verify a given statement against the current screenshot and page context, and to respond with a boolean `pass` status and a `thought` explaining its reasoning (e.g., `{"pass": true, "thought": "The login button is visible and enabled."}`).
*   **Data Extraction (`extraction.ts`)**: For extracting structured information or specific text from the UI based on a query.
    *   `systemPromptToExtract`: Guides the LLM to extract data according to a user-defined schema (provided in the `DATA_DEMAND` part of the prompt, e.g., `{"productName": "string", "price": "number"}`) or a natural language query (e.g., "extract all product names and their prices"). It emphasizes adhering to specified data types.
*   **Element Description (`describe.ts`)**: For generating a human-readable natural language description of a specific UI element, usually one that has been pre-identified by coordinates or a visual marker.
    *   `elementDescriberInstruction`: Prompts the LLM to describe the element's key characteristics: its content, visual appearance (if an image or icon), relative position to other nearby elements, and any other distinguishing features. This can be useful for generating test assertions, logging, or for re-prompting if an initial location attempt was ambiguous.
*   **UI-TARS Specific Prompts (`ui-tars-planning.ts`, `ui-tars-locator.ts`)**: These files provide specialized prompt templates for the UI-TARS models. These prompts differ significantly in their defined action space (e.g., `click(start_box='[x1, y1, x2, y2]')` where coordinates might be normalized differently) and expect a more structured textual output that is then parsed by the `@ui-tars/action-parser` library, rather than direct JSON. This highlights Midscene's adaptability to models with varying output modalities.

#### 4.2.3. External Context Injection (`packages/mcp/src/prompts.ts`)

To enhance the AI's understanding and capabilities, especially for tasks that might involve generating code (like Playwright test snippets) or interacting with specific APIs, Midscene can inject external contextual information into prompts.
*   The `packages/mcp/src/prompts.ts` file demonstrates this by loading content from:
    *   `API.mdx`: This likely contains API documentation for Midscene itself or for web services that the automation scripts might need to interact with.
    *   `playwright-example.txt`: This provides examples of Playwright code, which can be invaluable if the AI is tasked with generating or assisting in writing Playwright test scripts.
*   This textual content is exported (e.g., as `PROMPTS.MIDSCENE_API_DOCS` and `PROMPTS.PLAYWRIGHT_CODE_EXAMPLE`) and can be dynamically inserted into the main prompts, for instance, via the `actionContext` parameter in planning tasks (as seen in `packages/core/src/ai-model/llm-planning.ts`). This equips the LLM with relevant domain-specific knowledge or coding patterns, improving the quality and relevance of its generated plans or code snippets.

By combining detailed UI context from `describeUserPage` with task-specific instructions, examples, and optional external knowledge, Midscene aims to create highly effective prompts that guide AI models to perform complex UI automation tasks accurately.

### 4.3. Communication with AI Services

The `packages/core/src/ai-model/service-caller/index.ts` module is the centralized component responsible for all direct communication with the various AI model services that Midscene supports. It acts as an abstraction layer, simplifying interactions for the rest of the core system and handling the nuances of different AI provider APIs.

*   **Client Creation (`createChatClient`)**: This function serves as a factory for AI service clients.
    *   It dynamically instantiates either an OpenAI client (using the `openai` npm package) or an Anthropic client (using `@anthropic-ai/sdk`). The choice is determined by environment variable configurations such as `MIDSCENE_USE_AZURE_OPENAI` (for Azure OpenAI), `MIDSCENE_USE_ANTHROPIC_SDK`, or defaults to standard OpenAI if an `OPENAI_API_KEY` is present. This allows users to easily switch between providers.
    *   It meticulously configures the chosen client with necessary credentials (API keys), service endpoints (base URLs for self-hosted models or specialized API gateways), Azure-specific deployment details (endpoint, API version, deployment name, retrieved from variables like `AZURE_OPENAI_ENDPOINT`), and proxy settings if required (`MIDSCENE_OPENAI_HTTP_PROXY`, `MIDSCENE_OPENAI_SOCKS_PROXY`). This comprehensive configuration ensures connectivity in various network environments.
*   **Core API Call Function (`call`)**: This is the primary private async function within the module that handles the actual dispatching of requests to the selected AI model.
    *   It takes the prepared messages array (which includes a system prompt setting the context and a user prompt containing the specific task and page information, where the user prompt can contain complex structures like arrays of text and base64 encoded image data for VLMs).
    *   It transparently manages differences in request/response formats and SDK specifics between OpenAI and Anthropic services. For example, it correctly formats image content for Anthropic's message API if Anthropic is the active provider, ensuring that the image data is compatible with the target model's input requirements.
    *   It sets common LLM parameters like `temperature` (typically 0.1 for most tasks to encourage factual and deterministic responses, but can be 0.0 for precision tasks like those with UI-TARS to reduce randomness) and `max_tokens` (defaulting to 2048, but configurable via the `OPENAI_MAX_TOKENS` environment variable to control response length and cost).
    *   It can also include model-specific parameters where necessary, such as `vl_high_resolution_images: true` for the Qwen-VL model to enable its higher-resolution image processing mode, potentially improving accuracy on detailed UIs.
*   **JSON-Focused Calls (`callToGetJSONObject`)**: This exported async function is a specialized wrapper around `call`. It is the preferred method for most interactions within Midscene because it's designed for tasks where a JSON object is the expected output format from the AI, which is common for structured data like action plans or located element properties.
    *   It attempts to enable "JSON mode" in compatible AI models (like newer GPT versions such as GPT-4 Turbo and GPT-4o) by setting the `response_format: { type: "json_object" }` parameter in the API call. This instructs the model to constrain its output to valid JSON, significantly improving the reliability of parsing the response.
    *   For certain actions and specific models (particularly older versions of GPT-4 that support structured output via function-calling-like mechanisms, or when a very specific schema is desired), it can provide specific JSON schemas (such as `planSchema` for planning tasks or `locatorSchema` for element location, which are imported from the `prompt/` directory). This further guides the AI in generating a structurally correct JSON output that matches the expected schema defined by Midscene.
*   **Robust JSON Parsing**: Recognizing that AI-generated JSON can sometimes contain minor syntax errors (e.g., trailing commas, incorrect quoting) or be embedded within other text (like explanations or markdown), the module incorporates robust parsing strategies:
    *   `extractJSONFromCodeBlock`: This utility preprocesses the AI's raw textual response. It first tries to extract JSON content if the AI has wrapped it in markdown code blocks (e.g., \`\`\`json ... \`\`\`) or if the entire response appears to be a plain JSON string.
    *   `safeParseJson`: This function takes the (potentially cleaned) string from `extractJSONFromCodeBlock` and attempts to parse it using the standard `JSON.parse()`. If this strict parsing fails due to minor syntax issues, it falls back to using `dJSON.parse()` (from the `dirty-json` library). `dJSON` is more tolerant of common AI-generated JSON errors, increasing the chances of successfully parsing a slightly imperfect response.
    *   `preprocessDoubaoBboxJson`: A model-specific preprocessing step is included to clean up and reformat bounding box coordinate strings that might be returned by Doubao vision models before attempting to parse them as JSON. This handles known output quirks of particular models, making integration more seamless.
*   **Error Handling and Debugging**: The `service-caller` module includes try-catch blocks for API communication failures (e.g., network errors, authentication issues, rate limits) and logs detailed error information if debugging is enabled (using the `@midscene/shared/logger` system). Furthermore, integration with LangSmith for advanced tracing and debugging of LLM calls is supported, which can be activated by setting the `MIDSCENE_LANGSMITH_DEBUG` environment variable. This allows developers to inspect the full chain of LLM interactions for troubleshooting.

The higher-level functions within the `ai-model/` directory, such as those in `inspect.ts` (for locating elements, asserting UI states) and `llm-planning.ts` (for generating action plans), typically use `callAiFn` (an exported wrapper around `callToGetJSONObject`) to interact with the configured AI models. This ensures that all AI communication is centralized through this robust and adaptable layer, abstracting away the complexities of dealing with multiple AI providers and their specific APIs for the rest of the application.

### 4.4. Prompt Engineering & Optimization Techniques

Midscene employs a sophisticated array of prompt engineering and optimization techniques to maximize the quality, reliability, and relevance of AI model responses. These strategies are critical for translating ambiguous natural language or complex UI states into actionable AI outputs.

*   **Role Playing**: Assigning a specific persona to the LLM (e.g., "You are a versatile professional in software UI automation," "You are an expert in software page image... analysis") helps to prime the model's responses, aligning them with the expected domain expertise and task requirements. This leads to more focused and contextually appropriate outputs.
*   **Detailed Instructions & Constraints**: Prompts include clear objectives, step-by-step workflows where applicable, explicit definitions of supported actions or output formats, and constraints on what the AI should or should not do. This reduces ambiguity and guides the model towards desired outcomes, minimizing irrelevant or incorrect responses. For example, the planning prompts meticulously list each supported action type and its parameters.
*   **Few-Shot Examples / In-Context Learning**: For complex tasks like action planning (`llm-planning.ts`) or element identification (`llm-locator.ts`), prompts often include concrete examples of input-output pairs. This technique helps the model understand the desired format, reasoning process, and level of detail by providing demonstrations, making it more likely to generalize correctly to new, unseen inputs.
*   **JSON Output Enforcement**: To ensure structured and machine-readable outputs, which are essential for programmatic use:
    *   Models are explicitly instructed to return responses in JSON format.
    *   For compatible OpenAI models, "JSON mode" is enabled by providing specific JSON schemas (e.g., `planSchema`, `locatorSchema`), which constrains the model to generate syntactically correct JSON adhering to the defined structure. This significantly improves reliability and reduces the need for complex string parsing.
    *   Robust client-side parsing (using `safeParseJson` which combines standard `JSON.parse` with the more lenient `dJSON.parse`) is employed to handle minor deviations from strict JSON syntax that models might occasionally produce.
*   **Chain of Thought (CoT) Encouragement**: Some prompts include fields like `"thought": string` in the expected JSON output or ask for an explanatory field like `"what_the_user_wants_to_do_next_by_instruction": string`. While not always explicit multi-step CoT prompting (where the model shows its work), these encourage the model to output its reasoning process or internal state. This can improve the accuracy of the final action and greatly aid in debugging unexpected behavior by making the AI's "thinking" more transparent.
*   **Rich Contextual Information**: Providing comprehensive context is key to good AI performance:
    *   **Visual Context**: Screenshots are a primary input for VLMs. For non-VLM scenarios or as supplemental data, images are programmatically marked up with element boundaries and labels (`markupImageForLLM` from `ai-model/common.ts`). Furthermore, specific sections of a page can be cropped (`AiLocateSection` in `ai-model/inspect.ts`) to provide a focused visual context for subsequent, more detailed tasks, reducing distractions for the VLM and potentially improving accuracy on dense UIs.
    *   **Textual UI Representation**: The `describeUserPage` utility (`core/src/ai-model/prompt/util.ts`) generates a detailed textual description of UI elements, their properties, and their hierarchical structure, offering a machine-readable format that complements visual data, especially for LLMs or when fine-grained detail about attributes or text content is needed.
    *   **Historical Context**: For sequential tasks, `previous_logs` (a history of actions already taken and their outcomes) are included in planning prompts to inform the model about the current state of the automation and to prevent redundant or out-of-sequence actions.
    *   **Domain Knowledge**: As discussed in section 4.2.3, external information like API documentation (`API.mdx`) or code examples (`playwright-example.txt`) from `packages/mcp/src/prompts.ts` can be injected into prompts. This provides relevant domain-specific context, enhancing the AI's ability to generate appropriate plans or code snippets, for example, when automating tasks that involve interacting with specific web APIs or generating test code in a particular format.
*   **VLM-Specific Adaptations**:
    *   Prompts are tailored for VLMs to directly interpret screenshots and output visual references, primarily bounding boxes (`bbox`) for elements.
    *   Significant post-processing logic (e.g., `adaptBbox`, `fillBboxParam`, `adaptQwenBbox`, `adaptDoubaoBbox`, `adaptGeminiBbox` in `ai-model/common.ts`) is implemented to normalize bounding box data from various VLMs. This is crucial because different VLMs may use different coordinate systems (e.g., normalized [0-1] vs. absolute pixels, [xmin, ymin, xmax, ymax] vs. [ymin, xmin, ymax, xmax]) or have slightly inconsistent output formats. This normalization ensures that downstream components receive coordinates in a standardized format, regardless of the specific VLM used.
*   **Structured Input Formatting**: Using XML-like tags (e.g., `<instruction>`, `<PageDescription>`, `<DATA_DEMAND>`) within prompts helps to clearly delineate different types of input information for the LLM. This makes it easier for the model to parse and understand the distinct roles and importance of various pieces of context, leading to better comprehension and response quality.
*   **Language Control**: The `getPreferredLanguage()` utility (from `packages/shared/src/env.ts`) allows Midscene to request AI responses in a specific language (e.g., Chinese or English). This is used in prompts for tasks like element description (`describe.ts`) or assertions for UI-TARS models, catering to internationalization needs and ensuring that AI-generated text is user-appropriate.
*   **Iterative Refinement (e.g., `AiLocateSection` followed by `AiLocateElement`)**: For complex visual search tasks, Midscene can employ a two-step process. First, `AiLocateSection` identifies a general page region relevant to the query. Then, `AiLocateElement` performs a more detailed search within this cropped and focused section. This hierarchical approach breaks down the problem into more manageable steps for the AI, often leading to more accurate and efficient element identification on visually dense or complex user interfaces. This also helps in managing token limits for VLMs by sending smaller, more relevant image crops.
*   **Specialized Parsers**: For AI models like UI-TARS that produce output in a structured textual format rather than pure JSON, a dedicated parser (`@ui-tars/action-parser`, used in `ai-model/ui-tars-planning.ts`) is employed. This parser converts the model's specific output syntax into Midscene's internal standardized action representation, allowing these models to be integrated seamlessly despite their non-JSON output.
*   **Input Constraint Awareness**: The system includes checks and handlers for model-specific input limitations. For example, `resizeImageForUiTars` in `ai-model/ui-tars-planning.ts` ensures images fit UI-TARS v1.5 input constraints, and `warnGPT4oSizeLimit` in `ai-model/common.ts` alerts users if an image might exceed GPT-4o's optimal input size, preventing potential errors or suboptimal performance.

By combining these diverse techniques, Midscene aims to create robust, context-aware, and effective prompts that maximize the utility of various AI models for complex UI automation challenges, ultimately leading to more reliable and intelligent automation.

## 5. Command Injection and Web Interaction

This section details how Midscene injects commands into web pages, the architecture of its Chrome extension, methods for targeting and interacting with web elements, and its different operational modes. Understanding these mechanisms is key to grasping how Midscene translates AI-generated plans or user commands into actual browser behavior.

### 5.1. Mechanisms for Command Injection

Midscene employs distinct strategies for command injection based on the operational mode, choosing the most appropriate technology for each context.

#### 5.1.1. Chrome Debugger Protocol (CDP)

*   **Used By**: This is the primary mechanism for the Midscene Chrome Extension when interacting directly with web pages (e.g., in its "Playground" mode) and is also the underlying technology used by the extension when operating in "Bridge Mode."
*   **Core Class**: `packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage`. This class encapsulates the logic for interacting with a browser tab using CDP commands.
*   **Mechanism**:
    1.  **Attaching Debugger**: The extension, through `ChromeExtensionProxyPage`, programmatically attaches the Chrome Debugger to a target browser tab using `chrome.debugger.attach({ tabId: ... }, "1.3")`. This grants the extension privileged access to inspect and control that tab.
    2.  **Sending Commands**: Once attached, it uses `chrome.debugger.sendCommand({ tabId: ... }, command, params)` to issue commands. Midscene leverages several CDP domains:
        *   **`Runtime.evaluate`**: This is fundamental for executing arbitrary JavaScript within the page's context. It's used to inject more extensive helper scripts (like `midscene_element_inspector`), retrieve data dynamically from the page's DOM or JavaScript environment, or execute simple page manipulations.
        *   **`Input.dispatchMouseEvent` / `Input.dispatchTouchEvent`**: These commands simulate user mouse actions like clicks, movements, scrolling (wheel events), and touch events. `dispatchTouchEvent` is particularly important for emulating interactions on mobile devices or in mobile-emulated views.
        *   **`Input.dispatchKeyEvent`**: Used to simulate keyboard presses, including individual key down/up events and sequences of characters for typing.
        *   **`Page.captureScreenshot`**: To obtain screenshots of the page, typically in JPEG format, which are then used as visual input for AI models.
*   **Injected Helper Scripts**:
    *   A key script, internally referred to as `midscene_element_inspector` (its source code is loaded via `getHtmlElementScript()` from `packages/shared`), is injected into the page using `Runtime.evaluate`. This script, once active in the page, provides an API (e.g., functions on `window.midscene_element_inspector`) that can be called from the extension's context (again, via `Runtime.evaluate`) to perform complex DOM analysis tasks without needing to transfer large amounts of raw DOM data:
        *   `webExtractNodeTree()`: Serializes the live DOM into Midscene's structured tree format (`ElementTreeNode<ElementInfo>`), capturing element types, attributes, textual content, and geometric information.
        *   `getXpathsById(id)` and `getElementInfoByXpath(xpath)`: Allow for querying element XPaths using Midscene-generated IDs or retrieving element information using a known XPath, aiding in debugging and element re-identification.
        *   `setNodeHashCacheListOnWindow()`: Suggests a mechanism for caching element representations or their unique hashes on the page's `window` object. This can optimize repeated lookups or reduce redundant data extraction during sequential operations on the same page.
    *   Visual feedback scripts (e.g., the "water flow" animation that shows a visual cue for mouse pointer movements during automated actions) are also injected and controlled via `Runtime.evaluate`, enhancing the user's ability to observe and understand the automation.
*   **Pros/Cons**: CDP offers deep, low-level control over the browser, making it powerful for detailed inspection and interaction, and it doesn't require modifying the target page's code directly. However, its API can be complex, and using it requires the extension to have debugger permissions, which users must grant. It's also specific to Chromium-based browsers.

#### 5.1.2. Browser Automation Driver APIs (Playwright/Puppeteer)

*   **Used By**: Playwright Mode and Puppeteer Mode, typically when Midscene is used as a Node.js SDK in test scripts or backend automation.
*   **Core Class**: `packages/web-integration/src/puppeteer/base-page.ts::Page`. This generic class, parameterized by agent type (Playwright/Puppeteer) and the respective driver's page type, serves as the base for mode-specific page classes (`packages/web-integration/src/playwright/page.ts::WebPage` and `packages/web-integration/src/puppeteer/page.ts::WebPage`).
*   **Mechanism**:
    1.  **Page Evaluation (`page.evaluate()`)**: Both Playwright (`page.evaluate(pageFunction, ...args)`) and Puppeteer (`page.evaluate(pageFunction, ...args)`) provide a robust method to execute a JavaScript function within the context of the web page. Midscene uses this as its primary method for injecting and running the `midscene_element_inspector` script. The script's source code is retrieved from `packages/shared/node/fs.ts` (via `getElementInfosScriptContent()` and `getExtraReturnLogic()`) and passed as a string to `page.evaluate()`. This allows the same sophisticated DOM extraction logic to be used across CDP, Playwright, and Puppeteer modes, ensuring consistency in how page structure is perceived.
    2.  **Native Driver Commands**: For direct browser interactions such as mouse clicks, keyboard input, navigation, and taking screenshots, Midscene leverages the high-level, user-friendly APIs provided by the Playwright or Puppeteer drivers themselves. These drivers internally manage the low-level communication with the browser (often using CDP or WebDriver protocols, depending on the browser and driver version). Examples of such native commands include:
        *   **Mouse**: `page.mouse.click(x, y)`, `page.mouse.move(x, y)`, `page.mouse.wheel(deltaX, deltaY)`.
        *   **Keyboard**: `page.keyboard.type(text)`, `page.keyboard.press(key)`.
        *   **Screenshots**: `page.screenshot({ type: 'jpeg', ... })`.
        *   **Navigation**: `page.goto(url)`.
        *   **Waiting**: `page.waitForNavigation()`, `page.waitForNetworkIdle()` (Puppeteer-specific, BasePage has a more generic `waitForNavigation`).
*   **Pros/Cons**: Using driver APIs simplifies many common automation tasks, as the drivers handle much of the complexity of browser interaction and offer cross-browser support (especially Playwright). This mode is ideal for integration into existing test frameworks that already use Playwright or Puppeteer. The main dependency is on these external libraries, and it typically involves launching a new browser instance controlled by the driver, rather than attaching to an existing user session (which Bridge Mode enables).

This dual approach to command injection allows Midscene to be versatile: deeply integrated with the browser via CDP when operating as an extension, and leveraging the power and convenience of established automation libraries when used as an SDK within Node.js environments.

### 5.2. Chrome Extension Architecture and Role

The Midscene Chrome extension (source code primarily in `apps/chrome-extension/src/`) is a pivotal component, offering both a direct user interface for AI-driven automation and serving as the essential browser-side counterpart for the unique "Bridge Mode." Its architecture is designed to provide a seamless user experience while enabling powerful automation capabilities.

*   **User Interface (`popup.tsx`)**: This React component defines the UI presented when a user clicks the extension's icon in the browser toolbar. It provides a centralized point of interaction and configuration.
    *   It features a tabbed interface to separate functionalities:
        *   **"Playground" Tab**: This tab offers an interactive environment where users can type natural language commands (e.g., "click the search button and type 'Midscene'") and witness Midscene attempt to execute them on the currently active web page. Under the hood, it instantiates a `ChromeExtensionProxyPageAgent` (from `packages/web-integration/src/chrome-extension/agent.ts`), which in turn wraps `ChromeExtensionProxyPage`. This setup allows the Playground to directly use the CDP mechanism (via `ChromeExtensionProxyPage`) for real-time interaction with the page. The state for user inputs, AI configurations (loaded from the `useEnvConfig` store), and results within the Playground is managed by React components. This provides an immediate feedback loop for users experimenting with AI commands.
        *   **"Bridge Mode" Tab**: This tab contains the UI (rendered by the `extension/bridge.tsx` component) for initiating, monitoring, and managing a connection to a local Midscene SDK/CLI instance. It displays connection status (e.g., "Listening," "Connected," "Disconnected") and logs relevant events, allowing the user to explicitly "Allow Connection" or "Stop" the bridge, thus maintaining control over external access to their browser.
    *   The popup also includes convenient links to the Midscene documentation and GitHub repository. A key feature is the `EnvConfig` component (likely from `packages/visualizer`), which allows users to view and modify AI service configurations (API keys, model names, base URLs, etc.) stored via the `useEnvConfig` Zustand store (see Section 7.1). This ability to configure AI providers directly within the extension is key for its standalone operation in "In-Browser" service mode, where the extension itself makes calls to AI APIs using the user's stored credentials.
*   **Bridge Client (`extension/bridge.tsx` and `packages/web-integration/src/bridge-mode/page-browser-side.ts::ExtensionBridgePageBrowserSide`)**:
    *   The `apps/chrome-extension/src/extension/bridge.tsx` React component is responsible for rendering the "Bridge Mode" UI and managing its operational lifecycle (displaying status, handling connect/disconnect actions, showing logs).
    *   It instantiates and controls `ExtensionBridgePageBrowserSide`. This class (whose source is in `packages/web-integration` but is likely bundled and imported by the extension, possibly as `@midscene/web/bridge-mode-browser`) runs within the extension's JavaScript environment (specifically, the context of the popup or a dedicated extension page if the popup is closed, to maintain the WebSocket connection).
    *   `ExtensionBridgePageBrowserSide` acts as a WebSocket (Socket.IO) client. It establishes a connection to a `BridgeServer` (see Section 5.4, Bridge Mode) running in a local Node.js process (which is the Midscene SDK or CLI).
    *   It listens for Remote Procedure Calls (RPCs) sent from the SDK over this WebSocket channel. Upon receiving a command (e.g., to get the page URL or click an element), it executes it using the capabilities inherited from its parent class, `ChromeExtensionProxyPage`, thereby leveraging the Chrome Debugger Protocol for the actual browser interaction. Results or errors from these operations are then serialized and sent back to the SDK via the WebSocket.
*   **Direct CDP Interaction Logic (`packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage`)**:
    *   As detailed in Section 5.1.1, this class is the engine for all browser interactions initiated or managed by the Chrome extension. Whether commands originate from the user in the "Playground" tab or are relayed as RPCs from the SDK in "Bridge Mode," `ChromeExtensionProxyPage` handles the low-level details of attaching the Chrome Debugger to a specific tab and dispatching the necessary CDP commands to inspect the page or simulate user input. It also manages the injection of the `midscene_element_inspector` script.

The Chrome Extension, therefore, is a sophisticated piece of the Midscene ecosystem. It's not merely a passive tool but an active agent, capable of both user-driven automation (Playground) and acting as a secure, user-authorized conduit for external SDK control over the browser (Bridge Mode). Its local state management (`store.tsx`) ensures that user configurations for AI services and operational preferences are persisted, making it a highly configurable and user-friendly entry point to Midscene's capabilities.

### 5.3. Element Targeting and Interaction

Midscene's ability to accurately target and interact with web elements is a multi-stage process that combines robust DOM analysis, intelligent AI-driven understanding, and mode-specific execution mechanisms. This process ensures that Midscene can work effectively across diverse web UIs.

1.  **Perception/Understanding (Acquiring Page Context)**: This initial stage is about "seeing" and "understanding" the current state of the web page.
    *   **Screenshot Capture**: A visual snapshot of the current page is taken.
        *   In Chrome Extension/Bridge modes, this is done using the `Page.captureScreenshot` CDP command via `ChromeExtensionProxyPage`.
        *   In Playwright/Puppeteer modes, the respective `page.screenshot()` driver method is used.
        *   This image is a crucial input, especially for Vision Language Models (VLMs), providing direct visual data.
    *   **DOM Structure Extraction**: The `midscene_element_inspector` script (from `packages/shared/src/extractor/`) is injected into the page context (via CDP `Runtime.evaluate` or driver's `page.evaluate()`). Its `webExtractNodeTree()` function is then invoked.
        *   This function traverses the live DOM and constructs a detailed, serializable tree (`ElementTreeNode<ElementInfo>`). This tree represents the hierarchical structure of relevant UI elements, capturing their tag names, key HTML attributes (like `id`, `class`, `name`, `role`, `aria-label`), visible textual content, and geometric properties (bounding boxes, center points, and visibility status).
        *   This structured textual representation of the DOM complements the visual screenshot, providing rich context for the AI, especially for disambiguating visually similar elements or understanding elements primarily defined by their text or attributes.
    *   The combined visual (screenshot) and structural (element tree) information is packaged into a `UIContext` object. This object is then passed to the AI processing layer in `packages/core`.
2.  **AI Processing (Interpreting Intent and Identifying Targets)**:
    *   The `Insight` class and various planning modules within `packages/core` receive the `UIContext` along with the user's natural language prompt (e.g., "click the 'Login' button and then enter 'testuser' into the username field").
    *   The configured AI model (LLM or VLM) processes this combined input.
    *   **Output from AI**: The AI's response varies depending on the task and model type:
        *   **For VLMs**: The output often includes direct coordinates or bounding boxes (`bbox`) of the target elements identified on the screenshot. Some VLMs might also provide a brief textual rationale.
        *   **For LLMs** (which primarily process the textual element tree and instruction): The output might be the unique Midscene-generated `id` of the target elements (which were part of the input tree description) or descriptive paths that can be resolved to elements.
        *   For planning tasks, the AI typically outputs a sequence of actions (e.g., `TAP` on element A, `INPUT` 'text' into element B), where each action refers to a target element identified by coordinates or ID.
3.  **Action Execution (Performing the Interaction)**: Once the AI has identified target(s) and/or a plan, Midscene translates this into concrete browser interactions:
    *   **Resolving Target Element Details**:
        *   If the AI provides **coordinates/bounding boxes** (common with VLMs), these are often used directly to guide mouse clicks or other interactions. These coordinates undergo normalization via `adaptBbox` functions in `packages/core/src/ai-model/common.ts` to handle variations between different VLM outputs (e.g., converting normalized coordinates to absolute pixels). The system might still attempt to map these AI-provided coordinates to known elements from the extracted tree using `elementByPositionWithElementInfo` (from `packages/core/src/ai-model/prompt/util.ts`) for more robust interaction or logging, or it might create a synthetic element representation if no existing element perfectly matches the VLM's focus point.
        *   If the AI returns an element **`id`**, this ID is used to look up the element's detailed information (including its precise coordinates, stored from the initial DOM extraction) from the element tree that was part of the `UIContext`.
    *   **Performing the Interaction**: The method of interaction depends on the operational mode:
        *   **Chrome Extension/Bridge Mode**: `ChromeExtensionProxyPage` uses specific CDP commands. For instance, a "click" action on an element at `(x,y)` coordinates translates to an `Input.dispatchMouseEvent` command. Typing text into an input field involves first focusing the element (often via a simulated click at its coordinates) and then sending a sequence of `Input.dispatchKeyEvent` commands for each character.
        *   **Playwright/Puppeteer Modes**: The `BasePage` implementation (in `packages/web-integration/src/puppeteer/`) calls the corresponding high-level methods of the underlying Playwright or Puppeteer `page` object. For example, `this.underlyingPage.mouse.click(x,y)` or `this.underlyingPage.keyboard.type(text)`. These driver methods then handle the low-level communication (often via CDP or WebDriver) to perform the action in the browser. As with CDP, actions like typing into an input field usually involve an initial click on the field to ensure it has focus.

This multi-stage process—from detailed page perception using injected scripts, to intelligent interpretation by AI models, to precise action execution via mode-specific browser control mechanisms—allows Midscene to interact with web elements in a way that is both context-aware and adaptable to the specific automation environment. The goal is to make interactions more resilient than traditional selector-based methods by relying on a deeper, AI-driven understanding of the UI.

### 5.4. Operational Modes

Midscene's web integration capabilities are exposed through several distinct operational modes, all generally orchestrated by the `PageAgent` class (`packages/web-integration/src/common/agent.ts::PageAgent`). The `PageAgent` provides a unified programming interface for AI-driven automation, abstracting the specifics of how the browser is controlled. Each mode offers a different way to connect to and interact with a web browser, catering to various use cases from interactive testing to robust, scripted automation.

*   **Chrome Extension "Playground" Mode**:
    *   **Setup**: The user initiates this mode by interacting directly with the UI provided by the Midscene Chrome Extension's popup window, specifically the "Playground" tab.
    *   **Mechanism**: A `ChromeExtensionProxyPageAgent` (from `packages/web-integration/src/chrome-extension/agent.ts`) is instantiated within the extension's JavaScript environment. This agent directly utilizes `ChromeExtensionProxyPage` (from the same package) to interact with the currently active browser tab using the Chrome Debugger Protocol (CDP), as detailed in Section 5.1.1. The `PageAgent` orchestrates fetching page context, sending it to the AI (configured via the extension's store), and executing the AI's plan.
    *   **Key Components**: `apps/chrome-extension/src/extension/popup.tsx` (UI), `packages/web-integration/src/chrome-extension/agent.ts::ChromeExtensionProxyPageAgent`, `packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage`.
    *   **Use Case**: This mode is designed for interactive testing, quick automation tasks, and demonstrating Midscene's capabilities directly within the user's browser without needing to write or run external Node.js scripts. It serves as an excellent entry point for users to experience Midscene's AI in action.
*   **Bridge Mode**:
    *   **Setup**:
        1.  The Midscene SDK (or the CLI tool, which uses the SDK) is run in a Node.js environment. When initiated in bridge mode (e.g., via a YAML script specifying `bridgeMode: true` or by programmatic SDK setup), it starts a `BridgeServer`. This server (defined in `packages/web-integration/src/bridge-mode/io-server.ts`) listens for WebSocket (Socket.IO) connections on a local port (default 3766). This is typically managed by the `AgentOverChromeBridge` class from `packages/web-integration/src/bridge-mode/agent-cli-side.ts`.
        2.  The user opens the Midscene Chrome Extension, navigates to the "Bridge Mode" tab in the popup UI, and clicks "Allow Connection." This action prompts the `ExtensionBridgePageBrowserSide` class (from `packages/web-integration/src/bridge-mode/page-browser-side.ts`, running in the extension) to connect to the local `BridgeServer`.
    *   **Mechanism**: This mode establishes a bi-directional Remote Procedure Call (RPC) channel over WebSockets:
        1.  Commands from the SDK (e.g., a user script calling `agent.aiTap(...)`) are packaged by `AgentOverChromeBridge` and sent as RPC requests to its local `BridgeServer`.
        2.  The `BridgeServer` relays these RPC requests to the connected `ExtensionBridgePageBrowserSide` instance within the Chrome Extension.
        3.  `ExtensionBridgePageBrowserSide`, upon receiving an RPC call, executes the corresponding browser action (e.g., `this.mouse.click(...)`) using its underlying `ChromeExtensionProxyPage` capabilities (i.e., by sending CDP commands to the browser tab it's currently attached to).
        4.  Results (or errors) from these CDP operations are then serialized and passed back along the same Socket.IO channel to the `BridgeServer`, which then returns them to the original calling function in the SDK script.
    *   **Key Components**: `packages/web-integration/src/bridge-mode/agent-cli-side.ts::AgentOverChromeBridge` (SDK side), `packages/web-integration/src/bridge-mode/io-server.ts::BridgeServer` (SDK side), `apps/chrome-extension/src/extension/bridge.tsx` (Extension UI), `packages/web-integration/src/bridge-mode/page-browser-side.ts::ExtensionBridgePageBrowserSide` (Extension client logic), `packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage` (CDP execution).
    *   **Use Case**: Bridge Mode is particularly powerful because it allows external Node.js scripts (which can contain complex logic, integrate with other systems, or run in CI environments) to control a standard Chrome browser instance that the user has open. This is highly beneficial for leveraging existing browser sessions (cookies, logged-in states), for debugging complex automation scripts where observing the browser's behavior is necessary, and for scenarios that require a blend of programmatic control and potential manual intervention in the same browser context.
*   **Playwright Mode**:
    *   **Setup**: A developer writes a Node.js script that uses the Midscene SDK and explicitly configures Playwright as the browser automation driver. This typically involves installing `playwright` as a dependency and using Midscene's helper functions or classes to launch Playwright with a Midscene agent.
    *   **Mechanism**: The `PageAgent` (from `packages/web-integration/src/common/agent.ts`) is instantiated with a `WebPage` object provided by `packages/web-integration/src/playwright/page.ts`. This `WebPage` class wraps a native Playwright `Page` object and derives common functionalities from `BasePage` (located in `packages/web-integration/src/puppeteer/`).
    *   Command injection (specifically, the `midscene_element_inspector` script) is performed using Playwright's `page.evaluate()` method. Direct browser interactions (clicks, typing, navigation) utilize Playwright's native APIs (e.g., `page.mouse.click()`, `page.keyboard.type()`), as detailed in Section 5.1.2.
    *   **Key Components**: `packages/web-integration/src/common/agent.ts::PageAgent`, `packages/web-integration/src/playwright/page.ts::WebPage`, `packages/web-integration/src/puppeteer/base-page.ts::Page`.
    *   **Use Case**: This mode is tailored for developers who prefer Playwright for their automation backend or have existing test suites built with Playwright. It allows them to seamlessly integrate Midscene's AI-driven capabilities (like natural language commands and intelligent, adaptive element location) into their standard Playwright automation scripts, enhancing them with AI intelligence.
*   **Puppeteer Mode**:
    *   **Setup**: Similar to Playwright mode, but the developer chooses Puppeteer as the automation driver. This involves installing `puppeteer` and using Midscene's Puppeteer-specific agent launchers (e.g., `puppeteerAgentForTarget` used by the CLI).
    *   **Mechanism**: The `PageAgent` is instantiated with a `WebPage` object from `packages/web-integration/src/puppeteer/page.ts`, which wraps a Puppeteer `Page` object and also uses the common `BasePage`.
    *   Interaction methods leverage Puppeteer's native APIs for script evaluation (`page.evaluate()`) and browser control (`page.mouse.click()`, etc.).
    *   **Key Components**: `packages/web-integration/src/common/agent.ts::PageAgent`, `packages/web-integration/src/puppeteer/page.ts::WebPage`, `packages/web-integration/src/puppeteer/base-page.ts::Page`.
    *   **Use Case**: For developers already using Puppeteer or those who prefer its API, this mode enables the addition of Midscene's AI features to their Puppeteer-based automation projects. It's also the default web driver when running YAML scripts via the CLI if Bridge Mode is not specified.

The `PageAgent` class acts as a crucial abstraction layer. It defines a common set of high-level automation methods (like `aiTap`, `aiQuery`, `aiAction`). The underlying `AbstractPage` interface, implemented by mode-specific classes (`ChromeExtensionProxyPage`, `BasePage` for Playwright/Puppeteer), ensures that the `PageAgent`'s core AI and task execution logic (which often resides in `packages/core` and is managed by `PageTaskExecutor`) can function consistently, regardless of the chosen browser interaction backend. This architectural choice allows developers to select the most suitable browser control mechanism for their specific needs while still benefiting from Midscene's unified AI capabilities.

## 6. Core Components and Libraries

This section delves into the primary functionalities of key libraries within the `packages/` directory, excluding `packages/core/src/ai-model/` which is detailed in Section 4.

### 6.1. `packages/core`

Beyond its central role in AI model integration, `packages/core` provides foundational elements for Midscene's operations. It acts as the brain for understanding UI context, defining automation tasks, and structuring the results.

*   **Insight Orchestration (`insight/index.ts`)**:
    *   The `Insight` class is a cornerstone for perceiving and understanding the UI. It's not an AI model itself but rather orchestrates calls to the AI services (defined in `ai-model/`) for specific perceptual tasks. It bridges the gap between raw page data and actionable AI-driven insights.
    *   It is initialized with a `contextRetrieverFn`, a function that can dynamically fetch the current `UIContext` (which includes the screenshot, the element tree derived from `packages/shared/src/extractor`, and page dimensions) when an insight operation is requested.
    *   **Key Methods**:
        *   `locate()`: Manages the complex process of finding specific elements on a page based on a natural language query or other criteria. It can perform a "deepThink" by first calling `AiLocateSection` (to find a broader page region relevant to the query) and then `AiLocateElement` (to pinpoint the specific element within that region). This iterative approach is particularly useful for complex UIs.
        *   `extract()`: Orchestrates data extraction by calling `AiExtractElementInfo`.
        *   `assert()`: Manages UI assertions by calling `AiAssert`.
        *   `describe()`: Generates natural language descriptions of UI elements (specified by a `Rect` or point coordinates) by calling the AI with prompts from `ai-model/prompt/describe.ts`. It can also perform a "deepThink" by focusing on a cropped area around the target.
    *   It handles logging of insight data (queries, AI responses, errors, timings) through a `DumpSubscriber` mechanism, facilitated by `insight/utils.ts::emitInsightDump`.
*   **YAML Automation Language Definition (`yaml.ts`)**:
    *   This file is crucial as it defines the comprehensive set of TypeScript types and interfaces that constitute the schema for Midscene's YAML-based automation scripts. This structured definition allows for parsing, validation, and execution of user-created YAML files.
    *   Key types defined include:
        *   `MidsceneYamlScript`: The root type for a YAML script, encompassing environment configurations (`web`, `android`) and a list of tasks.
        *   `MidsceneYamlTask`: Defines a named task with a sequence of flow items.
        *   `MidsceneYamlFlowItem`: A union type representing all possible actions and operations that can be defined in a YAML flow. This includes various AI-driven actions (e.g., `aiTap`, `aiInput`, `aiQuery`, `aiAssert`, `aiScroll`), direct browser interactions (`evaluateJavaScript`), and control flow elements (`sleep`).
        *   Specific option types like `LocateOption` (e.g., for `deepThink`, `cacheable`) and `InsightExtractOption` (e.g., `domIncluded`, `screenshotIncluded`), are also defined here, allowing users to fine-tune AI behavior directly from their YAML scripts.
*   **Core Data Types (`types.ts`)**:
    *   This file is a central repository for a multitude of TypeScript types and interfaces that are fundamental to the data structures and contracts used throughout the entire Midscene system. These include:
        *   Representations of UI elements (`BaseElement`, `ElementTreeNode`), geometric primitives (`Rect`, `Size`, `Point`), and the `UIContext` object that encapsulates the state of a page at a given moment.
        *   Detailed structures for AI model responses corresponding to various tasks (location, extraction, assertion, planning).
        *   Definitions for the action execution framework used by the `ActionExecutor` (in `ai-model/action-executor.ts`), such as `ExecutionTask`, `ExecutionTaskApply`, `ExecutorContext`, and `ExecutionDump`.
        *   Enumerations like `PageType` (e.g., 'puppeteer', 'playwright', 'chrome-extension-proxy', 'android') that help in managing mode-specific logic.
*   **Reporting and General Utilities (`utils.ts`)**:
    *   **Report Generation**: `reportHTMLContent()` and `writeDumpReport()` are responsible for creating user-friendly HTML-based visual reports from the `ExecutionDump` data collected during automation runs. These reports, which include screenshots, action logs, and AI insights, are crucial for debugging and understanding the automation process. The reports are generated from a template string where dump data is injected.
    *   **File System Operations**: `writeLogFile()` provides a standardized way to write various log files and other operational data (like execution dumps or cache files) to disk. It manages the creation of output directories (typically under a `midscene_run/` folder at the project root) and can update the project's `.gitignore` file to exclude these generated files from version control. `getTmpDir()` and `getTmpFile()` provide helpers for managing temporary files.
    *   **Serialization**: `stringifyDumpData()` offers a custom JSON stringifier. This is important because automation objects (like Page or Browser instances from Puppeteer/Playwright) can have circular references or contain excessive internal details. This custom stringifier handles such objects gracefully to prevent errors and keep log outputs concise.
    *   **Version Information**: `getVersion()` provides the current SDK version, useful for logging and diagnostics.
    *   **Optional Telemetry**: `uploadTestInfoToServer()` outlines a mechanism for optionally sending anonymized test execution metadata (like repository URL and test URL) to a configured central server. This is likely used for gathering usage statistics or for project improvement tracking, and its activation would depend on user/environment configuration.
*   **Image and Tree Utilities (Re-exports from `packages/shared`)**:
    *   `image/index.ts` and `tree.ts` in `packages/core` primarily re-export functionalities from `packages/shared` (specifically from `@midscene/shared/img` and `@midscene/shared/extractor`). This design indicates that `packages/core` consumes these shared, lower-level utilities for tasks such as image analysis (getting dimensions, resizing, base64 conversion) and processing of HTML element trees (serialization into string format for prompts, truncation of text/attributes).

In essence, `packages/core` acts as the orchestration layer above direct AI model communication. It provides the `Insight` class for intelligent UI querying, defines the structure and types for YAML-based automation, establishes a robust type system for internal data representation, and offers essential utilities for generating reports and managing operational logs. It relies on `packages/shared` for more fundamental data extraction and image manipulation tasks.

### 6.2. `packages/shared`

The `packages/shared` library serves as a foundational layer, providing essential utilities and data structures that are consumed by various other packages within the Midscene monorepo, promoting code reuse and consistency. Its role is to offer common, low-level functionalities that are prerequisites for the more complex operations in other parts of the system.

*   **DOM Element Extraction (`extractor/`)**: This is arguably the most critical and complex component within `packages/shared`. It contains the client-side JavaScript code that is designed to be injected into and run directly within a web browser's context to analyze the live DOM.
    *   **`web-extractor.ts`**: This file houses the core extraction logic.
        *   `collectElementInfo()`: Traverses the DOM, identifies interactive and meaningful elements (buttons, inputs, text, images, links, containers) using heuristics defined in `dom-util.ts`. For each element, it captures its geometric properties (rectangle, center point), HTML attributes, textual content, and generates a unique hash ID (`midsceneGenerateHash`). It also determines the element's `NodeType`.
        *   `extractTreeNode()`: The main entry point for DOM extraction, orchestrating the traversal to build a hierarchical tree (`WebElementNode`) of detected elements. This tree is then typically serialized and sent to the AI models or used by other automation logic.
        *   `extractTreeNodeAsString()`: Converts the element tree into a string format using `descriptionOfTree`, suitable for LLM prompts.
    *   **`tree.ts`**:
        *   `descriptionOfTree()`: Serializes an `ElementTreeNode` into an XML/HTML-like string, providing a textual representation of the UI structure for AI models. It includes options for text truncation and filtering.
        *   `treeToList()`: Flattens the element tree into a simple list.
    *   **`dom-util.ts`**: Houses predicate functions (e.g., `isButtonElement`, `isFormElement`) to classify DOM nodes based on their tags and properties. `generateElementByPosition()` creates synthetic element representations for coordinates identified by VLMs.
    *   **`locator.ts`**: Provides utilities like `getXpathsById` and `getElementInfoByXpath` that can be run in the browser to get XPath information for elements, aiding in debugging and element re-identification.
    *   **`util.ts` (in `extractor/`)**: Contains helpers for geometric calculations (`elementRect`), attribute extraction (`getNodeAttributes`), pseudo-element content retrieval, unique ID generation (`midsceneGenerateHash`), and managing an in-browser cache of element hashes (`setNodeHashCacheListOnWindow`).
*   **Image Processing (`img/`)**: A comprehensive suite of image manipulation utilities, primarily using the `jimp` library. These are vital for preparing visual data for AI models and for generating visual feedback.
    *   **Information (`info.ts`)**: Functions like `imageInfoOfBase64` to get image dimensions.
    *   **Transformation (`transform.ts`)**:
        *   Resizing (`resizeImgBase64`, `zoomForGPT4o` for model-specific constraints).
        *   Cropping (`cropByRect`).
        *   Padding (`paddingToMatchBlockByBase64`) to meet VLM input requirements (e.g., ensuring dimensions are multiples of a block size).
        *   Format conversion (e.g., `jimpToBase64`).
    *   **Drawing (`draw-box.ts`)**: `drawBoxOnImage` to mark points or regions on images, useful for debugging or creating annotated datasets.
    *   **Composition (`box-select.ts`)**: `compositeElementInfoImg` draws bounding boxes and labels for multiple elements onto a base image, creating the "marked-up screenshots" used by some AI interaction flows.
*   **Logging (`logger.ts`)**:
    *   Provides a `getDebug(topic)` function that returns a `debug` instance for namespaced logging.
    *   In Node.js environments, it automatically writes these logs to timestamped files within the `midscene_run/log/` directory, categorized by topic (e.g., `midscene_run/log/ai-inspect.log`). This persistent logging is invaluable for server-side debugging.
*   **Environment Configuration (`env.ts`)**:
    *   Defines constants for all Midscene-specific environment variables (e.g., `MIDSCENE_MODEL_NAME`, `OPENAI_API_KEY`, `MIDSCENE_RUN_DIR`).
    *   Provides utility functions (`getAIConfig`, `getAIConfigInBoolean`, `getAIConfigInJson`) to access these configurations in a consistent manner.
    *   Includes logic to determine active VLM modes (`vlLocateMode`, `uiTarsModelVersion`) and preferred language (`getPreferredLanguage`).
*   **Node.js Specific Utilities (`node/fs.ts`)**:
    *   `getElementInfosScriptContent()` and `getExtraReturnLogic()`: These functions are crucial for Playwright and Puppeteer modes. They read the pre-built `htmlElement.js` (the browser-side portion of the extractor, also known as `midscene_element_inspector`) from `packages/shared/dist/script/`. This bundled script is then injected into web pages by the automation drivers.
    *   `getRunningPkgInfo()`: Locates the `package.json` of the currently running package.
*   **Standardized Output Directories (`common.ts`)**:
    *   `getMidsceneRunDir()` and `getMidsceneRunSubDir()`: Define and create the `midscene_run/` directory and its subfolders (`log`, `report`, `dump`, `cache`, `tmp`) for storing all operational outputs.
*   **Core Types and Constants (`types/index.ts`, `constants/index.ts`)**:
    *   Defines fundamental data structures like `Rect`, `Size`, `Point`, `BaseElement`, `ElementTreeNode`, and the `NodeType` enum. These are shared across the monorepo to ensure data consistency.
*   **General Utilities (`utils.ts`)**:
    *   Includes helper functions for UUID generation (`uuid`), a robust `assert` function, HTML escaping/unescaping, and identifying the execution environment (`ifInBrowser`).
    *   `generateHashId()`: Creates short, unique (within reasonable limits) identifiers for elements based on their properties.

`packages/shared` is the bedrock of common functionality, ensuring that tasks like DOM analysis, image manipulation, configuration, and logging are performed consistently across different parts of the Midscene platform. Its extractor script (`htmlElement.js`) is particularly vital for enabling page understanding in various browser environments.

### 6.3. `packages/cli`

The Command Line Interface (`packages/cli`), with its source in `packages/cli/src/`, serves as the primary user-facing tool for executing Midscene automations, particularly those defined in YAML scripts. It bridges the gap between user-defined automation scripts and the underlying Midscene core and integration libraries.

*   **Argument Parsing (`args.ts`, `cli-utils.ts`)**:
    *   The CLI uses the `yargs` library for robust command-line argument parsing, configured in `cli-utils.ts::parseProcessArgs`. Standard options include `--headed` (to run browsers in visible mode, useful for debugging), `--keep-window` (to prevent the browser from closing immediately after script completion), `--version`, and `--help`.
    *   The main positional argument expected is a path to a YAML script file or a directory containing multiple YAML scripts.
    *   `args.ts` provides some lower-level argument parsing utilities, including `orderMattersParse` for scenarios requiring specific argument sequence, though `yargs` handles the primary parsing in `index.ts`.
*   **Environment Configuration (`index.ts`)**:
    *   On startup, the CLI automatically loads environment variables from a `.env` file if one is present in the current working directory. This is facilitated by the `dotenv` package. This practice allows users to manage sensitive configurations like API keys for AI services and other settings locally without hardcoding them into scripts or command lines.
*   **YAML Script Execution (`yaml-runner.ts`, `index.ts`)**:
    *   **File Discovery**: `cli-utils.ts::matchYamlFiles` is responsible for locating all `.yml` or `.yaml` files based on the input path or glob pattern.
    *   **Core Execution Logic (`yaml-runner.ts::playYamlFiles`)**: This function orchestrates the execution of the discovered YAML scripts.
        1.  **Parsing**: The YAML content is read from the file and parsed into a JavaScript object structure using `parseYamlScript` (from `@midscene/web/yaml`, which likely uses a standard YAML parsing library like `js-yaml` internally, as seen in `PageAgent.runYaml`).
        2.  **Script Player**: A `ScriptPlayer` instance (from `@midscene/web/yaml`) is created for each script. This player is responsible for interpreting the parsed YAML structure (specifically the `flow` array within each task) and executing the defined actions sequentially.
        3.  **Dynamic Agent Creation (`agentFactory`)**: A critical function of the `yaml-runner` is its `agentFactory`. This function is passed to the `ScriptPlayer` and is responsible for dynamically instantiating and configuring the correct automation agent based on the `web` or `android` target specified within the YAML script:
            *   **Web Targets**:
                *   If the YAML includes a `serve` property (indicating a local directory to be served for the automation), the CLI starts a local static HTTP server using the `http-server` package via `launchServer()`.
                *   **Bridge Mode**: If `bridgeMode` (e.g., `newTabWithUrl` or `currentTab`) is configured, an `AgentOverChromeBridge` (from `@midscene/web/bridge-mode`) is created. This agent facilitates communication with an existing Chrome browser instance through the Midscene Chrome Extension.
                *   **Puppeteer Mode** (Default for Web if Bridge Mode is not specified): `puppeteerAgentForTarget` (from `@midscene/web/puppeteer-agent-launcher`) is invoked. This utility function launches a new browser instance controlled by Puppeteer and configures the browser page according to options in the YAML (viewport, user agent, cookie injection).
            *   **Android Targets**: If an `android` target is defined in the YAML, `agentFromAdbDevice` (from `@midscene/android`) is used. This function connects to a specified Android device/emulator (or the first available one) via ADB and prepares it for automation. The CLI can also launch a specific app or URL on the device as per the YAML.
        4.  **Resource Management**: The agent factory also returns an array of cleanup functions (`freeFn`) which are called by the `ScriptPlayer` after the script execution to properly dispose of resources like browser instances or web servers.
*   **User Feedback and Reporting (`printer.ts`, `tty-renderer.ts`)**:
    *   The CLI provides comprehensive feedback to the user regarding script execution progress.
    *   **TTY Rendering**: If run in a TTY-compatible terminal (e.g., a standard command prompt or terminal window), it utilizes `TTYWindowRenderer`. This component provides a rich, dynamic, and continuously updating display of the status of multiple YAML files and their individual tasks, often using spinners and color-coded status indicators (via the `chalk` library) for better readability.
    *   **Standard Output**: In non-TTY environments (such as CI/CD pipeline logs), it defaults to printing simpler, sequential log messages.
    *   Utilities in `printer.ts` (e.g., `indicatorForStatus`, `contextInfo`, `singleTaskInfo`) are used to format these outputs.
*   **Main Entry Point (`index.ts`)**:
    *   This file ties all the pieces together. It parses command-line arguments, loads the `.env` configuration, finds the target YAML scripts, and then calls `playYamlFiles` to initiate the automation.
    *   It is responsible for setting the final process exit code (0 for success, 1 for failure) based on the outcome of the script executions.
    *   It also handles the `--keep-window` option by using a `setInterval` call to keep the Node.js process alive after script completion, thus preventing any headed browser windows (launched by Puppeteer, for example) from closing prematurely. This allows users to inspect the final state of the browser for debugging purposes.

In summary, `packages/cli` acts as the primary user interface for executing Midscene automations defined in YAML. It intelligently sets up the required browser or device environment (Puppeteer, Bridge to Chrome, or Android ADB) based on the YAML configuration and then delegates the actual task execution to the `ScriptPlayer` and the underlying agent implementations from other Midscene packages.

## 7. Data Management and State

This section explores how data is managed and passed between different parts of the Midscene system, including state management within the Chrome extension.

### 7.1. Chrome Extension State (`apps/chrome-extension/src/store.tsx`)

The Midscene Chrome Extension utilizes the `zustand` library for its internal state management. `Zustand` is a minimalistic and hook-based state management solution for React, chosen for its simplicity and performance. The extension defines two primary stores:

*   **`useBlackboardPreference` Store**:
    *   **Purpose**: This store manages UI preferences related to a "blackboard" or visualizer interface, likely used within the extension's "Playground" or a similar debugging view where the current web page's elements and the AI's interactions are displayed or highlighted.
    *   **State**:
        *   `markerVisible: boolean`: Controls the visibility of markers highlighting elements on the page.
        *   `elementsVisible: boolean`: Toggles the display of textual details or overlays for elements.
    *   **Actions**: The store exposes actions like `setMarkerVisible` and `setTextsVisible`, allowing React components within the extension to update these visibility preferences.
*   **`useEnvConfig` Store**: This store is central to the extension's operational configuration and parts of its UI state.
    *   **Purpose**: It allows users to configure settings that would typically be OS-level environment variables in a Node.js context (like API keys for AI services or model selection). This is crucial for enabling the extension to function independently or in different modes. It also stores some UI-specific state for the popup.
    *   **State**:
        *   `serviceMode: ServiceModeType`: Defines how the extension interacts with AI and automation services. The possible values are:
            *   `'Server'`: The extension expects to connect to a local Node.js server (typically the Midscene SDK/CLI running in Bridge Mode) to offload AI processing and automation logic.
            *   `'In-Browser'`: The extension attempts to use the browser's native `fetch` API to call AI services directly. This mode would be used if AI models are accessible via standard HTTP/S endpoints and the necessary (API key) configurations are provided.
            *   `'In-Browser-Extension'`: Similar to `'In-Browser'`, but specifically denotes that the logic is running within the extension's own context (e.g., the popup page itself).
        *   `config: Record<string, string>`: An object storing parsed key-value configuration data. This typically includes AI service API keys, model names, base URLs, and other parameters necessary for AI service interaction. This object is derived from `configString`.
        *   `configString: string`: The raw, multi-line string representing the user's configuration, usually in a format similar to a `.env` file (e.g., `OPENAI_API_KEY=sk-xxxx`). Users can typically paste or edit this string in the extension's settings UI.
        *   `forceSameTabNavigation: boolean`: A boolean flag that controls whether navigation actions (like link clicks that would normally open a new tab) should be forced to occur within the current tab. This is particularly relevant for the `ChromeExtensionProxyPage`.
        *   `popupTab: 'playground' | 'bridge'`: A string that tracks which tab (either "Playground" or "Bridge Mode") is currently active within the extension's popup UI.
    *   **Actions**:
        *   `setServiceMode()`: Allows changing the `serviceMode`.
        *   `loadConfig()`: Takes a raw configuration string, parses it using an internal `parseConfig` utility (which handles `.env`-like lines, comments, and quoted values), and updates both the `configString` and the parsed `config` object in the store.
        *   `setForceSameTabNavigation()`: Updates the tab navigation preference.
        *   `setPopupTab()`: Updates the active tab in the popup.
    *   **Persistence**: To ensure user settings are retained across browser sessions and extension updates, critical parts of this state (`configString`, `serviceMode`, `forceSameTabNavigation`) are persisted to the browser's `localStorage`. The configuration is loaded from `localStorage` when the store is initialized.

This Zustand-based state management system provides a reactive and persistent way to handle user preferences and operational configurations within the Chrome Extension, making it adaptable to different user needs and setups, especially for configuring direct AI service access or preparing for Bridge Mode connections.

### 7.2. Data Passing Between Components

Data flow within Midscene is multifaceted, involving various mechanisms tailored to the interacting components and their environments. Understanding this flow is key to seeing how user intent or script definitions are translated into browser actions and how results are fed back.

1.  **User Input to Execution Engines**:
    *   **CLI (YAML Scripts)**: When a user runs `midscene <path_to_yaml>`, the CLI (`packages/cli`) parses the YAML file. This structured data, representing tasks and configurations (defined by types in `packages/core/src/yaml.ts`), is passed to the `ScriptPlayer` (from `@midscene/web/yaml`). The `ScriptPlayer` then uses this data to make decisions, such as which agent (web or Android) to instantiate and what sequence of operations to perform.
    *   **SDK (JavaScript/TypeScript)**: When Midscene is used as a library, data (like natural language prompts or target URLs) is passed as standard function arguments to `PageAgent` methods (e.g., `agent.aiTap("login button")`).
    *   **Chrome Extension Playground**: User-typed natural language commands in the Playground UI are captured by React components and passed to the `ChromeExtensionProxyPageAgent` instance.
2.  **Configuration Data**:
    *   **Environment Variables**: `packages/shared/src/env.ts` provides a centralized way to access OS-level environment variables. These are read by various packages (e.g., `service-caller` in `packages/core` for API keys, `packages/cli` for operational flags).
    *   **Chrome Extension `localStorage`**: As detailed in 7.1, the extension uses `localStorage` via its Zustand store to persist and retrieve user-provided configurations (API keys, model choices), making them available to its internal `ChromeExtensionProxyPageAgent` or for setting up Bridge Mode.
3.  **Inter-Process Communication (Bridge Mode)**: This is a critical data path when the SDK/CLI controls a browser via the Chrome Extension.
    *   **Mechanism**: Employs Socket.IO for a WebSocket-based RPC channel. The `BridgeServer` (in `packages/web-integration`, run by the SDK/CLI) and `ExtensionBridgePageBrowserSide` (in the Chrome Extension) are the two endpoints.
    *   **Data Flow**:
        *   *SDK to Extension*: Commands like "get URL" or "click element at (x,y)" are serialized into a `BridgeCallRequest` (`{ id, method, args }`) by `AgentOverChromeBridge` and sent through the `BridgeServer` to `ExtensionBridgePageBrowserSide`.
        *   *Extension to SDK*: Results of executed commands (e.g., the URL string, success/failure status) or errors are packaged into a `BridgeCallResponse` (`{ id, response, error }`) by `ExtensionBridgePageBrowserSide` and sent back.
    *   **Serialization**: Data passed over WebSockets is implicitly serialized (likely to JSON by Socket.IO).
4.  **Browser Interaction Data (Capturing Page State)**:
    *   **`UIContext` as the Core Data Structure**: Regardless of the mode (CDP, Playwright, Puppeteer), the `PageAgent` (in `packages/web-integration`) is responsible for capturing the current state of the web page. This involves:
        *   Taking a screenshot (base64 encoded image).
        *   Injecting and executing the `midscene_element_inspector` script (`packages/shared/src/extractor/`) to get a structured representation of the DOM (`ElementTreeNode<ElementInfo>`).
        *   Obtaining page dimensions.
    *   This data is assembled into a `WebUIContext` object (a type defined in `packages/web-integration`, extending `UIContext` from `packages/core`).
5.  **Passing Page State to AI Core**:
    *   The `WebUIContext` is passed from `PageAgent` to the `Insight` class in `packages/core` (typically via the `contextRetrieverFn`).
    *   Modules within `packages/core/src/ai-model/` (e.g., `prompt/util.ts::describeUserPage`) then use this `UIContext` to generate prompts for the AI, combining the screenshot with a textual description of the element tree.
6.  **Communication with AI Services**:
    *   **Requests**: Prompts (which are text, potentially including base64 image data for VLMs) are sent as HTTP requests (usually POST with a JSON body containing the prompt messages) to the configured AI service endpoint. This is managed by `packages/core/src/ai-model/service-caller/index.ts`.
    *   **Responses**: AI services typically return JSON objects containing their analysis, plans, or identified elements.
7.  **Returning AI Insights to Action Executors**:
    *   The `service-caller` parses the AI's JSON response.
    *   Higher-level functions in `packages/core` (e.g., `Insight.locate()`, `ai-model/llm-planning.ts::plan()`) process this raw AI output into more refined, structured JavaScript objects (like `LocateResult`, `PlanningAIResponse`). These objects often contain coordinates, element IDs, lists of actions, or extracted data.
    *   These structured results are then returned to the `PageAgent` (or its `PageTaskExecutor`). The `PageTaskExecutor` uses this data to execute concrete browser actions (e.g., using coordinates to click, or iterating through a list of planned actions).
8.  **Logging and Reporting Data**:
    *   Throughout all processes, detailed logs, screenshots, AI prompts, and responses are captured.
    *   The `PageAgent` accumulates these into `ExecutionDump` objects.
    *   These dumps are then used by utilities in `packages/core/src/utils.ts` to generate HTML reports, providing a comprehensive record of the automation session.
    *   Persistent logs are also written to the `midscene_run/log/` directory by the `logger` in `packages/shared`.

The data flow in Midscene is thus a carefully orchestrated sequence, transforming high-level user intent or script definitions into detailed page context for AI processing, then converting AI outputs back into actionable commands for various browser control backends, all while capturing rich data for logging and reporting. Serialization to JSON is a common theme at process or network boundaries.

## 8. Testing and Evaluation

Midscene places a strong emphasis on rigorous testing of its core functionalities and, critically, the performance and reliability of its AI-driven components. This is achieved through a combination of standard software testing practices (unit, integration, E2E tests) and a dedicated AI evaluation framework housed within the `packages/evaluation` directory. This framework allows for systematic and quantifiable assessment of AI model performance on various UI automation tasks.

### 8.1. Types of Tests Performed

Midscene's testing strategy incorporates multiple layers to ensure robustness from individual modules to complete end-to-end scenarios:

*   **Unit Tests**: Standard unit tests are implemented within individual packages, as evidenced by the presence of `vitest.config.ts` files (indicating Vitest as a common test runner and assertion library). These tests focus on verifying the correctness of individual functions, classes, and modules in isolation. For example, utility functions in `packages/shared` (like image processing or DOM utility predicates), specific parsing logic in `packages/core/src/ai-model/service-caller` (such as `safeParseJson`), or argument parsing in `packages/cli` would be subject to unit tests.
*   **Integration Tests**: The main CI workflow (`ci.yml` executing `pnpm run test`) implicitly runs integration tests. These tests ensure that different packages and components within the Midscene monorepo interact correctly with each other. For instance, they might verify that the `packages/cli` can correctly instantiate and utilize agents from `packages/web-integration`, which in turn must properly interface with `packages/core` for AI logic and perception tasks.
*   **End-to-End (E2E) Tests**: The `ai.yml` workflow is specifically dedicated to running E2E tests using Playwright (`pnpm run e2e`). These tests simulate complete user scenarios, driving a web browser through complex interactions that involve AI-driven planning and execution from start to finish. This validates the entire automation pipeline, from high-level instruction to low-level browser actions and assertions.
*   **AI Model and Component Evaluations (`packages/evaluation`)**: This is a specialized and critical form of testing focused on benchmarking the performance of various AI models (and Midscene's effective use of them) for core UI automation tasks. These include, but are not limited to, element location accuracy, action planning coherence and effectiveness, and the correctness of UI state assertions. These evaluations are often metric-driven (e.g., pixel distance for location, success rate for tasks) rather than simple pass/fail binary outcomes.
*   **AI Unit Tests (`ai-unit-test.yml`)**: This CI workflow suggests the existence of tests that are more focused on specific AI components or integrations, which might be more granular than full E2E scenarios but broader than pure unit tests. For example, testing particular AI prompt constructions with a mocked browser environment, verifying the response parsing for different AI services, or testing the bounding box adaptation functions with known inputs and outputs.

### 8.2. AI Evaluation Framework (`packages/evaluation`)

The `packages/evaluation` directory provides a structured environment for assessing Midscene's AI capabilities. This framework is essential for data-driven improvement of AI models and prompting strategies.

*   **Test Data Generation (`data-generator/`)**:
    *   This sub-directory contains Playwright scripts (e.g., `generator-headed.spec.ts`, `generator-headless.spec.ts`). These scripts are designed to automate (or semi-automate) the process of navigating to predefined web pages, performing certain actions if necessary, and then systematically capturing the data required to create evaluation test cases. This data typically includes screenshots and detailed DOM snapshots.
*   **Test Data Storage (`page-data/`)**:
    *   This directory acts as a repository for the raw data assets used in evaluations. It is organized into subdirectories, where each subdirectory (e.g., `antd-carousel/`, `todo/`, `online_order/`) usually corresponds to a specific web page, application state, or UI component being tested.
    *   Within each such subdirectory, common files include:
        *   `input.png`: The primary screenshot of the UI state that is presented to the AI model as visual context during an evaluation run.
        *   `element-snapshot.json`: A structured JSON representation of the relevant DOM elements and their properties (e.g., tag name, attributes, text content, bounding boxes, visibility). This is likely generated by the `midscene_element_inspector` script from `packages/shared` during the data generation phase and serves as the ground truth or detailed context for non-VLM models.
        *   `element-tree.json` / `element-tree.txt`: Alternative or supplementary textual representations of the page's element hierarchy, possibly used for different types of AI models or for various analysis purposes.
*   **Test Case Definition (`page-cases/`)**:
    *   Specific evaluation scenarios are formally defined in JSON files, which are categorized by the primary AI task they are designed to assess (e.g., `inspect/` for element location tasks, `planning/` for action planning, `assertion/` for UI state assertions, and `section-locator/` for the feature that identifies larger UI regions).
    *   Each JSON file (e.g., `page-cases/inspect/todo.json`) typically contains a `testDataPath` field (referencing a subdirectory in `page-data/`) and an array named `testCases`. An individual test case object within this array usually includes:
        *   `prompt`: The natural language instruction or query that will be provided to the AI model.
        *   `response_rect` (especially for VLM-based element location tests): The expected ground truth bounding box (`left`, `top`, `width`, `height` in pixels) of the target UI element.
        *   `response_element` (for ID-based element location, often used with non-VLM models): The expected Midscene-generated `id` (and sometimes `indexId`, which might be a visual marker ID) of the target element, as would be identified by the `midscene_element_inspector`.
        *   `response_planning` (for planning tasks): An object describing the expected sequence of actions, including action `type`, target element details (`locate`, which can itself contain an expected `bbox`), and the `more_actions_needed_by_instruction` boolean flag.
        *   `annotation_index_id`: An identifier that can be used to link the test case to visual annotations on corresponding screenshots (e.g., `todo.json-coordinates-annotated.png`), which helps in manually verifying the correctness of the test data and expected outcomes.
        *   `deepThink`: A boolean flag that might indicate whether a more computationally intensive or thorough AI reasoning process is expected for this case, or was used to generate the ground truth.
*   **Evaluation Execution (`tests/`)**:
    *   The actual evaluation scripts are located in this directory and are executed using the `vitest` test framework. Test files like `llm-locator.test.ts`, `llm-planning.test.ts`, and `assertion.test.ts` drive the evaluation process for their respective AI tasks.
    *   **General Workflow of an Evaluation Test Script**:
        1.  **Environment Setup**: Scripts typically start by loading necessary configurations using `dotenv`, which is crucial for setting up API keys and model names (e.g., from `MIDSCENE_MODEL_NAME`) for the AI model(s) being evaluated.
        2.  **Test Case Iteration**: The scripts iterate through a predefined list of `testSources` (e.g., 'todo', 'online_order', corresponding to the subdirectories in `page-data/` and `page-cases/`). For each source, they load the associated test cases from the relevant JSON file.
        3.  **Context Preparation**: For each individual test case, the `buildContext(source)` utility function (from `tests/util.ts`) loads the `input.png` screenshot and the structural DOM data (`element-snapshot.json` or `element-tree.json`) from the appropriate `page-data/` directory. This data is used to construct the `UIContext` object that Midscene's `Insight` class (from `packages/core`) or planning modules require as input.
        4.  **AI Invocation**: An `Insight` object is instantiated with this prepared `UIContext`. The relevant method of the `Insight` class (e.g., `insight.locate()`, or a planning function) is then called with the `prompt` and other parameters (like `deepThink` status) taken from the current test case.
        5.  **Result Collection**: The actual result returned by the AI (e.g., the properties of the located element, the generated action plan) and the execution time (`cost`) are captured for analysis.
*   **Result Analysis and Logging (`src/test-analyzer.ts::TestResultCollector`)**: This class is central to the systematic analysis of evaluation runs.
    *   **Initialization**: When an instance of `TestResultCollector` is created, it takes a `testName` (often derived from a tag indicating the mode of operation, e.g., 'by_coordinates' for VLM tests or 'by_element' for ID-based tests) and the current `modelName` (retrieved from the `MIDSCENE_MODEL_NAME` environment variable). This information is used to create unique, organized log file paths under `packages/evaluation/tests/__ai_responses__/[modelName]/`.
    *   **`addResult()`**: After each test case is executed, this method is called. Its primary role is to invoke an internal `compareResult()` method to determine if the AI's `actualResult` matches the `testCase`'s expected outcome. It then logs detailed information about the test—including its success or failure status, the test case details, the actual AI response, the expected response (if it differs), any error messages, and the execution cost—to two distinct files: a general log file for all results and a separate log file specifically for failed cases. This separation aids in quick identification of failures.
    *   **`compareResult()`**: This method contains the core logic for comparing the AI's output against the ground truth defined in the test case. The comparison logic is specific to the task:
        *   For **planning tasks**, it verifies if the sequence of action types in the AI's plan matches the expected sequence, if the `more_actions_needed_by_instruction` flag is correct, and if bounding boxes are involved for target elements, it compares the AI's predicted `bbox` with the expected `bbox` using a pixel distance metric (`distanceOfTwoBbox`) against a predefined `distanceThreshold` (e.g., 16 pixels).
        *   For **VLM-based element location tasks**, it compares the AI-returned `rect` (rectangle) with the `response_rect` from the test case using `distanceOfTwoRect` (which calculates the distance between the centers of the rectangles) against the same pixel threshold.
        *   For **ID-based element location tasks** (common with non-VLM models), it compares the `id` (or `indexId`) of the element located by the AI with the expected ID specified in the test case.
        *   The method returns `true` if the comparison is successful (i.e., within defined thresholds for geometric comparisons) or an `Error` object containing a descriptive message if it fails.
    *   **`printSummary()`**: After all tests in a suite (e.g., all locator tests for a given data source, or all tests in a file) are completed, this method is called (typically via `afterAll` in `vitest`). It calculates and prints a summary table to the console. This summary is grouped by `caseGroup` (e.g., 'todo', 'online_order') and includes key performance indicators (KPIs) such as the total number of cases, the count of successes and failures, the pass rate (as a percentage), the average execution cost (in milliseconds), and the total time cost for that group. This provides a quick and clear overview of the AI's performance across different scenarios.
    *   **`analyze()` (Quality Gating)**: This method enables the implementation of quality gates within the CI process. It checks if the number of failed cases within a specific `caseGroup` exceeds a configurable `allowFailCaseCount`. If the failure count surpasses this threshold, it prints the prompts of the failed cases to the console (for easier immediate debugging) and then throws an error. This is crucial for CI environments, as it will cause the build or test run to fail if AI performance drops below an acceptable level.
*   **Updating Ground Truth Data (`UPDATE_ANSWER_DATA` flag)**:
    *   The evaluation scripts (e.g., `llm-locator.test.ts`) include a valuable feature for managing ground truth data, activated by setting the `UPDATE_ANSWER_DATA` environment variable. When this flag is active, the scripts operate in an "update" mode: instead of asserting the AI's results against existing ground truth, they will overwrite the `response_rect`, `response_element`, or `response_planning` fields in the corresponding `page-cases/*.json` files with the new results obtained from the currently configured AI model. This mechanism is extremely useful for:
        *   Efficiently maintaining and updating the test suite as AI models are improved or their behavior changes slightly.
        *   Streamlining the process of adding new test cases: one can create the input data (`page-data/`) and a basic test case structure, then run the evaluation with this flag to automatically generate the initial "correct" answers (which should then be manually verified and fine-tuned).
        *   It also facilitates the generation of annotated screenshots (e.g., `*-coordinates-annotated.png`), where AI-predicted bounding boxes are drawn onto the input images, providing a quick visual way to inspect and verify VLM locator accuracy.

### 8.3. Integration with CI Workflows

The testing and evaluation framework is not just a standalone tool but is tightly integrated into the project's CI/CD pipeline through GitHub Actions, ensuring that AI performance is continuously monitored:
*   The **`ai-evaluation.yml` workflow** is specifically designed to execute these evaluation scripts. It typically runs commands like `pnpm run evaluate:locator`, `pnpm run evaluate:planning`, etc., which in turn trigger the corresponding `vitest` test scripts (e.g., `llm-locator.test.ts`). The output logs from `TestResultCollector` (which are stored in `packages/evaluation/tests/__ai_responses__/`) are uploaded as build artifacts. This practice allows developers and researchers to track AI performance trends over time, analyze failures in detail by examining the AI's raw responses against expectations, and compare the efficacy of different model versions or prompting strategies.
*   Other CI workflows, such as **`ai-unit-test.yml`** and **`ai.yml`** (for E2E tests), also contribute to the overall quality assurance of AI components by executing different sets of tests. They also produce their own reports (e.g., from `packages/web-integration/midscene_run/report`), which might be analyzed using similar principles or complementary tooling to ensure that AI features function correctly within broader application contexts.

In summary, Midscene employs a robust, data-driven, and automated approach to testing and evaluation, with a particular focus on its AI capabilities. This comprehensive strategy includes systematic test data generation and management, clearly defined test cases with versionable ground truth, automated execution of evaluation scripts using `vitest`, quantitative analysis of results with the `TestResultCollector`, and seamless integration into CI workflows for continuous performance monitoring and regression detection. The ability to easily update ground truth data also makes the framework adaptable and sustainable as AI models and the Midscene platform itself evolve. This rigorous testing is vital for building trust and reliability in an AI-powered automation system.

## 9. Extensibility and Configuration

Midscene is designed with several mechanisms for configuration and extension, allowing users and developers to tailor it to specific AI models, target applications, and automation requirements. This adaptability is key to its utility across a diverse range of scenarios.

### 9.1. Key Configuration Points

Configuration in Midscene is managed through a combination of environment variables (for global and backend settings), command-line arguments (for CLI execution), properties within YAML automation scripts (for task-specific behavior), and settings within the Chrome Extension UI (for user-specific preferences and standalone operation).

*   **Environment Variables (Managed by `packages/shared/src/env.ts`)**: This is the primary method for configuring backend settings, particularly those related to AI model access, operational behavior, and debugging. The `packages/shared/src/env.ts` file defines a comprehensive list of recognized environment variable keys. These variables are typically set in the shell environment where the Midscene SDK or CLI is executed, or they can be loaded from a `.env` file at the root of a project. Key aspects configurable via environment variables include:
    *   **AI Model Selection**:
        *   `MIDSCENE_MODEL_NAME`: Specifies the default language or multimodal model to be used (e.g., "gpt-4o", "claude-3-opus-20240229").
        *   `vlLocateMode`-related variables (e.g., `MIDSCENE_USE_QWEN_VL`, `MIDSCENE_USE_DOUBAO_VISION`, `MIDSCENE_USE_GEMINI`, `MIDSCENE_USE_VLM_UI_TARS`): These boolean flags determine which Vision Language Model (or VLM-like mode such as UI-TARS) is active for tasks requiring direct visual processing. The system is designed such that only one of these should be active at a time to avoid conflicts.
    *   **AI Service Credentials & Endpoints**:
        *   `OPENAI_API_KEY`, `OPENAI_BASE_URL`: For OpenAI models and compatible third-party services. `OPENAI_BASE_URL` allows pointing to custom or proxy OpenAI API endpoints.
        *   `ANTHROPIC_API_KEY`: For accessing Anthropic's Claude models.
        *   Azure OpenAI specific variables: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_API_VERSION`, `AZURE_OPENAI_DEPLOYMENT`, `MIDSCENE_AZURE_OPENAI_SCOPE`. These allow detailed configuration for users leveraging Azure's AI platform.
    *   **AI Behavior Customization**:
        *   `OPENAI_MAX_TOKENS`: Sets the maximum number of tokens the AI is allowed to generate in a response, helping to control costs and response latency.
        *   `MIDSCENE_FORCE_DEEP_THINK`: A global switch that can enable the "deepThink" mode for element location tasks, which might involve more thorough (but potentially slower) AI reasoning, such as using section location before element location.
        *   `MIDSCENE_PREFERRED_LANGUAGE`: Allows users to suggest a preferred language (e.g., "Chinese", "English") for AI-generated textual responses, like element descriptions or thoughts.
    *   **Network Configuration**: `MIDSCENE_OPENAI_SOCKS_PROXY`, `MIDSCENE_OPENAI_HTTP_PROXY` enable routing AI API calls through specified proxy servers, which is essential in certain corporate or restricted network environments.
    *   **Debugging and Logging**:
        *   `MIDSCENE_DEBUG_MODE` or the standard `DEBUG` variable (e.g., `DEBUG=midscene:ai:call,midscene:web:page`): Enables detailed logging output from specified Midscene modules via the `debug` library. This is invaluable for troubleshooting.
        *   `MIDSCENE_LANGSMITH_DEBUG`: Activates integration with LangSmith for advanced tracing and debugging of LLM application calls.
        *   `MIDSCENE_RUN_DIR`: Specifies the root directory for Midscene's operational outputs (logs, reports, cache), defaulting to `midscene_run` in the current working directory.
    *   **Feature Flags**:
        *   `MIDSCENE_CACHE`: A boolean flag to enable or disable the caching of AI task results (element locations, plans) to speed up repeated executions.
    *   **Platform-Specific Paths**: `MIDSCENE_ADB_PATH`: Allows users to specify the path to their Android Debug Bridge (ADB) executable if it's not in the system's default PATH, essential for Android automation.
*   **Advanced AI Service Connection Details (`packages/core/src/ai-model/service-caller/index.ts`)**:
    *   The `createChatClient` function within this module uses the environment variables to select and configure the appropriate AI SDK client.
    *   For highly specific or newly introduced SDK parameters not covered by dedicated environment variables, Midscene provides `MIDSCENE_OPENAI_INIT_CONFIG_JSON` and `MIDSCENE_AZURE_OPENAI_INIT_CONFIG_JSON`. These allow users to pass a JSON string containing additional configuration options directly to the OpenAI or Azure OpenAI SDKs respectively during client initialization, offering a powerful escape hatch for fine-grained control.
*   **Command-Line Interface (CLI) Arguments (`packages/cli/src/cli-utils.ts`)**:
    *   When running automations via the `midscene` CLI, users can provide arguments that modify execution behavior for that specific run:
        *   The primary argument is the `<path-to-yaml-script-file-or-directory>`, specifying which automation script(s) to execute.
        *   `--headed`: Overrides the default headless mode for browser automation, running the browser in a visible window. This is essential for observing the automation in real-time and for debugging scripts.
        *   `--keep-window`: Instructs the CLI to keep the browser window open even after the script finishes execution. This is useful for inspecting the final state of the web page or for debugging automation flows that close too quickly.
*   **YAML Script Properties (`packages/core/src/yaml.ts` for schema definition)**:
    *   The YAML script format itself is a major point of configuration, allowing fine-grained control over individual automation tasks and environments. Users can define:
        *   **Target Environment**: The `web` or `android` sections within the YAML allow specifying environment-specific parameters. For `web`, this includes the `url` to navigate to, Puppeteer-specific launch options (`userAgent`, `viewportWidth`, `viewportHeight`, `cookie`), and Bridge Mode settings (`bridgeMode: 'newTabWithUrl' | 'currentTab'`, `closeNewTabsAfterDisconnect`). For `android`, this includes `deviceId` and the `launch` string for an app or URL.
        *   **Global AI Context**: An `aiActionContext` can be provided at the script level. This string is passed to the AI for all tasks within that script, providing overarching context that can help the AI better understand the domain or specific goals of the automation.
        *   **Task-Level Options**: Individual flow items (actions) within a YAML task can have specific options that fine-tune AI behavior for that step. For example, AI actions like `aiTap` or `aiInput` accept `LocateOption` parameters such as `deepThink: true/false` (to control the thoroughness of element search, potentially using section location first) or `cacheable: true/false` (to override global caching behavior for that specific step). Similarly, `aiQuery` can take `InsightExtractOption` to control whether the DOM structure or screenshots are included in the context provided to the AI for data extraction.
*   **Chrome Extension Settings (`apps/chrome-extension/src/store.tsx`)**:
    *   As detailed in Section 7.1, the Chrome extension provides its own UI for configuration, with settings persisted in the browser's `localStorage` (managed via a Zustand store). This is particularly important for users who utilize the extension's "Playground" or want to use the "In-Browser" AI service mode.
    *   Users can directly input their AI provider credentials (API keys, model names, base URLs) into a text area within the extension, which parses this `.env`-like `configString`.
    *   They can also set the `serviceMode` (Server, In-Browser, In-Browser-Extension) and UI preferences like `forceSameTabNavigation`.

This multi-layered configuration system—spanning global environment settings, CLI flags, detailed YAML script directives, and interactive Chrome Extension preferences—allows Midscene to be highly adaptable to a wide range of operational requirements and user preferences.

### 9.2. Extending with New AI Models or Services

Midscene's architecture, particularly the design of the `service-caller` module within `packages/core`, is structured to be extensible, allowing for the future integration of new AI models or service providers beyond the currently supported OpenAI/Azure and Anthropic SDKs. Here’s a conceptual outline of how one might add support for a hypothetical "NewAIProvider":

1.  **Add SDK/Client Library**: If "NewAIProvider" offers an official Node.js SDK, it would be added as a project dependency. If no SDK exists, a custom HTTP client would need to be developed to interact with "NewAIProvider's" specific API endpoints, handling authentication, request formatting, and response parsing.
2.  **Update Environment Configuration (`packages/shared/src/env.ts`)**:
    *   Define new environment variable keys that will hold the necessary credentials and configuration for "NewAIProvider" (e.g., `NEWAI_API_KEY`, `NEWAI_BASE_URL`, any model-specific parameters).
    *   These new keys must be added to the `allConfigFromEnv()` function so that they are recognized and loaded into the global configuration accessible via `getAIConfig()`.
3.  **Modify `createChatClient` in `service-caller/index.ts`**:
    *   Extend the conditional logic within `createChatClient` to include a new block for "NewAIProvider."
    *   This block would first check if the required environment variables for "NewAIProvider" (e.g., `NEWAI_API_KEY`) are set and valid.
    *   If so, it would instantiate the "NewAIProvider" client (either its SDK or the custom HTTP client) using these configurations. For example: `const newAiClient = new NewAIProviderSDK.Client({ apiKey: getAIConfig('NEWAI_API_KEY'), baseUrl: getAIConfig('NEWAI_BASE_URL') });`.
    *   The function should then return an object that standardizes access to the client's chat completion (or equivalent) functionality and includes a unique identifier for its "style" to be used in the `call` function, e.g., `{ completion: newAiClient.chat, style: 'newaiprovider' }`.
4.  **Adapt Request/Response Handling in `call` Function (`service-caller/index.ts`)**:
    *   The main `call` function, which makes the actual API request, would need a new `else if (style === 'newaiprovider') { ... }` block.
    *   **Request Adaptation**: Inside this block, Midscene's standard prompt message format (an array of `ChatCompletionMessageParam`-like objects, which might include image data for VLMs) must be transformed into the specific request format expected by "NewAIProvider's" API. This could involve:
        *   Restructuring the message array (e.g., different role names like 'human' vs. 'user').
        *   Handling image data differently (e.g., different encoding methods, URL references vs. direct byte uploads, single vs. multiple images per message).
        *   Mapping Midscene's common parameters (like `temperature`, `max_tokens`) to "NewAIProvider's" equivalents.
    *   **Response Adaptation**: After receiving the HTTP response from "NewAIProvider," this block must parse it (if it's JSON, XML, or another format) and map the relevant parts back to Midscene's internal expected structure, which is `{ content: string; usage?: AIUsageInfo }`. This involves extracting the main textual content generated by the model and any available token usage statistics (prompt tokens, completion tokens, total tokens).
5.  **JSON Parsing and Output Handling**:
    *   If "NewAIProvider" is expected to return JSON but has specific output quirks or doesn't strictly adhere to JSON standards, custom preprocessing logic (similar to `preprocessDoubaoBboxJson`) might be needed within the `safeParseJson` function, or as a preliminary step before calling `safeParseJson`.
    *   If the new model supports a specific "JSON mode" or a structured output mechanism, the request adaptation logic should be designed to leverage that for improved reliability.
6.  **VLM Coordinate Normalization (If "NewAIProvider" is a VLM)**:
    *   If "NewAIProvider" is a Vision Language Model and returns bounding box coordinates for elements, new adaptation functions would need to be created in `packages/core/src/ai-model/common.ts` (similar to `adaptQwenBbox`, `adaptGeminiBbox`). These functions are crucial for converting "NewAIProvider's" specific coordinate system (e.g., normalized [0-1] vs. absolute pixels, different point orders like [xmin, ymin, xmax, ymax] vs. [ymin, xmin, ymax, xmax]) and format into Midscene's internal `Rect` object format.
    *   The `vlLocateMode` logic in `packages/shared/src/env.ts` would also need to be updated with a new environment variable (e.g., `MIDSCENE_USE_NEWAI_VL`) and a corresponding return value to allow users to select and activate this new VLM.
7.  **Model-Specific Prompting (Optional but Likely)**:
    *   Different AI models often perform best with prompts structured in specific ways or with particular system messages. If "NewAIProvider" has such preferences, new prompt variants might need to be crafted within the files in `packages/core/src/ai-model/prompt/`. The core logic in `packages/core` (e.g., methods within the `Insight` class or planning functions) might then need to be adjusted to select these new prompt variants when "NewAIProvider" is the active model.
8.  **Configuration in Chrome Extension (Optional)**:
    *   If the new model is intended to be configurable and usable directly from the Chrome Extension in its "In-Browser" service mode, the `parseConfig` function in `apps/chrome-extension/src/store.tsx` (which parses the `.env`-like string from `localStorage`) might need to be updated to recognize and correctly parse any new configuration keys associated with "NewAIProvider."

While a fully generic, plug-and-play AI provider interface (where one just implements a few predefined methods) is not explicitly detailed, the current structure of the `service-caller` module provides a clear, centralized pattern for such extensions. The primary development effort would involve understanding the new provider's API, writing the client interaction logic, and ensuring seamless data transformation between Midscene's internal structures and the provider's specific formats.

### 9.3. Adapting for Different Web Applications or Scenarios

Midscene offers robust mechanisms for users and developers to tailor automation logic for a wide array of web applications and specific testing or automation scenarios. This adaptability stems from its flexible input methods (natural language, YAML, SDK) and its AI-driven approach to UI understanding.

*   **YAML Scripting (Schema in `packages/core/src/yaml.ts`)**:
    *   This is the primary method for end-users and testers to define custom automation flows without needing deep programming knowledge. The YAML schema is designed to be expressive and allows for:
        *   **Defining Sequences of Actions**: Users can create a `flow` of items within named `tasks`. Each item represents an action or operation.
        *   **AI-Driven Commands**: Most interactions are AI-driven (e.g., `aiTap`, `aiInput`, `aiQuery`, `aiAssert`, `aiScroll`, `aiAction`). The main point of customization here is the **natural language prompt** provided for each command. Users tailor these prompts to refer to elements, data, or actions specific to their target application's UI and workflow. For example, `aiTap: "the main login button"` or `aiQuery: "list of all items in the shopping cart"`.
        *   **Fine-tuning AI Behavior**: Options within these AI commands, such as `LocateOption` (which includes `deepThink` and `cacheable`) or `InsightExtractOption` (which includes `domIncluded` and `screenshotIncluded`), allow users to influence how the AI approaches a task for a particular step. For instance, `deepThink: true` might be used for a visually ambiguous element that requires more reasoning, while `cacheable: false` might be appropriate for highly dynamic elements whose state should not be cached.
        *   **Direct Browser Interactions**: The `evaluateJavaScript` flow item allows users to execute arbitrary JavaScript code directly in the context of the page. This serves as a powerful escape hatch for custom interactions, data extraction logic, or manipulations not covered by standard Midscene AI actions.
        *   **Environment Configuration**: YAML scripts can define target environments (`web` or `android`) with specific parameters. For `web` targets, this includes the starting `url`, Puppeteer-specific browser options (like `userAgent`, `viewportWidth`, `viewportHeight`, `cookie`), and Bridge Mode settings (`bridgeMode: 'newTabWithUrl' | 'currentTab'`, `closeNewTabsAfterDisconnect`). For `android` targets, it includes `deviceId` and an app `launch` string. This allows the same logical flow to be potentially run against different setups.
        *   **Global Context for AI**: An `aiActionContext` can be provided at the script level. This string is passed to the AI for all tasks within that script, giving overarching context that can help the AI better understand the application's domain, common user roles, or specific terminology used in the UI.
    *   This declarative approach, centered on natural language and configurable AI actions, allows users to create and modify automation scripts that are highly specific to their application's UI and workflow, often without needing to worry about brittle selectors.
*   **JavaScript/TypeScript SDK (`PageAgent` APIs in `packages/web-integration/src/common/agent.ts`)**:
    *   For developers requiring more complex logic, conditional branching, sophisticated error handling, or integration with other JavaScript/TypeScript libraries and existing test frameworks (like Jest, Mocha, or custom test runners), the Midscene SDK provides a comprehensive set of APIs.
    *   The `PageAgent` class is the main entry point for programmatic automation. Its methods (e.g., `agent.aiTap()`, `agent.aiQuery()`, `agent.aiAction()`, `agent.runYaml()`) mirror the capabilities available in YAML but offer the full power of a general-purpose programming language.
    *   **Benefits of SDK Usage**:
        *   **Dynamic Prompt Construction**: Prompts for AI actions can be dynamically constructed based on application state, test data, or previous AI outputs.
        *   **Custom Logic for Results**: Developers can implement custom logic to process the structured data returned by AI calls (e.g., from `aiQuery` or `aiLocate`), perform complex calculations, or make decisions based on this data.
        *   **Integration with External Systems**: The SDK allows easy integration of Midscene actions with external data sources, APIs, databases, or reporting frameworks.
        *   **Reusable Automation Modules**: Developers can create reusable functions, classes, or Page Object Models that encapsulate common automation patterns specific to their target applications, leading to more structured, maintainable, and scalable automation codebases.
*   **Custom Prompt Engineering**:
    *   While Midscene provides effective default prompts for its core AI tasks (as defined in `packages/core/src/ai-model/prompt/`), users of the SDK have the flexibility to significantly influence AI behavior by carefully crafting the natural language inputs (the `prompt` arguments) to the various `PageAgent` methods. The more descriptive and unambiguous the prompt, the better the AI is likely to perform.
    *   The `aiActionContext` parameter, available in both YAML and SDK methods like `PageAgent.aiAction()`, allows users to provide overarching, domain-specific context to the AI for an entire script or session. This can include details about the application's purpose, common user roles, specific terminology used in the UI, or general guidelines for interaction, helping the AI to better interpret ambiguous instructions and make more informed decisions.
*   **Configuration of Element Extraction (Indirectly)**:
    *   The core `midscene_element_inspector` script (from `packages/shared/src/extractor/`) uses a set of heuristics to determine which DOM elements are "interactive" or "textual." While direct configuration of these heuristics by end-users is not a standard feature, the AI's ability to process both the visual screenshot and the textual DOM tree (as described by `descriptionOfTree`) provides a level of robustness. If the default extraction doesn't perfectly capture an element's nature, the AI can often still succeed by correlating visual cues with the textual information or by users providing more descriptive prompts. For very unusual custom elements, advanced users building from source could potentially modify the extractor logic, though this is a more involved customization.

Through these mechanisms—particularly the expressive power of natural language prompts combined with the structured control offered by YAML and the programmatic flexibility of the JavaScript/TypeScript SDK—Midscene provides substantial latitude for users and developers to adapt its automation capabilities to a vast range of web applications and specific automation goals. The emphasis is on leveraging AI to reduce the need for detailed, brittle configurations, allowing users to focus on *what* they want to achieve rather than *how* to precisely select each element.

### 9.4. Plugin Architectures and Explicit Extension Points

While Midscene does not currently feature a highly explicit or formal plugin architecture akin to some traditional software (e.g., a system with a plugin marketplace or a very generic API for adding entirely new types of actions without modifying core packages), its modular design and specific abstractions do offer several implicit and explicit extension points:

1.  **AI Model Service Integration (Most Explicit Extension Point)**:
    *   As detailed in Section 9.2, the `packages/core/src/ai-model/service-caller/index.ts` module is structured to allow the addition of new AI service providers. The `createChatClient` function acts as a central dispatcher, and the `call` function contains the adaptation logic for request/response handling. Adding support for a new AI model primarily involves extending these two functions with provider-specific client instantiation and data transformation logic. This is the most well-defined and anticipated area for extending Midscene's core AI capabilities to new or custom models.
2.  **Browser Driver Abstraction (`AbstractPage` Interface)**:
    *   The `AbstractPage` interface, defined in `packages/web-integration/src/page.ts`, serves as a contract for browser interaction. It is currently implemented by `ChromeExtensionProxyPage` (for CDP-based control) and `BasePage` (which underpins the Playwright and Puppeteer integrations).
    *   This abstraction theoretically allows for the integration of other browser automation drivers or remote browser services. A developer could create a new class that implements the `AbstractPage` interface for a different backend (e.g., a WebDriver-based driver for Safari, or an adapter for a cloud-based browser farm service like BrowserStack or Sauce Labs). This new page implementation could then be consumed by the existing `PageAgent` (from `packages/web-integration/src/common/agent.ts`), enabling Midscene's AI capabilities to be used with that new driver. This would be a significant development effort but is architecturally supported by the interface.
3.  **Custom Scripting with `evaluateJavaScript`**:
    *   Both the YAML flow items (`evaluateJavaScript: "your_script_here"`) and the `PageAgent` SDK (via `agent.page.evaluateJavaScript("your_script_here")`) provide an action to execute arbitrary JavaScript code directly within the context of the web page being automated.
    *   This is a powerful, albeit low-level, extension point. It allows users to:
        *   Perform custom DOM manipulations or queries not covered by standard Midscene actions.
        *   Extract highly specific or complex data from the page's JavaScript environment or global variables.
        *   Interact with page elements or JavaScript objects (e.g., a chart library's API) in ways unique to the target application.
        *   Effectively, this enables users to write their own "mini-plugins" or custom interaction snippets for specific tasks within their broader automation scripts, without needing to modify Midscene's core code.
4.  **SDK for Programmatic Extension and Composition**:
    *   The most common and intended way to "extend" Midscene for complex scenarios is by using its JavaScript/TypeScript SDK. Developers can leverage the `PageAgent` and the functionalities within `packages/core` (like `Insight`) to build custom applications, more sophisticated automation frameworks, or specialized testing tools.
    *   This allows for:
        *   Creating reusable automation modules or Page Object Models (POMs) tailored to specific applications.
        *   Implementing complex conditional logic, loops, and error handling around Midscene's AI actions.
        *   Integrating Midscene's capabilities with external data sources, APIs, databases, or custom reporting systems.
        *   Essentially, any custom behavior that can be coded in Node.js can be built around Midscene's core functionalities.
5.  **Custom YAML Task Definitions (User-Level Extensibility)**:
    *   While YAML itself defines a set of built-in actions, users can create complex and reusable automation routines by structuring them as named `tasks` within their YAML scripts. These YAML files can be version-controlled, shared among team members, and invoked by the CLI.
    *   This allows users to build libraries of custom automation "scripts" for specific applications or common workflows within their organization, effectively extending Midscene's utility for their particular needs without direct code changes to the framework.
6.  **`packages/mcp` (Midscene Copilot Package)**:
    *   While details are still emerging from the codebase review, the existence of `packages/mcp` suggests a layer designed for higher-level abstractions or "copilot-like" functionalities. This package itself could be an extension point or provide tools that allow other AI agents or systems to interface with and utilize Midscene's core automation capabilities as a specialized "tool" or "skill." The inclusion of API documentation and Playwright examples in its prompts implies it might facilitate more complex interactions or code generation tasks.

While Midscene might not currently have a formal "plugin store" or a highly decoupled plugin API for every conceivable extension type (e.g., adding entirely new core action types to the AI's repertoire without modifying `packages/core` would be challenging), its existing abstractions for AI services and browser control, combined with the power of its SDK and scripting capabilities, provide substantial avenues for users and developers to adapt and extend the framework to a wide range of new requirements and scenarios. The design philosophy appears to favor providing robust core intelligence and flexible integration points, which can then be leveraged for building custom solutions and extending functionality in a more bespoke manner.

## 10. Conclusion

Midscene emerges as a sophisticated and versatile AI-driven automation framework, thoughtfully architected to address the complexities of modern web and mobile application interaction. Its core strength lies in its ability to translate natural language instructions and high-level goals into concrete automation plans, leveraging a flexible selection of advanced AI models, including Vision Language Models. This significantly lowers the barrier to automation and promises more resilient scripts compared to traditional selector-based approaches.

The project's monorepo structure, managed with pnpm and Nx, promotes modularity and code reuse across its diverse components. Key packages like `core` (for AI logic and YAML definition), `shared` (for DOM extraction, image processing, and common utilities), `web-integration` (for multi-modal browser control via CDP, Playwright, Puppeteer, and a unique Bridge Mode), `android` (for mobile automation), and `cli` (for YAML script execution) interact cohesively to provide a comprehensive automation solution.

Midscene's approach to AI integration is notable for its adaptability, supporting various models and service providers. The meticulous prompt engineering, which combines visual and textual UI context with task-specific instructions and examples, is central to its effectiveness. Furthermore, the robust mechanisms for command injection, element targeting, and data passing ensure reliable execution across different platforms and operational modes.

The framework's commitment to testing and evaluation, particularly through the dedicated `packages/evaluation` suite and CI integration, underscores a focus on the reliability and continuous improvement of its AI capabilities. While not featuring a traditional plugin system for all aspects, Midscene offers significant extensibility through its SDK, YAML scripting, configurable AI services, and abstracted browser control interfaces.

Overall, Midscene represents a significant step towards more intelligent, adaptable, and accessible UI automation. By combining the understanding capabilities of modern AI with robust engineering practices, it provides a powerful platform for developers and testers to tackle complex automation challenges on both web and mobile platforms. Its ongoing development, particularly in refining AI interactions and expanding its integration capabilities, will likely solidify its position as a leading solution in the evolving landscape of AI-powered automation. As AI models continue to advance, frameworks like Midscene that are designed to flexibly incorporate them will become increasingly vital.
