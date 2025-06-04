# GitHub Actions Workflow Analysis

This document analyzes the GitHub Actions workflows defined in the `.github/workflows/` directory to understand the CI/CD pipeline, automated testing, and other repository management processes.

## 1. CI/CD Pipeline

The CI/CD pipeline is primarily managed by `ci.yml` and `release.yml`.

### `ci.yml` (Continuous Integration)

*   **Trigger**: Runs on `push` and `pull_request` events to the `main` branch.
*   **Purpose**: To build and test the project automatically.
*   **Key Steps**:
    *   Sets up Node.js (version 18.19.0) and pnpm (version 9.3.0).
    *   Caches Puppeteer dependencies for faster builds.
    *   Installs project dependencies using `pnpm install --frozen-lockfile --ignore-scripts`.
    *   Installs Puppeteer browser (chrome) specifically for the `packages/web-integration` component.
    *   Builds the project using `pnpm run build`.
    *   Runs tests using `pnpm run test`.
*   **Environment Variables**: Uses `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `MIDSCENE_MODEL_NAME` secrets, suggesting that some tests might interact with an OpenAI-compatible API.

### `release.yml` (Continuous Deployment/Release)

*   **Trigger**: Manually triggered via `workflow_dispatch` with two inputs:
    *   `version`: The release version type (e.g., `minor`, `patch`).
    *   `branch`: The branch to release from (default `main`).
*   **Purpose**: To automate the release process, including versioning and publishing artifacts.
*   **Key Steps**:
    *   Checks out the specified branch.
    *   Uses `zhoushaw/push-protected` action, possibly to allow pushing to a protected branch during release.
    *   Sets up Node.js and pnpm.
    *   Caches and installs Puppeteer dependencies.
    *   Installs project dependencies.
    *   Installs Puppeteer browser for `packages/web-integration`.
    *   Runs a custom release script: `node ./scripts/release.js --version=<version_input>`. This script likely handles version bumping, tagging, and publishing.
    *   Uses an `NPM_TOKEN` secret, indicating it publishes packages to npm.
    *   Uploads an artifact named `chrome_extension` from the `apps/chrome-extension/extension_output` directory. This implies that the `chrome-extension` component is a key output of the release process.

## 2. AI-related Workflows

Several workflows are dedicated to testing and evaluating AI components, likely interacting with an AI service branded as "Doubao".

### `ai-evaluation.yml`

*   **Trigger**: Manually triggered via `workflow_dispatch` with an optional `branch` input (defaults to `main`).
*   **Purpose**: To evaluate AI model performance on specific tasks.
*   **Key Steps**:
    *   Sets up Node.js, pnpm, and installs dependencies.
    *   Builds the project.
    *   Runs evaluation scripts located in `packages/evaluation`:
        *   `pnpm run evaluate:locator`
        *   `pnpm run evaluate:planning`
        *   `pnpm run evaluate:assertion`
    *   Uploads evaluation logs from `packages/evaluation/tests/__ai_responses__/` as an artifact.
*   **Environment Variables**: Uses `DOUBAO_TOKEN`, `DOUBAO_BASE_URL`, `MIDSCENE_MODEL_NAME` (set to 'doubao-1-5-thinking-vision-pro-250428'), and `MIDSCENE_USE_DOUBAO_VISION: 1`.

### `ai-unit-test.yml`

*   **Trigger**: Runs on `push` to `main` or manually via `workflow_dispatch` (with optional `branch` input).
*   **Purpose**: To run AI-specific unit tests.
*   **Key Steps**:
    *   Sets up Node.js, pnpm, and installs dependencies.
    *   Installs Puppeteer browser for `packages/web-integration`.
    *   Runs AI unit tests using `pnpm run test:ai`.
    *   Uploads test output from `packages/web-integration/midscene_run/report`.
*   **Environment Variables**: Same Doubao-related secrets as `ai-evaluation.yml`.

### `ai.yml` (Playwright E2E for AI)

*   **Trigger**: Runs on `push` to `main` or manually via `workflow_dispatch` (with optional `branch` input).
*   **Purpose**: To run end-to-end tests for AI functionalities using Playwright.
*   **Key Steps**:
    *   Sets up Node.js, pnpm, and installs dependencies.
    *   Caches Playwright dependencies.
    *   Installs Playwright and its dependencies.
    *   Installs Puppeteer browser for `packages/web-integration`.
    *   Runs multiple E2E test suites: `pnpm run e2e`, `pnpm run e2e:cache`, `pnpm run e2e:report`.
    *   Uploads reports from `packages/web-integration/midscene_run/report` for each test suite.
*   **Environment Variables**: Same Doubao-related secrets as `ai-evaluation.yml`.

## 3. Repository Management Workflows

These workflows automate various aspects of repository maintenance and developer experience.

### `lint.yml`

*   **Trigger**: Runs on `push` and `pull_request` to the `main` branch.
*   **Purpose**: To enforce code style and quality.
*   **Key Steps**:
    *   Sets up Node.js, pnpm, and installs dependencies.
    *   Runs `pnpm run check-dependency-version` to verify dependency consistency.
    *   Runs `npx biome check . --diagnostic-level=warn --no-errors-on-unmatched` for linting.
*   **Environment Variables**: Uses `MIDSCENE_OPENAI_INIT_CONFIG_JSON` and `MIDSCENE_OPENAI_MODEL` secrets.

### `issue-labeled.yml`

*   **Trigger**: When an issue is `labeled`.
*   **Purpose**: To automate responses to issue labeling, specifically for `need reproduction`.
*   **Key Steps**:
    *   If an issue in `web-infra-dev/midscene` is labeled `need reproduction`, it comments on the issue asking the user to provide a reproduction.

### `issue-close-require.yml`

*   **Trigger**: Runs on a schedule (daily at midnight: `0 0 * * *`).
*   **Purpose**: To automatically close stale issues awaiting reproduction.
*   **Key Steps**:
    *   If an issue in `web-infra-dev/midscene` has the label `need reproduction` and has been inactive for 5 days, it closes the issue with a comment.

### `pr-label.yml`

*   **Trigger**: When a pull request is `opened` or `edited`.
*   **Purpose**: To automatically label pull requests based on their content or title.
*   **Key Steps**:
    *   Uses the `github/issue-labeler` action with a configuration file at `.github/pr-labeler.yml` to label PRs in `web-infra-dev/midscene`.

## 4. Overall Data Flow and Control Flow

*   **Development & CI**: Developers push code or create PRs to `main`. This triggers `ci.yml` (build, test) and `lint.yml` (code quality checks). `ai-unit-test.yml` and `ai.yml` (AI E2E tests) also run on pushes to `main`, ensuring AI components are tested.
*   **Release Process**: Releases are manual. A user with appropriate permissions triggers `release.yml`, specifying the version and branch. This workflow builds the project, runs the `release.js` script (which likely handles versioning, tagging, and npm publishing), and importantly, packages the `chrome-extension` from `apps/chrome-extension/extension_output` and uploads it as a release artifact.
*   **AI Evaluation**: AI model performance can be evaluated on demand by triggering `ai-evaluation.yml`. This workflow runs specific evaluation scripts from `packages/evaluation` and produces logs.
*   **Component Interactions**:
    *   `packages/web-integration` seems central to testing, requiring Puppeteer (in `ci.yml`, `ai-unit-test.yml`, `release.yml`) and Playwright (in `ai.yml`). Its outputs (reports) are often uploaded.
    *   `apps/chrome-extension` is a key deliverable, packaged during the release process.
    *   `packages/evaluation` contains scripts specifically for AI model evaluation.
    *   The various AI workflows (`ai-evaluation.yml`, `ai-unit-test.yml`, `ai.yml`) all interact with an external AI service (Doubao) using shared secrets.
*   **Issue Management**: Issues tagged with `need reproduction` are automatically commented on by `issue-labeled.yml` and closed after 5 days of inactivity by `issue-close-require.yml`.
*   **PR Management**: Pull requests are automatically labeled by `pr-label.yml`.

This analysis provides a foundational understanding of the automated processes in the repository. The interaction between core logic, the `web-integration` package (likely for browser automation tasks), and the `chrome-extension` is evident, especially in the CI and release workflows. The AI-related workflows suggest a separate but integrated track for developing and testing AI-powered features.
