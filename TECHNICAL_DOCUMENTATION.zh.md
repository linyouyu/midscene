# Midscene 技术文档

## 1. 引言/概述

Midscene 是一个创新的、由人工智能驱动的自动化框架，旨在从根本上简化用户和开发者与 Web 及移动应用程序交互和自动化的方式。在数字界面无处不在且日益复杂的时代，Midscene 致力于解决传统自动化脚本固有的脆弱性和高昂的维护成本问题。它通过利用人工智能的力量，特别是先进的视觉语言模型 (VLM) 和大型语言模型 (LLM)，来实现动态解释用户意图和理解 UI 结构。

Midscene 的核心前提是通过自然语言指令实现自动化。用户无需为每个交互编写明确的、依赖选择器的代码（例如，“找到 ID 为 'foo' 的元素并点击它”），而是可以用人类语言指定他们的目标（例如，“使用用户名 'test' 和密码 'pass' 登录，然后导航到仪表盘并检查新消息”）。Midscene 的 AI 引擎随后会接管，感知应用程序的 UI，规划一系列操作，并使用适当的浏览器或设备控件来执行它们。这种方法旨在使自动化脚本对微小的 UI 变化更具鲁棒性，因为 AI 通常能够适应那些会破坏传统脚本的变动。

除了自然语言之外，Midscene 还支持通过结构化的 YAML 脚本进行自动化，以实现更具确定性和可重复性的工作流，并提供全面的 JavaScript/TypeScript SDK，以便深度集成到开发环境和复杂的脚本场景中。这种多模式方法满足了从无代码业务用户和 QA 测试人员到经验丰富的自动化工程师和开发人员等广泛用户的需求。

**主要特性与功能：**

*   **自然语言自动化**：用户可以用通俗易懂的语言描述他们的目标和操作步骤。Midscene 的 AI 随后会规划并操作用户界面以实现这些目标。这显著降低了创建自动化的门槛。
*   **跨平台支持**：
    *   **Web 自动化**：通过其 Chrome 扩展程序和“桥接模式”与现有浏览器实例集成，或使用 Puppeteer 和 Playwright 等流行库以编程方式控制浏览器，从而提供灵活性。
    *   **Android 自动化**：通过基于 ADB 的 JavaScript SDK 实现对本地 Android 设备和模拟器的控制，从而实现原生移动应用程序的自动化。
*   **多样化的开发与调试工具**：
    *   **可视化报告**：每次自动化运行后生成详细的 HTML 报告。这些报告包括每个步骤的屏幕截图、执行的操作、AI 推理（如果适用）以及时间信息，这对于调试和理解自动化流程非常有价值。
    *   **交互式 Playground**：Chrome 扩展程序和专用的 Android Playground 应用程序为测试 Midscene 的功能以及逐步调试自动化逻辑提供了即时、交互式的环境。
    *   **缓存机制**：通过缓存 AI 操作（如元素定位或规划）的结果，提高了效率，尤其是在脚本开发和迭代测试期间。当底层 UI 或指令没有发生重大变化时，这可以加快脚本的重放速度。
    *   **Midscene Copilot Package (MCP)**：一个建议高级类代理功能或集成的组件，可能允许其他系统或 AI 代理利用 Midscene 的核心自动化能力作为专用工具。
*   **灵活的 API 风格**：
    *   **交互 API**：高级命令，如 `agent.aiTap("login button")` 或 `agent.aiInput("search term", "search bar")`，这些命令由对元素和操作的自然语言描述驱动。
    *   **数据提取 API**：诸如 `agent.aiQuery("get the list of products")`、`agent.aiString("extract the order total")`、`agent.aiNumber(...)`、`agent.aiBoolean(...)` 之类的函数，用于使用自然语言查询从 UI 中提取结构化或特定信息。
    *   **实用 API**：辅助函数，包括用于对 UI 状态进行断言的 `agent.aiAssert("the login was successful")`，用于在不交互的情况下识别特定元素的 `agent.aiLocate("find the help icon")`，以及用于暂停执行直到满足某个 UI 条件的 `agent.aiWaitFor("wait until the loading spinner disappears")`。
*   **广泛的 AI 模型兼容性**：支持一系列 AI 模型，允许用户根据能力、成本和访问权限进行选择：
    *   多模态 LLM，如 OpenAI 的 GPT-4o，可以处理文本和图像。
    *   专门的视觉语言模型 (VLM)，如 Qwen-VL、豆包视觉、Google 的 Gemini 系列以及开源的 UI-TARS 模型。VLM 因其强大的 UI 理解能力而特别受到推荐。
    *   该系统设计有可配置的模型端点和 API 密钥，主要通过环境变量或 Chrome 扩展程序的设置进行管理。
*   **适应性强的自动化风格**：
    *   **自动规划 (`agent.aiAction(instruction)`)**：AI 完全控制将高级自然语言指令（例如，“预订下周二从伦敦到纽约的航班”）分解为一系列可执行步骤。虽然功能强大，但其成功与否在很大程度上取决于所选 AI 模型的复杂程度和任务的复杂性。
    *   **工作流风格**：用户可以在 JavaScript/TypeScript（使用 SDK）或 YAML 脚本中定义更细粒度的步骤和控制逻辑。在这种风格下，Midscene 的 API 用于单个交互或洞察（例如，`agent.aiTap()`、`agent.aiQuery()`），从而使开发人员能够更好地控制自动化流程和错误处理，这通常会为复杂流程带来更稳定和可靠的自动化。

Midscene 旨在通过自然语言使 UI 自动化更加易于访问，从而实现其大众化，同时还为专业开发人员提供了构建强大且可维护的自动化解决方案所需的工具和灵活性。本文档对其架构、核心组件、AI 集成、命令执行策略以及各种操作模式进行了全面的技术概述。

## 2. 项目架构

Midscene 采用模块化的 monorepo 架构，使用 pnpm workspaces 管理包间依赖，并使用 Nx 来编排构建过程、测试和其他开发任务。选择这种结构是因为它在管理具有多个相互关联的应用程序和库的复杂项目方面具有优势：

*   **代码可重用性**：通用功能（例如，DOM 提取、图像处理、AI 提示实用程序）被封装在共享包中，并在系统的不同部分重用，从而减少了重复并提高了一致性。
*   **简化的依赖管理**：pnpm workspaces 高效地管理本地包之间的依赖关系。
*   **简化的开发工作流程**：Nx 提供了用于管理整个 monorepo 或特定项目的构建、测试和 linting 等任务的工具，从而提高了开发人员的生产力。
*   **原子化更改**：支持在单个提交/PR 中跨多个包/应用程序进行更改，确保了跨系统不同部分的功能的一致性。

### 2.1. Monorepo 结构

代码仓库大致分为两个主要目录，清晰地分离了最终用户应用程序与核心/共享库之间的关注点：

*   **`apps/`**：此目录包含提供面向用户界面或在 Midscene 生态系统中扮演特定角色的应用程序。这些通常是项目的可部署单元。
    *   `chrome-extension`：Midscene Chrome 扩展程序。它充当用户直接在浏览器内与 Midscene 交互（通过“Playground”）的主要界面，并且是“桥接模式”的客户端组件，支持 SDK 驱动的对现有浏览器会话的自动化。
    *   `android-playground`：一个 Web 应用程序，旨在演示和与 Midscene 的 Android 自动化功能进行交互。它可能与 `packages/android` 集成，并可能使用 `scrcpy`（通过 `yadb` 或类似工具）进行屏幕镜像和远程控制。
    *   `report`：一个专门用于显示自动化脚本执行后生成的可视化 HTML 报告的应用程序。这些报告通过显示屏幕截图、执行的操作以及每个步骤的 AI 推理，对于调试至关重要。
    *   `site`：官方文档网站 (midscenejs.com)，使用 Rspress 构建。
*   **`packages/`**：此目录包含提供 Midscene 核心功能、共享实用程序和特定集成的库集合。这些包通常独立发布（例如，发布到 npm），并可供 `apps/` 中的应用程序或基于 Midscene 构建的第三方开发人员使用。
    *   关键库包括 `core`、`shared`、`web-integration`、`android`、`cli`、`evaluation`、`mcp` (Midscene Copilot Package) 和 `visualizer`。

monorepo 的根目录包含配置文件，如 `nx.json`（定义 Nx 任务依赖项和默认值）、`pnpm-workspace.yaml`（定义 pnpm 工作区）、`biome.json`（用于代码格式化和 linting）以及各种构建/测试配置。

### 2.2. 关键组件概述与交互

`packages/` 和 `apps/` 中的主要组件协同工作，以提供 Midscene 全面的自动化功能。交互流程通常从用户界面（CLI、Chrome 扩展程序）或 SDK 使用开始，然后利用集成包（`web-integration`、`android`），这些集成包又利用 `core` 包进行 AI 驱动的逻辑和感知，同时所有这些都依赖于 `shared` 包获取通用实用程序。

*   **`packages/core` (核心逻辑引擎)**：这是 Midscene 的概念核心。
    *   **职责**：负责 AI 驱动的决策过程。这包括针对各种任务（规划、元素定位、数据提取、断言）的高级提示工程、与不同 AI 模型服务（OpenAI、Anthropic、Azure OpenAI 以及通过 `service-caller` 的其他 VLM 提供商）的通信、VLM 输出的适配（如边界框归一化）以及使用 `Insight` 类对 UI 理解进行高级编排。它还定义了 Midscene 的 YAML 自动化语言的模式以及整个系统中使用的丰富 TypeScript 数据结构类型。
    *   **交互**：它使用来自 `packages/shared` 的基本实用程序（例如，用于 DOM 元素表示、图像处理原语）。它提供 AI 和自动化原语，然后由更高级别的包（如 `packages/web-integration`、`packages/android` 和 `packages/cli`）利用这些原语来执行特定于平台的操作。例如，当 `packages/web-integration` 的 `PageAgent` 需要理解页面时，它会向 `packages/core` 的 `Insight` 类提供一个 `UIContext`，然后 `Insight` 类使用其 AI 功能返回可操作的信息。
*   **`packages/shared` (共享实用程序)**：此包是基础工具包，提供 Midscene 所有其他部分所必需的通用功能。
    *   **职责**：其最关键的子组件是 **DOM 元素提取器 (`extractor/`)**，其中包括客户端 JavaScript (`htmlElement.js`，也称为 `midscene_element_inspector`)，该脚本被注入到 Web 浏览器中以解析实时 DOM、识别元素并提取其属性（几何形状、属性、文本）。其他关键职责包括图像处理实用程序（使用 `jimp` 的 `img/`）、具有文件输出功能的命名空间日志记录系统 (`logger.ts`)、集中的环境变量管理 (`env.ts`)、标准化的输出目录管理（用于 `midscene_run` 的 `common.ts`）以及基本数据类型（如 `Rect` 和 `BaseElement` 的 `types/`）。
    *   **交互**：几乎所有其他 `packages/` 和 `apps/` 都导入 `packages/shared`。例如，`packages/web-integration` 使用来自 `shared` 的提取器脚本来理解不同浏览器驱动程序（Playwright、Puppeteer、CDP）的页面结构。`packages/core` 使用 `shared` 的图像实用程序来准备 VLM 输入，并使用其 UI 元素的类型定义。
*   **`packages/web-integration` (Web 自动化层)**：此包管理与 Web 浏览器的所有直接交互。
    *   **职责**：它实现了 `AbstractPage` 接口，为不同的 Web 自动化模式提供具体的策略：
        *   **Playwright 和 Puppeteer 驱动程序**：包含适配器类，允许 Midscene 使用这些流行的 Node.js 自动化库来控制浏览器。这些适配器使用各自驱动程序的 `page.evaluate()` 方法来注入和运行来自 `packages/shared` 的 DOM 提取器。
        *   **Chrome 扩展程序逻辑 (`chrome-extension/`)**：包括 `ChromeExtensionProxyPage`，它使用 Chrome 调试协议 (CDP) 在扩展程序环境中进行细粒度的浏览器控制。
        *   **桥接模式 (`bridge-mode/`)**：实现了 WebSocket (Socket.IO) 桥接的服务器端（`BridgeServer`，通常由 SDK/CLI 运行）和客户端（`ExtensionBridgePageBrowserSide`，在 Chrome 扩展程序中运行）。此桥接允许 Node.js SDK 通过 Chrome 扩展程序远程控制浏览器实例。
    *   **交互**：它使用 `packages/core`（通过编排 AI 任务的 `PageAgent` 类）进行 AI 驱动的决策。它依赖于 `packages/shared` 获取 DOM 提取脚本。它向 `packages/cli` 提供实际的浏览器控制功能以执行 YAML 脚本，并向使用 Midscene SDK 的开发人员提供这些功能。一个典型的流程是：`PageAgent`（在 `web-integration` 中）获取一个任务，使用其 `AbstractPage` 实现捕获页面上下文，将此上下文发送到 `Insight`（在 `core` 中），接收 AI 生成的计划，然后使用 `AbstractPage` 方法执行该计划。
*   **`packages/android` (Android 自动化层)**：
    *   **职责**：提供用于自动化 Android 设备和模拟器的工具和抽象，可能使用 Android 调试桥 (ADB) 进行命令执行，并可能使用 `scrcpy`（通过 `yadb` 或在致谢中提到的类似库）进行屏幕数据捕获和 UI 交互。
    *   **交互**：与 Web 集成类似，它使用 `packages/core` 获取适用于 Android UI 元素的 AI 驱动的自动化逻辑。当执行针对 Android 的 YAML 脚本时，`packages/cli` 会使用它，并且它是 `apps/android-playground` 的后端。
*   **`packages/cli` (命令行界面)**：这是用户运行基于 YAML 的自动化的主要入口点。
    *   **职责**：解析命令行参数（例如，脚本路径、`--headed` 模式）。加载环境配置（来自 `.env` 文件）。发现并解析 YAML 自动化脚本。动态设置适当的执行环境（启动 Puppeteer、通过 `AgentOverChromeBridge` 启动桥接模式，或通过 `agentFromAdbDevice` 连接到 Android 设备）。然后，它使用 `ScriptPlayer`（来自 `packages/web-integration/src/yaml/`）来执行 YAML 流中定义的任务。提供基于终端的反馈。
    *   **交互**：它是 `packages/core`（用于 YAML 模式和间接的 AI 逻辑）、`packages/web-integration`（用于 Web 代理创建和通过 `ScriptPlayer` 执行 YAML）和 `packages/android`（用于 Android 代理创建）的主要使用者。
*   **`apps/chrome-extension` (用户界面和桥接客户端)**：
    *   **职责**：为用户提供易于访问的图形界面。“Playground”允许直接、交互式地自动化当前选项卡。它通过其 Zustand 存储 (`store.tsx`) 管理用户特定的配置（API 密钥、模型选择），并将它们持久化到 `localStorage` 中。至关重要的是，它承载了“桥接模式”的客户端组件 (`ExtensionBridgePageBrowserSide`)，使 SDK/CLI 能够控制浏览器。
    *   **交互**：使用 `packages/web-integration` 的 `ChromeExtensionProxyPage`（用于 CDP 交互）和 `ExtensionBridgePageBrowserSide`（用于桥接客户端逻辑）。它可能会使用来自 `packages/visualizer` 的组件来构建其 UI。在 Playground 模式下，它使用 `PageAgent`（来自 `packages/web-integration`）的实例，而 `PageAgent` 又使用 `packages/core`。
*   **`packages/evaluation` (AI 评估套件)**：
    *   **职责**：包含一系列测试用例、数据集（HTML 页面、UI 场景）和评估脚本。此套件用于系统地评估和基准测试不同 AI 模型在各种 UI 自动化任务（如元素定位准确性、规划有效性和断言正确性）上的性能。
    *   **交互**：它以编程方式使用 `packages/core`、`packages/web-integration` 和 `packages/shared` 来针对不同的 AI 模型和配置运行其评估场景，生成有助于模型选择和改进的数据。
*   **`packages/mcp` (Midscene Copilot Package)**：
    *   **职责**：此包似乎提供了更高级别的抽象或工具，可能用于创建更复杂的、代理式的自动化行为。`prompts.ts`（加载 API 文档和 Playwright 代码示例）的存在表明它在向 AI 模型提供丰富的、结构化的上下文方面发挥作用，可能用于涉及代码生成或复杂 API 交互的任务。
    *   **交互**：可能基于 `packages/core` 和各种集成包（`web-integration`、`android`）的功能来执行其任务。
*   **`packages/visualizer` (UI 组件库)**：
    *   **职责**：提供一组可重用的 React 组件和相关逻辑，用于呈现 Midscene 特定的 UI。这可能包括用于显示自动化报告、可视化元素树或边界框、创建配置界面或 Playground UI 部分的组件。
    *   **交互**：由各种 `apps/` 使用，如 `apps/report`（用于显示报告）、`apps/chrome-extension` 以及可能用于构建其用户界面的 `apps/android-playground`。

整体架构设计注重模块化，允许系统的不同部分（例如，AI 核心、Web 交互、Android 交互、CLI）半独立地开发和维护，同时通过明确定义的包 API 和共享实用程序确保强大的集成。这种关注点分离，在 monorepo 结构的促进下，是管理 AI 驱动的多平台自动化框架复杂性的关键。

## 3. 工作流

Midscene 项目利用 GitHub Actions 来实现其 CI/CD 管道和各种自动化的代码仓库管理任务。这些工作流定义在 `.github/workflows/` 下的 YAML 文件中，对于维护代码质量、确保不同组件的稳定性、自动化发布过程以及管理社区互动至关重要。

### 3.1. CI/CD 管道

持续集成和持续部署 (CI/CD) 管道构成了开发过程的支柱，确保代码更改能够自动构建、测试并准备发布。这主要由 `ci.yml` 和 `release.yml` 管理。

#### `ci.yml` (持续集成)

*   **触发器**：此工作流在每次向 `main` 分支 `push` 事件以及每个针对 `main` 分支的 `pull_request` 事件时自动执行。这确保了所有提议的更改和合并都得到验证。
*   **目的**：`ci.yml` 的主要目标是保护代码库的完整性。它通过自动构建 monorepo 中的所有包和应用程序，并运行全面的测试套件来及早发现回归或集成问题来实现这一目标。
*   **关键步骤**：
    1.  **环境设置**：首先设置特定的 Node.js 执行环境（例如，版本 18.19.0）并安装 pnpm 包管理器（例如，版本 9.3.0），用于 monorepo 中的依赖管理。
    2.  **依赖缓存**：为了优化构建时间，特别是对于经常使用的大型依赖项，它会缓存 Puppeteer 浏览器二进制文件。
    3.  **依赖安装**：使用 `pnpm install --frozen-lockfile --ignore-scripts` 安装所有项目依赖项。`--frozen-lockfile` 标志确保使用 `pnpm-lock.yaml` 中指定的精确依赖版本，从而实现可重现的构建。`--ignore-scripts` 标志可以防止潜在的不需要的安装后脚本运行。
    4.  **浏览器安装**：安装 Puppeteer 测试所需的 Chrome 浏览器实例。特别指出这是供处理浏览器交互的 `packages/web-integration` 组件使用的。
    5.  **项目构建**：使用 `pnpm run build` 命令构建整个 monorepo，包括所有应用程序和包，这很可能由 Nx 编排。
    6.  **测试**：使用 `pnpm run test` 执行主测试套件。此命令将运行单元测试、集成测试以及可能在各个包中定义的其他检查。
*   **环境变量**：工作流配置为使用诸如 `OPENAI_API_KEY`、`OPENAI_BASE_URL` 和 `MIDSCENE_MODEL_NAME` 之类的机密信息。这表明自动化测试套件的某些部分可能涉及对 AI 模型进行实时调用，需要有效的 API 凭据以确保依赖 AI 的功能正常工作。

#### `release.yml` (持续部署/发布)

*   **触发器**：与 CI 工作流不同，发布过程由维护人员通过 GitHub 的 `workflow_dispatch` 事件手动启动。这提供了对发布时间的控制。触发器需要两个输入：
    *   `version`：发布的版本增量类型（例如，`minor`、`patch`、`preminor`、`prepatch`），用于指导版本控制脚本。
    *   `branch`：应从中创建发布的特定分支，默认为 `main`。
*   **目的**：此工作流自动化了创建新软件版本的复杂且多步骤的过程。这包括版本升级、在 Git 中标记发布、将包发布到 npm 注册表以及打包可分发工件（如 Chrome 扩展程序）。
*   **关键步骤**：
    1.  **代码检出**：工作流从指定的 `branch` 检出源代码。
    2.  **受保护分支推送**：它使用第三方 GitHub Action (`zhoushaw/push-protected`)，这表明发布过程可能需要将更改（如 `package.json` 文件中的版本升级或新标签）推送到受保护的分支，这需要特殊权限。
    3.  **环境设置**：与 CI 类似，它设置 Node.js 和 pnpm。
    4.  **依赖管理**：确保所有依赖项（包括 Puppeteer）都已安装并缓存。
    5.  **浏览器安装**：为 `packages/web-integration` 安装 Chrome 浏览器，可能用于构建时任务或验证。
    6.  **自定义发布脚本执行**：一个关键步骤是运行 `node ./scripts/release.js --version=<version_input>`。这个自定义脚本封装了核心发布逻辑：
        *   更新 monorepo 中 `package.json` 文件中的版本号。
        *   为新版本创建 Git 标签。
        *   将相关的公共包（例如，`@midscene/core`、`@midscene/cli`）发布到 npm 注册表。
    7.  **NPM 身份验证**：工作流使用 `NPM_TOKEN` 机密信息向 npm 注册表进行身份验证，允许其发布包。
    8.  **工件生成和上传**：成功发布后，它会打包来自 `apps/chrome-extension/extension_output` 目录的 Chrome 扩展程序，并将其作为名为 `chrome_extension` 的构建工件上传。此工件通常附加到相应的 GitHub 版本，方便用户下载。

### 3.2. AI 相关工作流

鉴于 Midscene 以 AI 为中心的特性，存在专门的工作流来测试和评估其 AI 组件。这些工作流通常与称为“豆包”的 AI 服务交互，使用配置为机密信息的特定 API 令牌和基本 URL。

#### `ai-evaluation.yml`

*   **触发器**：通过 `workflow_dispatch` 手动触发，允许维护人员选择特定分支进行评估（默认为 `main`）。
*   **目的**：系统地评估 AI 模型在一组预定义的 UI 自动化任务上的性能。这有助于跟踪模型改进、回归，并对不同的模型或提示策略进行基准测试。
*   **关键步骤**：
    1.  标准环境设置（Node.js、pnpm）和依赖安装。
    2.  完整的项目构建。
    3.  执行位于 `packages/evaluation` 目录中的专门评估脚本。这些脚本针对不同的 AI 功能：
        *   `pnpm run evaluate:locator`：测试 AI 基于描述准确定位 UI 元素的能力。
        *   `pnpm run evaluate:planning`：评估 AI 根据用户指令生成逻辑且有效的操作计划的能力。
        *   `pnpm run evaluate:assertion`：评估 AI 根据给定断言验证 UI 状态的正确性。
    4.  来自这些评估的详细日志和原始 AI 响应从 `packages/evaluation/tests/__ai_responses__/` 存档，并作为名为 `evaluation-logs` 的构建工件上传。这些数据对于离线分析模型行为至关重要。
*   **环境变量**：此工作流专门配置为使用豆包 AI 服务，包含诸如 `DOUBAO_TOKEN`、`DOUBAO_BASE_URL` 之类的机密信息，并明确将 `MIDSCENE_MODEL_NAME` 设置为豆包模型（例如，'doubao-1-5-thinking-vision-pro-250428'）和 `MIDSCENE_USE_DOUBAO_VISION: 1`。

#### `ai-unit-test.yml`

*   **触发器**：每次向 `main` 分支 `push` 时自动运行，也可以针对特定分支手动调度。
*   **目的**：执行专门设计用于验证 AI 模型在 Midscene 核心逻辑中的集成和功能的单元测试。这些测试可能比更广泛的 E2E 或评估套件更具针对性。
*   **关键步骤**：
    1.  环境设置，包括安装 Puppeteer 浏览器，因为 AI 单元测试可能涉及 `packages/web-integration`。
    2.  通过 `pnpm run test:ai` 执行 AI 特定的单元测试。
    3.  测试输出和报告从 `packages/web-integration/midscene_run/report` 上传。
*   **环境变量**：也利用与豆包相关的机密信息，表明这些单元测试可能会对 AI 服务进行实时调用。

#### `ai.yml` (用于 AI 的 Playwright E2E)

*   **触发器**：与 `ai-unit-test.yml` 类似，它在向 `main` 分支 `push` 时运行，或者可以手动调度。
*   **目的**：使用 Playwright 作为浏览器自动化驱动程序，对 AI 驱动的功能进行全面的端到端 (E2E) 测试。这确保了 AI 组件在完整的应用程序流程中正常工作。
*   **关键步骤**：
    1.  环境设置，包括缓存 Playwright 和 Puppeteer 依赖项以加快运行速度。
    2.  安装 Playwright 及其浏览器依赖项，以及 Puppeteer 浏览器。
    3.  执行多个 E2E 测试套件，可能针对不同的功能或配置：`pnpm run e2e`、`pnpm run e2e:cache`、`pnpm run e2e:report`。
    4.  来自这些 E2E 测试运行的详细报告从每个套件的 `packages/web-integration/midscene_run/report` 上传。
*   **环境变量**：利用相同的豆包 AI 服务凭据。

### 3.3. 代码仓库管理工作流

为了维护健康高效的开发环境，Midscene 采用了几个工作流来自动化常见的代码仓库管理和社区交互任务。

#### `lint.yml`

*   **触发器**：在针对 `main` 分支的 `push` 和 `pull_request` 事件上运行。
*   **目的**：在整个代码库中强制执行代码风格一致性，并在开发周期的早期发现潜在的语法错误或代码质量问题。
*   **关键步骤**：
    1.  标准环境设置。
    2.  `pnpm run check-dependency-version`：一个自定义脚本，用于验证 monorepo 中所有包的依赖版本是否一致，防止潜在的版本冲突。
    3.  `npx biome check . --diagnostic-level=warn --no-errors-on-unmatched`：执行 Biome，一个现代化的格式化程序和 linter，用于分析代码库的风格违规和潜在问题。
*   **环境变量**：此工作流使用 `MIDSCENE_OPENAI_INIT_CONFIG_JSON` 和 `MIDSCENE_OPENAI_MODEL` 机密信息。这对于 linting 工作流来说不寻常，可能意味着某些自定义 linting 规则或提交前检查可能与 AI 配置字符串格式或类似内容有关，尽管这在没有深入检查 linting 设置本身的情况下是推测性的。

#### `issue-labeled.yml`

*   **触发器**：每当向 GitHub issue 添加标签时激活。
*   **目的**：自动化对 issue 标签的标准化响应，特别是对于需要报告者提供更多信息的 issue。
*   **关键步骤**：具体来说，如果 `web-infra-dev/midscene` 代码仓库中的 issue 被分配了 `need reproduction` 标签，GitHub Action (`actions-cool/issues-helper`) 会自动发布一条评论。此评论通常要求用户提供其报告问题的最小可复现示例，并链接到有关为何需要复现的指南。

#### `issue-close-require.yml`

*   **触发器**：这是一个计划工作流，每天午夜 UTC (`cron: '0 0 * * *'`) 运行。
*   **目的**：自动关闭那些已被标记为 `need reproduction` 但在一段时间后仍未收到报告者所要求信息的过时 issue。这有助于保持 issue 跟踪器的清洁并专注于可操作的项目。
*   **关键步骤**：如果 `web-infra-dev/midscene` 代码仓库中的 issue 具有 `need reproduction` 标签并且在 5 天内保持不活动（没有新评论），`actions-cool/issues-helper` 操作会自动关闭该 issue 并附带解释性评论。

#### `pr-label.yml`

*   **触发器**：当打开新的 pull request 或编辑现有 pull request 的标题或正文时激活。
*   **目的**：根据 pull request 的内容（例如，标题或正文中的关键字）自动应用标签。这有助于对 PR 进行分类，将其路由到适当的审阅者，并简化审阅过程。
*   **关键步骤**：使用 `github/issue-labeler` 操作，该操作从 `.github/pr-labeler.yml` 读取其配置。此配置文件定义了要应用的模式和相应的标签。

### 3.4. 工作流中的整体数据流和控制流

Midscene 中的 GitHub Actions 工作流创建了一个内聚的自动化系统，支持从初始代码提交到发布和持续维护的整个开发生命周期。这种自动化对于具有多个包并依赖外部 AI 服务的复杂项目至关重要。

**开发和集成管道**始于开发人员推送代码或创建 pull request。这些操作会立即触发 `ci.yml`（执行基本的构建和测试例程）和 `lint.yml`（强制执行代码质量和风格）。对于特别影响 AI 功能的更改，尤其是合并到 `main` 分支的更改，`ai-unit-test.yml` 和 `ai.yml`（Playwright E2E 测试）工作流提供了额外的验证层，确保核心 AI 驱动的功能保持稳健。这种集成方法确保合并到 `main` 分支的代码经过充分测试并符合项目标准。

**发布管理**是一个通过 `release.yml` 启动的受控手动过程。维护人员触发此工作流，提供版本控制信息。然后，工作流会自动执行检出指定分支、运行自定义发布脚本 (`scripts/release.js`)（可能管理 monorepo 中 `package.json` 文件中的版本增量）、创建 Git 标签以及将更新的公共包发布到 npm 注册表等复杂步骤。此过程的一个重要成果是从其构建输出 (`apps/chrome-extension/extension_output`) 中打包 `chrome-extension`，然后将其作为 GitHub 发布工件上传，以供分发。

通过 `ai-evaluation.yml` 工作流持续监控 **AI 模型的性能和可靠性**。这允许维护人员针对 `packages/evaluation` 中定义的一套基准测试任务，对 AI 模型（根据当前配置，目前强调“豆包”模型）进行有针对性的评估。详细的日志和原始 AI 响应被存档，有助于深入分析模型行为、跟踪回归以及比较评估不同 AI 解决方案或提示策略。

CI/CD 设置还揭示了**组件间的依赖关系和构建要求**。例如，`packages/web-integration` 经常参与各种测试场景，需要在 CI 作业中设置浏览器环境（Puppeteer、Playwright）。`apps/chrome-extension` 显然是一个关键的可交付成果，其在发布工作流中的特定打包步骤证明了这一点。`packages/evaluation` 是 AI 评估工作流的测试用例和脚本的来源。以 AI 为中心的工作流也强调了项目对外部 AI 服务的依赖，API 密钥和模型配置通过 GitHub 机密信息进行安全管理。

最后，通过自动化工作流简化了**代码仓库的健康状况和社区互动**。`issue-labeled.yml` 和 `issue-close-require.yml` 自动化了对 issue 的响应和生命周期管理，特别是对于需要用户提供复现信息的 issue。`pr-label.yml` 有助于 PR 分类。这些自动化节省了维护人员的时间，并确保了对社区贡献和错误报告的一致处理。

总而言之，这一套 GitHub Actions 工作流构成了一个强大的自动化基础设施，通过确保代码质量、简化发布过程、对关键 AI 组件进行严格测试以及高效管理代码仓库活动和社区贡献，为 Midscene 的开发提供支持。

## 4. AI 模型集成

系统理解和与网页交互的能力得益于其与各种 AI 模型的复杂集成。本节详细介绍所使用的模型、提示的生成方式、与 AI 服务的通信以及关键的提示工程技术。主要逻辑位于 `packages/core/src/ai-model/`（包括 `prompt/` 和 `service-caller/` 子目录）和 `packages/mcp/src/prompts.ts`。

### 4.1. 使用的模型

Midscene 设计灵活，允许用户根据其特定需求、访问权限和自动化任务的性质从各种 AI 模型中进行选择。随着 AI 领域的快速发展，这种适应性至关重要。

*   **明确指定的默认模型**：`gpt-4o` 在 `service-caller/index.ts` 中被指定为默认模型。这表明它是一个经过充分测试的通用选项，以其强大的多模态能力而闻名，使其适用于涉及文本理解和图像分析的广泛任务。
*   **可配置模型**：AI 模型的选择主要由环境变量决定：
    *   `MIDSCENE_MODEL_NAME`：此变量允许用户为主要基于语言或涉及复杂推理的任务（例如高级规划或理解细微的用户指令）指定主要模型名称。
    *   `vlLocateMode`：这个关键环境变量表示使用视觉语言模型 (VLM)，并决定如何处理来自屏幕截图的视觉信息以执行元素定位等任务。Midscene 包含针对几种 VLM 的特定处理逻辑：
        *   **Qwen-VL**：通过设置 `MIDSCENE_USE_QWEN_VL` 激活。Qwen-VL 模型以其强大的视觉理解能力而闻名，尤其适用于可能包含混合语言或复杂布局的 UI。
        *   **Gemini**：当 `vlMode` 设置为 `'gemini'` 时推断。谷歌的 Gemini 系列模型也提供强大的多模态功能，适用于 UI 解释。
        *   **Doubao-Vision**：当 `vlMode` 设置为 `'doubao-vision'` 时推断。这可能指的是字节跳动的模型，可能针对某些类型的 UI 理解任务或特定的视觉风格进行了优化。
        *   **UI-TARS**：通过 `MIDSCENE_USE_VLM_UI_TARS` 激活，或者当 `vlLocateMode()` 返回 `'vlm-ui-tars'` 时激活。UI-TARS 似乎是一个独特的模型（或模型系列，包括版本 1.0、1.5 以及特定的豆包变体，如 1.5-15B/20B），具有其自身的专用提示策略、需要由 `@ui-tars/action-parser` 解析的独特文本输出格式，以及对图像输入的特定考虑（例如调整到特定尺寸）。对于要求非常精确、结构化输出以执行更简单操作的场景，可能会首选 UI-TARS。
    *   通用多模态模型（如 GPT-4o）和专用 VLM 之间的选择通常取决于具体任务。VLM 可能擅长直接从像素精确识别元素并理解 UI 中的空间关系，而文本上下文最少。即使具有多模态功能的高级 LLM，也可能更适合复杂的多步骤规划、理解细微或模糊的自然语言指令，或作为自动化序列的一部分生成代码/文本。
*   **服务提供商的 SDK 抽象**：为了进一步增强灵活性并允许用户利用来自不同提供商的模型，Midscene 抽象了与 AI 模型服务的直接交互：
    *   **OpenAI 兼容 API**：系统使用 `openai` npm 包与 OpenAI 的模型（如 GPT-3.5、GPT-4、GPT-4o）以及任何其他遵循 OpenAI API 接口的第三方或自托管模型进行通信。这还包括对 Azure OpenAI 服务的强大支持，可以通过诸如 `MIDSCENE_USE_AZURE_OPENAI`、`AZURE_OPENAI_ENDPOINT`、`AZURE_OPENAI_KEY`、`AZURE_OPENAI_API_VERSION` 和 `AZURE_OPENAI_DEPLOYMENT` 之类的变量进行配置。这使得使用 Azure 的企业能够在其现有云基础设施中集成 Midscene。
    *   **Anthropic 模型**：通过 `@anthropic-ai/sdk` 包集成了 Anthropic 的模型（例如 Claude 系列），这些模型以其强大的语言理解和生成能力而闻名，使用环境变量 `MIDSCENE_USE_ANTHROPIC_SDK` 和 `ANTHROPIC_API_KEY` 进行配置。

使用通用接口（主要基于 OpenAI 的 `ChatCompletionMessageParam` 类型来构建提示，以及用于预期任务特定响应的自定义 TypeScript 接口，例如 `PlanningAIResponse`、`AIElementLocatorResponse`）可以在一定程度上实现互换性。这种设计简化了将来添加新 AI 模型或服务提供商的潜力，因为只需要对 `service-caller` 中的客户端创建和特定参数映射进行重大更改。

### 4.2. 提示生成

有效的提示工程对于利用 AI 模型进行 UI 自动化的能力至关重要。Midscene 将其核心逻辑的很大一部分（主要在 `packages/core/src/ai-model/prompt/` 内）用于精心制作详细且上下文丰富的提示，旨在从 AI 中引出准确且可操作的响应。目标是将用户意图和 UI 状态转换为 AI 可以有效处理的语言。

#### 4.2.1. 核心实用程序：`describeUserPage`

提示生成的一个基本要素，特别是对于那些受益于对 UI 结构进行文本理解的模型而言，是位于 `packages/core/src/ai-model/prompt/util.ts` 中的 `describeUserPage` 函数。
*   **输入**：它接收当前的 `UIContext` 对象，该对象封装了特定时刻网页的状态。此上下文包括最新的屏幕截图（作为 base64 字符串）、元素树（先前由 `packages/shared/src/extractor` 中的 `midscene_element_inspector` 脚本提取）以及整体页面尺寸。
*   **输出**：它生成页面的详细文本表示。其中一个关键部分是由 `descriptionOfTree` 函数（来自 `packages/shared/src/extractor/tree.ts`）生成的序列化的、类似 DOM 的元素树结构。此树字符串详细说明了元素类型（例如，`<button>`、`<input>`）、由 Midscene 分配的唯一 ID（例如，`id="a1b2c"`）、重要的 HTML 属性（class、name 等）、可见的文本内容以及边界框坐标。
    *   例如，一个按钮在提示中可能表示为：`<button id="btn-login1" markerId="5" class="btn primary" left="100" top="200" width="80" height="30">Login</button>`。`markerId` 对应于可以绘制在屏幕截图上供人工调试或供可以交叉引用模型的视觉标签。
*   **目的**：UI 的这种文本表示随后嵌入到发送给 AI 的提示中。它为元素定位（特别是对于非 VLM 模型或当 VLM 需要根据文本或属性帮助消除歧义时）、理解元素关系和操作规划等任务提供了必要的上下文。对于 VLM，虽然图像是主要的，但这种文本上下文对于将视觉理解与特定属性或文本内容联系起来仍然很有价值。

#### 4.2.2. 特定任务的提示

Midscene 采用针对特定 AI 任务量身定制的不同提示策略。这些策略定义在 `packages/core/src/ai-model/prompt/` 内的各种文件中，每个文件都包含系统提示、用户提示构建逻辑，并且通常包含预期输出的 JSON 模式。系统提示设定 AI 的角色、能力和约束，而用户提示则提供具体的任务和页面上下文。

*   **规划 (`llm-planning.ts`)**：用于根据用户指令生成多步骤操作计划。
    *   `systemPromptToTaskPlanning`：构建系统提示，设定 AI 的角色（例如，“软件 UI 自动化领域的全能专业人士”）、其目标（分解指令、定位元素、制定操作）、支持的操作列表（Tap、Input、Scroll、KeyboardPress 等）及其预期参数，以及所需的 JSON 输出模式（由 `planSchema` 定义）。例如，一个操作可能被描述为：`Input: { type: "Input", locate: { id: string, prompt: string }, param: { value: string } }`。
    *   此函数通常具有针对 VLM (`systemTemplateOfVLPlanning`) 的不同模板（可能指示其更直接地处理视觉信息并输出定位元素的边界框）和非 VLM LLM (`systemTemplateOfLLM`) 的不同模板（后者将更严重地依赖来自 `describeUserPage` 的文本页面描述和元素 ID）。
    *   一个非 VLM 规划系统提示的概念性片段可能如下所示：“给定页面描述：`[来自 describeUserPage 的序列化页面树]` 和用户指令：`[用户的目标]`，生成一个 JSON 操作数组。支持的操作有：`TAP(elementId)`、`INPUT(elementId, text)`...”
*   **元素定位 (`llm-locator.ts`)**：用于根据自然语言描述识别特定的 UI 元素。
    *   `systemPromptToLocateElement`：此系统提示指示 AI 如何识别元素。VLM 版本通常被要求返回已识别元素的边界框 (`bbox`)。非 VLM 版本则期望返回文本页面描述中提供的元素列表中的唯一 `id`。提示通常包含预期 JSON 输出的示例（例如，`{"elements": [{"id": "...", "reason": "..."}], "errors": []}`）以指导模型。
*   **区域定位 (`llm-section-locator.ts`)**：主要与 VLM 一起使用，以识别页面上更大的、具有语义意义的区域（例如，“产品详细信息区域”、“主导航栏”）。这是一种“深度思考”或集中注意力的形式。
    *   `systemPromptToLocateSection` 和 `sectionLocatorInstruction`：指导 VLM 输出所描述区域的主要边界框，以及可选的、有助于定义该区域上下文的相关参考元素的边界框。首先识别一个区域有助于缩小后续更细粒度元素定位任务的搜索范围，从而提高在视觉密集页面上的准确性和效率。
*   **断言 (`assertion.ts`)**：用于对 UI 状态执行布尔断言（例如，“登录按钮是否可见且已启用？”）。
    *   `systemPromptToAssert`：指示 AI 根据当前屏幕截图和页面上下文验证给定语句，并以布尔 `pass` 状态和解释其推理的 `thought` 进行响应（例如，`{"pass": true, "thought": "登录按钮可见且已启用。"}`）。
*   **数据提取 (`extraction.ts`)**：用于根据查询从 UI 中提取结构化信息或特定文本。
    *   `systemPromptToExtract`：指导 LLM 根据用户定义的模式（在提示的 `DATA_DEMAND` 部分提供，例如 `{"productName": "string", "price": "number"}`）或自然语言查询（例如，“提取所有产品名称及其价格”）提取数据。它强调遵守指定的数据类型。
*   **元素描述 (`describe.ts`)**：用于生成特定 UI 元素（通常是通过坐标或视觉标记预先识别的元素）的人类可读的自然语言描述。
    *   `elementDescriberInstruction`：提示 LLM 描述元素的关键特征：其内容、视觉外观（如果是图像或图标）、相对于附近其他元素的位置以及任何其他区别性特征。这对于生成测试断言、日志记录或在初始定位尝试不明确时重新提示非常有用。
*   **UI-TARS 特定提示 (`ui-tars-planning.ts`, `ui-tars-locator.ts`)**：这些文件为 UI-TARS 模型提供专门的提示模板。这些提示在其定义的操作空间（例如，`click(start_box='[x1, y1, x2, y2]')`，其中坐标可能以不同方式归一化）方面存在显著差异，并且期望的是结构化的文本输出（然后由 `@ui-tars/action-parser` 库解析），而不是直接的 JSON。这突显了 Midscene 对具有不同输出模式的模型的适应性。

#### 4.2.3. 外部上下文注入 (`packages/mcp/src/prompts.ts`)

为了增强 AI 的理解和能力，特别是对于可能涉及生成代码（如 Playwright 测试片段）或与特定 API 交互的任务，Midscene 可以将外部上下文信息注入到提示中。
*   `packages/mcp/src/prompts.ts` 文件通过加载以下内容来演示这一点：
    *   `API.mdx`：这可能包含 Midscene 本身或自动化脚本可能需要与之交互的 Web 服务的 API 文档。
    *   `playwright-example.txt`：这提供了 Playwright 代码的示例，如果 AI 的任务是生成或协助编写 Playwright 测试脚本，这将非常宝贵。
*   此文本内容被导出（例如，作为 `PROMPTS.MIDSCENE_API_DOCS` 和 `PROMPTS.PLAYWRIGHT_CODE_EXAMPLE`）并且可以动态插入到主提示中，例如，通过规划任务中的 `actionContext` 参数（如 `packages/core/src/ai-model/llm-planning.ts` 中所示）。这为 LLM 提供了相关的领域特定知识或编码模式，从而提高了其生成的计划或代码片段的质量和相关性。

通过将来自 `describeUserPage` 的详细 UI 上下文与特定于任务的指令、示例和可选的外部知识相结合，Midscene 旨在创建高效的提示，引导 AI 模型准确执行复杂的 UI 自动化任务。

### 4.3. 与 AI 服务的通信

`packages/core/src/ai-model/service-caller/index.ts` 模块是负责与 Midscene 支持的各种 AI 模型服务进行所有直接通信的集中组件。它充当抽象层，简化了核心系统其余部分的交互，并处理了不同 AI 提供商 API 的细微差别。

*   **客户端创建 (`createChatClient`)**：此函数充当 AI 服务客户端的工厂。
    *   它动态实例化 OpenAI 客户端（使用 `openai` npm 包）或 Anthropic 客户端（使用 `@anthropic-ai/sdk`）。选择取决于环境变量配置，例如 `MIDSCENE_USE_AZURE_OPENAI`（用于 Azure OpenAI）、`MIDSCENE_USE_ANTHROPIC_SDK`，或者如果存在 `OPENAI_API_KEY`，则默认为标准 OpenAI。这允许用户轻松地在提供商之间切换。
    *   它使用必要的凭据（API 密钥）、服务端点（自托管模型的基础 URL 或专用 API 网关）、Azure 特定的部署详细信息（端点、API 版本、部署名称，从诸如 `AZURE_OPENAI_ENDPOINT` 之类的变量中检索）以及如果需要的话代理设置（`MIDSCENE_OPENAI_HTTP_PROXY`、`MIDSCENE_OPENAI_SOCKS_PROXY`）来仔细配置所选客户端。这种全面的配置确保了在各种网络环境中的连接性。
*   **核心 API 调用函数 (`call`)**：这是模块中处理向所选 AI 模型实际分派请求的主要私有异步函数。
    *   它接收准备好的消息数组（包括设置上下文的系统提示和包含特定任务和页面信息的用户提示，其中用户提示可以包含复杂结构，如文本数组和 VLM 的 base64 编码图像数据）。
    *   它透明地管理 OpenAI 和 Anthropic 服务之间请求/响应格式和 SDK 特性的差异。例如，如果 Anthropic 是活动提供商，它会正确格式化 Anthropic 消息 API 的图像内容，确保图像数据与目标模型的输入要求兼容。
    *   它设置常见的 LLM 参数，如 `temperature`（对于大多数任务通常为 0.1，以鼓励事实和确定性响应，但对于 UI-TARS 等精度任务可以为 0.0，以减少随机性）和 `max_tokens`（默认为 2048，但可通过 `OPENAI_MAX_TOKENS` 环境变量配置以控制响应长度和成本）。
    *   在必要时，它还可以包含特定于模型的参数，例如 Qwen-VL 模型的 `vl_high_resolution_images: true`，以启用其更高分辨率的图像处理模式，从而可能提高在详细 UI 上的准确性。
*   **面向 JSON 的调用 (`callToGetJSONObject`)**：这个导出的异步函数是 `call` 的一个专门包装器。它是 Midscene 中大多数交互的首选方法，因为它专为那些期望从 AI 获得 JSON 对象输出格式的任务而设计，这对于诸如操作计划或定位的元素属性之类的结构化数据很常见。
    *   它尝试通过在 API 调用中设置 `response_format: { type: "json_object" }` 参数来在兼容的 AI 模型（如较新的 GPT 版本，如 GPT-4 Turbo 和 GPT-4o）中启用“JSON 模式”。这指示模型将其输出限制为有效的 JSON，从而显著提高解析响应的可靠性。
    *   对于某些操作和特定模型（特别是支持通过类似函数调用机制进行结构化输出的 GPT-4 旧版本，或者当需要非常特定的模式时），它可以提供特定的 JSON 模式（例如用于规划任务的 `planSchema` 或用于元素定位的 `locatorSchema`，这些模式从 `prompt/` 目录导入）。这进一步指导 AI 生成结构正确的、与 Midscene 定义的预期模式相匹配的 JSON 输出。
*   **稳健的 JSON 解析**：认识到 AI 生成的 JSON 有时可能包含轻微的语法错误（例如，尾随逗号、不正确的引号）或嵌入在其他文本（如解释或 markdown）中，该模块采用了稳健的解析策略：
    *   `extractJSONFromCodeBlock`：此实用程序预处理 AI 的原始文本响应。如果 AI 将 JSON 内容包装在 markdown 代码块中（例如，\`\`\`json ... \`\`\`）或者整个响应似乎是纯 JSON 字符串，它首先尝试提取 JSON 内容。
    *   `safeParseJson`：此函数接收来自 `extractJSONFromCodeBlock` 的（可能已清理的）字符串，并尝试使用标准的 `JSON.parse()` 对其进行解析。如果由于轻微的语法问题导致此严格解析失败，它会回退到使用 `dJSON.parse()`（来自 `dirty-json` 库）。`dJSON` 对常见的 AI 生成的 JSON 错误更具容忍性，从而增加了成功解析略有瑕疵的响应的机会。
    *   `preprocessDoubaoBboxJson`：包含一个特定于模型的预处理步骤，用于在尝试将豆包视觉模型可能返回的边界框坐标字符串解析为 JSON 之前对其进行清理和重新格式化。这处理了特定模型的已知输出怪癖，使集成更加无缝。
*   **错误处理和调试**：`service-caller` 模块包含用于 API 通信失败（例如，网络错误、身份验证问题、速率限制）的 try-catch 块，并且如果启用了调试（使用 `@midscene/shared/logger` 系统），则会记录详细的错误信息。此外，还支持与 LangSmith 集成以进行 LLM 调用的高级跟踪和调试，可以通过设置 `MIDSCENE_LANGSMITH_DEBUG` 环境变量来激活。这允许开发人员检查 LLM 交互的完整链以进行故障排除。

`ai-model/` 目录中的更高级别函数，例如 `inspect.ts`（用于定位元素、断言 UI 状态）和 `llm-planning.ts`（用于生成操作计划）中的函数，通常使用 `callAiFn`（`callToGetJSONObject` 的导出包装器）与配置的 AI 模型进行交互。这确保了所有 AI 通信都通过这个稳健且适应性强的层进行集中管理，从而为应用程序的其余部分抽象了处理多个 AI 提供商及其特定 API 的复杂性。

### 4.4. 提示工程和优化技术

Midscene 采用了一系列复杂的提示工程和优化技术，以最大限度地提高 AI 模型响应的质量、可靠性和相关性。这些策略对于将模糊的自然语言或复杂的 UI 状态转换为可操作的 AI 输出至关重要。

*   **角色扮演**：为 LLM 分配特定角色（例如，“您是一位在软件 UI 自动化领域经验丰富的专业人士”，“您是一位软件页面图像……分析专家”）有助于引导模型的响应，使其与预期的领域专业知识和任务要求保持一致。这会产生更专注和上下文更合适的输出。
*   **详细说明和约束**：提示包括明确的目标、适用的分步工作流程、支持的操作或输出格式的明确定义，以及对 AI 应该做什么或不应该做什么的约束。这减少了模糊性并引导模型朝着期望的结果发展，最大限度地减少了不相关或不正确的响应。例如，规划提示会仔细列出每种支持的操作类型及其参数。
*   **少样本示例/上下文学习**：对于复杂任务，如操作规划 (`llm-planning.ts`) 或元素识别 (`llm-locator.ts`)，提示通常包含输入输出对的具体示例。这种技术通过提供演示来帮助模型理解所需的格式、推理过程和详细程度，使其更有可能正确地推广到新的、未见过的输入。
*   **JSON 输出强制执行**：为了确保结构化和机器可读的输出（这对于编程使用至关重要）：
    *   明确指示模型以 JSON 格式返回响应。
    *   对于兼容的 OpenAI 模型，通过提供特定的 JSON 模式（例如 `planSchema`、`locatorSchema`）来启用“JSON 模式”，这会约束模型生成符合定义结构的语法正确的 JSON。这显著提高了可靠性并减少了对复杂字符串解析的需求。
    *   采用稳健的客户端解析（使用 `safeParseJson`，它结合了标准的 `JSON.parse` 和更宽松的 `dJSON.parse`）来处理模型偶尔可能产生的与严格 JSON 语法的轻微偏差。
*   **思维链 (CoT) 鼓励**：一些提示在预期的 JSON 输出中包含诸如 `"thought": string` 之类的字段，或者要求提供诸如 `"what_the_user_wants_to_do_next_by_instruction": string` 之类的解释性字段。虽然并非总是显式的多步骤 CoT 提示（模型在其中展示其工作过程），但这些提示鼓励模型输出其推理过程或内部状态。这可以提高最终操作的准确性，并通过使 AI 的“思考”更加透明来极大地帮助调试意外行为。
*   **丰富的上下文信息**：提供全面的上下文是获得良好 AI 性能的关键：
    *   **视觉上下文**：屏幕截图是 VLM 的主要输入。对于非 VLM 场景或作为补充数据，图像会通过编程方式用元素边界和标签进行标记（来自 `ai-model/common.ts` 的 `markupImageForLLM`）。此外，可以裁剪页面的特定部分（`ai-model/inspect.ts` 中的 `AiLocateSection`）以便为后续更详细的任务提供集中的视觉上下文，从而减少 VLM 的干扰并可能提高在密集 UI 上的准确性。
    *   **文本 UI 表示**：`describeUserPage` 实用程序 (`core/src/ai-model/prompt/util.ts`) 生成 UI 元素、其属性及其层次结构的详细文本描述，提供了一种机器可读的格式，可以补充视觉数据，特别是对于 LLM 或需要有关属性或文本内容的细粒度详细信息时。
    *   **历史上下文**：对于顺序任务，`previous_logs`（已执行操作及其结果的历史记录）包含在规划提示中，以告知模型自动化的当前状态并防止冗余或顺序错误的操作。
    *   **领域知识**：如第 4.2.3 节所述，可以将来自 `packages/mcp/src/prompts.ts` 的外部信息（如 API 文档 (`API.mdx`) 或代码示例 (`playwright-example.txt`)）注入到提示中。这提供了相关的领域特定上下文，增强了 AI 生成适当计划或代码片段的能力，例如，在自动化涉及与特定 Web API 交互或以特定格式生成测试代码的任务时。
*   **VLM 特定适配**：
    *   提示针对 VLM 进行了定制，以直接解释屏幕截图并输出视觉参考，主要是元素的边界框 (`bbox`)。
    *   实现了重要的后处理逻辑（例如，`ai-model/common.ts` 中的 `adaptBbox`、`fillBboxParam`、`adaptQwenBbox`、`adaptDoubaoBbox`、`adaptGeminiBbox`）以规范化来自各种 VLM 的边界框数据。这一点至关重要，因为不同的 VLM 可能使用不同的坐标系（例如，归一化的 [0-1] 与绝对像素，[xmin, ymin, xmax, ymax] 与 [ymin, xmin, ymax, xmax]）或具有略微不一致的输出格式。这种规范化确保下游组件无论使用哪种特定的 VLM 都能接收到标准化格式的坐标。
*   **结构化输入格式化**：在提示中使用类似 XML 的标签（例如，`<instruction>`、`<PageDescription>`、`<DATA_DEMAND>`）有助于为 LLM 清晰地描述不同类型的输入信息。这使得模型更容易解析和理解各种上下文片段的不同角色和重要性，从而提高理解能力和响应质量。
*   **语言控制**：`getPreferredLanguage()` 实用程序（来自 `packages/shared/src/env.ts`）允许 Midscene 以特定语言（例如，中文或英文）请求 AI 响应。这用于诸如元素描述 (`describe.ts`) 或 UI-TARS 模型断言之类的任务的提示中，以满足国际化需求并确保 AI 生成的文本适合用户。
*   **迭代优化（例如，先 `AiLocateSection` 后 `AiLocateElement`）**：对于复杂的视觉搜索任务，Midscene 可以采用两步过程。首先，`AiLocateSection` 识别与查询相关的常规页面区域。然后，`AiLocateElement` 在这个经过裁剪和聚焦的区域内执行更详细的搜索。这种分层方法将问题分解为 AI 更易于管理的步骤，通常可以在视觉密集或复杂的用户界面上实现更准确、更高效的元素识别。这也有助于通过发送更小、更相关的图像裁剪来管理 VLM 的令牌限制。
*   **专用解析器**：对于像 UI-TARS 这样以结构化文本格式（而不是纯 JSON）产生输出的 AI 模型，会使用专用的解析器（`@ui-tars/action-parser`，在 `ai-model/ui-tars-planning.ts` 中使用）。该解析器将模型的特定输出语法转换为 Midscene 内部标准化的操作表示，从而允许这些模型尽管其输出不是 JSON 格式也能无缝集成。
*   **输入约束意识**：系统包含对特定模型输入限制的检查和处理程序。例如，`ai-model/ui-tars-planning.ts` 中的 `resizeImageForUiTars` 确保图像符合 UI-TARS v1.5 的输入约束，而 `ai-model/common.ts` 中的 `warnGPT4oSizeLimit` 会在图像可能超过 GPT-4o 最佳输入大小时提醒用户，从而防止潜在错误或性能不佳。

通过结合这些多样化的技术，Midscene 旨在创建稳健、上下文感知且有效的提示，最大限度地发挥各种 AI 模型在复杂 UI 自动化挑战中的效用，最终实现更可靠、更智能的自动化。

## 5. 命令注入和 Web 交互

本节详细介绍 Midscene 如何向网页注入命令、其 Chrome 扩展程序的架构、定位和与 Web 元素交互的方法，以及其不同的操作模式。理解这些机制是掌握 Midscene 如何将 AI 生成的计划或用户命令转换为实际浏览器行为的关键。

### 5.1. 命令注入机制

Midscene 根据操作模式采用不同的命令注入策略，为每种上下文选择最合适的技术。

#### 5.1.1. Chrome 调试协议 (CDP)

*   **使用者**：这是 Midscene Chrome 扩展程序在直接与网页交互时（例如，在其“Playground”模式下）的主要机制，也是该扩展程序在“桥接模式”下操作时使用的底层技术。
*   **核心类**：`packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage`。此类封装了使用 CDP 命令与浏览器选项卡交互的逻辑。
*   **机制**：
    1.  **附加调试器**：扩展程序通过 `ChromeExtensionProxyPage`，使用 `chrome.debugger.attach({ tabId: ... }, "1.3")` 以编程方式将 Chrome 调试器附加到目标浏览器选项卡。这授予扩展程序检查和控制该选项卡的特权访问权限。
    2.  **发送命令**：附加后，它使用 `chrome.debugger.sendCommand({ tabId: ... }, command, params)` 发出命令。Midscene 利用了几个 CDP 域：
        *   **`Runtime.evaluate`**：这对于在页面上下文中执行任意 JavaScript 至关重要。它用于注入更广泛的辅助脚本（如 `midscene_element_inspector`）、从页面的 DOM 或 JavaScript 环境动态检索数据，或执行简单的页面操作。
        *   **`Input.dispatchMouseEvent` / `Input.dispatchTouchEvent`**：这些命令模拟用户鼠标操作，如点击、移动、滚动（滚轮事件）和触摸事件。`dispatchTouchEvent` 对于在移动设备或移动模拟视图中模拟交互尤为重要。
        *   **`Input.dispatchKeyEvent`**：用于模拟键盘按下，包括单个按键按下/弹起事件以及用于键入的字符序列。
        *   **`Page.captureScreenshot`**：获取页面截图，通常为 JPEG 格式，然后用作 AI 模型的视觉输入。
*   **注入的辅助脚本**：
    *   一个关键脚本，内部称为 `midscene_element_inspector`（其源代码通过 `packages/shared` 中的 `getHtmlElementScript()` 加载），使用 `Runtime.evaluate` 注入到页面中。此脚本一旦在页面中激活，就会提供一个 API（例如，`window.midscene_element_inspector` 上的函数），可以从扩展程序的上下文（同样通过 `Runtime.evaluate`）调用该 API 来执行复杂的 DOM 分析任务，而无需传输大量原始 DOM 数据：
        *   `webExtractNodeTree()`：将实时 DOM 序列化为 Midscene 的结构化树格式 (`ElementTreeNode<ElementInfo>`)，捕获元素类型、属性、文本内容和几何信息。
        *   `getXpathsById(id)` 和 `getElementInfoByXpath(xpath)`：允许使用 Midscene 生成的 ID 查询元素 XPath 或使用已知的 XPath 检索元素信息，有助于调试和元素重新识别。
        *   `setNodeHashCacheListOnWindow()`：表明一种在页面的 `window` 对象上缓存元素表示或其唯一哈希值的机制。这可以优化重复查找或减少在同一页面上顺序操作期间的冗余数据提取。
    *   视觉反馈脚本（例如，在自动化操作期间显示鼠标指针移动视觉提示的“水流”动画）也通过 `Runtime.evaluate` 注入和控制，增强了用户观察和理解自动化的能力。
*   **优缺点**：CDP 提供了对浏览器的深度、低级别控制，使其能够进行详细的检查和交互，并且不需要直接修改目标页面的代码。然而，其 API 可能很复杂，并且使用它需要扩展程序具有调试器权限，用户必须授予这些权限。它也特定于基于 Chromium 的浏览器。

#### 5.1.2. 浏览器自动化驱动程序 API (Playwright/Puppeteer)

*   **使用者**：Playwright 模式和 Puppeteer 模式，通常在 Midscene 作为 Node.js SDK 用于测试脚本或后端自动化时使用。
*   **核心类**：`packages/web-integration/src/puppeteer/base-page.ts::Page`。这个通用类，按代理类型（Playwright/Puppeteer）和相应驱动程序的页面类型进行参数化，作为特定模式页面类（`packages/web-integration/src/playwright/page.ts::WebPage` 和 `packages/web-integration/src/puppeteer/page.ts::WebPage`）的基础。
*   **机制**：
    1.  **页面评估 (`page.evaluate()`)**：Playwright (`page.evaluate(pageFunction, ...args)`) 和 Puppeteer (`page.evaluate(pageFunction, ...args)`) 都提供了一种在网页上下文中执行 JavaScript 函数的强大方法。Midscene 将此作为其注入和运行 `midscene_element_inspector` 脚本的主要方法。脚本的源代码从 `packages/shared/node/fs.ts`（通过 `getElementInfosScriptContent()` 和 `getExtraReturnLogic()`）检索，并作为字符串传递给 `page.evaluate()`。这使得相同的复杂 DOM 提取逻辑可以在 CDP、Playwright 和 Puppeteer 模式中使用，确保了页面结构感知的一致性。
    2.  **原生驱动程序命令**：对于直接的浏览器交互，如鼠标点击、键盘输入、导航和截屏，Midscene 利用 Playwright 或 Puppeteer 驱动程序本身提供的高级、用户友好的 API。这些驱动程序内部管理与浏览器的低级别通信（通常使用 CDP 或 WebDriver 协议，具体取决于浏览器和驱动程序版本）。此类原生命令的示例包括：
        *   **鼠标**：`page.mouse.click(x, y)`、`page.mouse.move(x, y)`、`page.mouse.wheel(deltaX, deltaY)`。
        *   **键盘**：`page.keyboard.type(text)`、`page.keyboard.press(key)`。
        *   **截图**：`page.screenshot({ type: 'jpeg', ... })`。
        *   **导航**：`page.goto(url)`。
        *   **等待**：`page.waitForNavigation()`、`page.waitForNetworkIdle()`（Puppeteer 特有，BasePage 有一个更通用的 `waitForNavigation`）。
*   **优缺点**：使用驱动程序 API 简化了许多常见的自动化任务，因为驱动程序处理了浏览器交互的大部分复杂性并提供跨浏览器支持（尤其是 Playwright）。此模式非常适合集成到已经使用 Playwright 或 Puppeteer 的现有测试框架中。主要依赖于这些外部库，并且通常涉及启动由驱动程序控制的新浏览器实例，而不是附加到现有用户会话（桥接模式启用了这一点）。

这种命令注入的双重方法使 Midscene 具有通用性：当作为扩展程序操作时，通过 CDP 与浏览器深度集成；当作为 Node.js 环境中的 SDK 使用时，利用已建立的自动化库的强大功能和便利性。

### 5.2. Chrome 扩展程序架构和角色

Midscene Chrome 扩展程序（源代码主要在 `apps/chrome-extension/src/` 中）是一个关键组件，既提供了用于 AI 驱动自动化的直接用户界面，又充当了独特的“桥接模式”必不可少的浏览器端对应部分。其架构旨在提供无缝的用户体验，同时启用强大的自动化功能。

*   **用户界面 (`popup.tsx`)**：此 React 组件定义了当用户单击浏览器工具栏中的扩展程序图标时呈现的 UI。它提供了一个集中的交互和配置点。
    *   它具有选项卡式界面以分离功能：
        *   **“Playground”选项卡**：此选项卡提供了一个交互式环境，用户可以在其中键入自然语言命令（例如，“单击搜索按钮并键入‘Midscene’”）并见证 Midscene 尝试在当前活动的网页上执行它们。在底层，它实例化了一个 `ChromeExtensionProxyPageAgent`（来自 `packages/web-integration/src/chrome-extension/agent.ts`），后者又包装了 `ChromeExtensionProxyPage`。此设置允许 Playground 直接使用 CDP 机制（通过 `ChromeExtensionProxyPage`）与页面进行实时交互。Playground 中用户输入、AI 配置（从 `useEnvConfig` 存储加载）和结果的状态由 React 组件管理。这为用户在体验 AI 命令时提供了即时反馈循环。
        *   **“桥接模式”选项卡**：此选项卡包含用于启动、监视和管理与本地 Midscene SDK/CLI 实例连接的 UI（由 `extension/bridge.tsx` 组件呈现）。它显示连接状态（例如，“正在侦听”、“已连接”、“已断开连接”）并记录相关事件，允许用户明确“允许连接”或“停止”桥接，从而保持对浏览器外部访问的控制。
    *   弹出窗口还包含指向 Midscene 文档和 GitHub 代码仓库的便捷链接。一个关键特性是 `EnvConfig` 组件（可能来自 `packages/visualizer`），它允许用户查看和修改 AI 服务配置（API 密钥、模型名称、基本 URL 等），这些配置通过 `useEnvConfig` Zustand 存储（参见第 7.1 节）进行存储。这种直接在扩展程序内配置 AI 提供商的能力对于其在“浏览器内”服务模式下的独立操作至关重要，在该模式下，扩展程序本身使用用户存储的凭据调用 AI API。
*   **桥接客户端 (`extension/bridge.tsx` 和 `packages/web-integration/src/bridge-mode/page-browser-side.ts::ExtensionBridgePageBrowserSide`)**：
    *   `apps/chrome-extension/src/extension/bridge.tsx` React 组件负责呈现“桥接模式”UI 并管理其操作生命周期（显示状态、处理连接/断开连接操作、显示日志）。
    *   它实例化并控制 `ExtensionBridgePageBrowserSide`。此类（其源代码位于 `packages/web-integration` 中，但可能由扩展程序捆绑和导入，可能作为 `@midscene/web/bridge-mode-browser`）在扩展程序的 JavaScript 环境中运行（具体来说，是弹出窗口的上下文，或者如果弹出窗口关闭以维持 WebSocket 连接，则是一个专用的扩展程序页面）。
    *   `ExtensionBridgePageBrowserSide` 充当 WebSocket (Socket.IO) 客户端。它与在本地 Node.js 进程（即 Midscene SDK 或 CLI）中运行的 `BridgeServer`（参见第 5.4 节，桥接模式）建立连接。
    *   它侦听通过此 WebSocket 通道从 SDK 发送的远程过程调用 (RPC)。收到命令（例如，获取页面 URL 或单击元素）后，它使用从其父类 `ChromeExtensionProxyPage` 继承的功能执行该命令，从而利用 Chrome 调试协议进行实际的浏览器交互。然后，这些操作的结果或错误被序列化并通过 WebSocket 发送回 SDK。
*   **直接 CDP 交互逻辑 (`packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage`)**：
    *   如第 5.1.1 节所述，此类是 Chrome 扩展程序发起或管理的所有浏览器交互的引擎。无论命令是来自“Playground”选项卡中的用户，还是在“桥接模式”下作为来自 SDK 的 RPC 中继，`ChromeExtensionProxyPage` 都会处理将 Chrome 调试器附加到特定选项卡并将必要的 CDP 命令分派到检查页面或模拟用户输入的低级别详细信息。它还管理 `midscene_element_inspector` 脚本的注入。

因此，Chrome 扩展程序是 Midscene 生态系统中一个复杂的组成部分。它不仅仅是一个被动工具，而是一个主动代理，既能够进行用户驱动的自动化（Playground），又能够充当外部 SDK 控制浏览器的安全、用户授权的管道（桥接模式）。其本地状态管理 (`store.tsx`) 确保用户对 AI 服务和操作偏好的配置得以持久化，使其成为 Midscene 功能的高度可配置且用户友好的入口点。

### 5.3. 元素定位和交互

Midscene 准确定位和与 Web 元素交互的能力是一个多阶段过程，结合了稳健的 DOM 分析、智能的 AI 驱动理解以及特定于模式的执行机制。此过程确保 Midscene 可以在各种 Web UI 中有效工作。

1.  **感知/理解（获取页面上下文）**：此初始阶段是关于“看到”和“理解”网页的当前状态。
    *   **屏幕截图捕获**：拍摄当前页面的视觉快照。
        *   在 Chrome 扩展程序/桥接模式下，这是通过 `ChromeExtensionProxyPage` 使用 `Page.captureScreenshot` CDP 命令完成的。
        *   在 Playwright/Puppeteer 模式下，使用相应的 `page.screenshot()` 驱动程序方法。
        *   此图像是一个至关重要的输入，特别是对于视觉语言模型 (VLM)，它提供直接的视觉数据。
    *   **DOM 结构提取**：将 `midscene_element_inspector` 脚本（来自 `packages/shared/src/extractor/`）注入到页面上下文中（通过 CDP `Runtime.evaluate` 或驱动程序的 `page.evaluate()`）。然后调用其 `webExtractNodeTree()` 函数。
        *   此函数遍历实时 DOM 并构建一个详细的、可序列化的树 (`ElementTreeNode<ElementInfo>`)。此树表示相关 UI 元素的层次结构，捕获其标签名称、关键 HTML 属性（如 `id`、`class`、`name`、`role`、`aria-label`）、可见的文本内容和几何属性（边界框、中心点和可见性状态）。
        *   DOM 的这种结构化文本表示补充了视觉屏幕截图，为 AI 提供了丰富的上下文，特别是在区分视觉相似的元素或理解主要由其文本或属性定义的元素时。
    *   组合的视觉（屏幕截图）和结构（元素树）信息被打包到一个 `UIContext` 对象中。然后将此对象传递给 `packages/core` 中的 AI 处理层。
2.  **AI 处理（解释意图和识别目标）**：
    *   `packages/core` 中的 `Insight` 类和各种规划模块接收 `UIContext` 以及用户的自然语言提示（例如，“单击‘登录’按钮，然后在用户名宇段中输入‘testuser’”）。
    *   配置的 AI 模型（LLM 或 VLM）处理此组合输入。
    *   **AI 的输出**：AI 的响应因任务和模型类型而异：
        *   **对于 VLM**：输出通常包括在屏幕截图上识别的目标元素的直接坐标或边界框 (`bbox`)。一些 VLM 可能还会提供简短的文本理由。
        *   **对于 LLM**（主要处理文本元素树和指令）：输出可能是目标元素的 Midscene 生成的唯一 `id`（它是输入树描述的一部分）或可以解析为元素的描述性路径。
        *   对于规划任务，AI 通常输出一系列操作（例如，对元素 A 执行 `TAP`，将“文本”`INPUT` 到元素 B），其中每个操作都引用通过坐标或 ID 识别的目标元素。
3.  **操作执行（执行交互）**：一旦 AI 识别出目标和/或计划，Midscene 就会将其转换为具体的浏览器交互：
    *   **解析目标元素详细信息**：
        *   如果 AI 提供**坐标/边界框**（常见于 VLM），这些通常直接用于指导鼠标点击或其他交互。这些坐标通过 `packages/core/src/ai-model/common.ts` 中的 `adaptBbox` 函数进行归一化，以处理不同 VLM 输出之间的差异（例如，将归一化坐标转换为绝对像素）。系统可能仍会尝试使用 `elementByPositionWithElementInfo`（来自 `packages/core/src/ai-model/prompt/util.ts`）将这些 AI 提供的坐标映射到从提取的树中已知的元素，以实现更稳健的交互或日志记录，或者如果现有元素与 VLM 的焦点不完全匹配，则可能会创建合成元素表示。
        *   如果 AI 返回元素 **`id`**，则此 ID 用于从作为 `UIContext` 一部分的元素树中查找元素的详细信息（包括其精确坐标，这些坐标是在初始 DOM 提取时存储的）。
    *   **执行交互**：交互方法取决于操作模式：
        *   **Chrome 扩展程序/桥接模式**：`ChromeExtensionProxyPage` 使用特定的 CDP 命令。例如，对位于 `(x,y)` 坐标处的元素执行“单击”操作会转换为 `Input.dispatchMouseEvent` 命令。在输入字段中键入文本涉及首先聚焦该元素（通常通过在其坐标处模拟单击），然后为每个字符发送一系列 `Input.dispatchKeyEvent` 命令。
        *   **Playwright/Puppeteer 模式**：`BasePage` 实现（在 `packages/web-integration/src/puppeteer/` 中）调用底层 Playwright 或 Puppeteer `page` 对象的相应高级方法。例如，`this.underlyingPage.mouse.click(x,y)` 或 `this.underlyingPage.keyboard.type(text)`。然后，这些驱动程序方法处理低级别通信（通常通过 CDP 或 WebDriver）以在浏览器中执行操作。与 CDP 一样，诸如在输入字段中键入之类的操作通常涉及首先单击该字段以确保其具有焦点。

这种多阶段过程——从使用注入脚本进行详细的页面感知，到 AI 模型的智能解释，再到通过特定于模式的浏览器控制机制进行精确的操作执行——使得 Midscene 能够以一种既具有上下文感知能力又能够适应特定自动化环境的方式与 Web 元素进行交互。其目标是通过依赖更深层次的、AI 驱动的 UI 理解，使交互比传统的基于选择器的方法更具弹性。

### 5.4. 操作模式

Midscene 的 Web 集成功能通过几种不同的操作模式公开，所有这些模式通常由 `PageAgent` 类 (`packages/web-integration/src/common/agent.ts::PageAgent`) 编排。`PageAgent` 为 AI 驱动的自动化提供统一的编程接口，抽象了浏览器控制方式的细节。每种模式都提供了连接和与 Web 浏览器交互的不同方式，以满足从交互式测试到稳健的脚本化自动化等各种用例。

*   **Chrome 扩展程序“Playground”模式**：
    *   **设置**：用户通过与 Midscene Chrome 扩展程序弹出窗口（特别是“Playground”选项卡）提供的 UI 直接交互来启动此模式。
    *   **机制**：在扩展程序的 JavaScript 环境中实例化一个 `ChromeExtensionProxyPageAgent`（来自 `packages/web-integration/src/chrome-extension/agent.ts`）。此代理直接利用 `ChromeExtensionProxyPage`（来自同一包）使用 Chrome 调试协议 (CDP) 与当前活动的浏览器选项卡进行交互，如第 5.1.1 节所述。`PageAgent` 编排获取页面上下文、将其发送到 AI（通过扩展程序的存储进行配置）以及执行 AI 的计划。
    *   **关键组件**：`apps/chrome-extension/src/extension/popup.tsx` (UI)、`packages/web-integration/src/chrome-extension/agent.ts::ChromeExtensionProxyPageAgent`、`packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage`。
    *   **用例**：此模式专为交互式测试、快速自动化任务以及直接在用户浏览器内演示 Midscene 的功能而设计，无需编写或运行外部 Node.js 脚本。它为用户体验 Midscene AI 的实际操作提供了一个极好的入口点。
*   **桥接模式**：
    *   **设置**：
        1.  Midscene SDK（或使用 SDK 的 CLI 工具）在 Node.js 环境中运行。当以桥接模式启动时（例如，通过指定 `bridgeMode: true` 的 YAML 脚本或通过编程 SDK 设置），它会启动一个 `BridgeServer`。此服务器（在 `packages/web-integration/src/bridge-mode/io-server.ts` 中定义）侦听本地端口（默认为 3766）上的 WebSocket (Socket.IO) 连接。这通常由来自 `packages/web-integration/src/bridge-mode/agent-cli-side.ts` 的 `AgentOverChromeBridge` 类管理。
        2.  用户打开 Midscene Chrome 扩展程序，导航到弹出 UI 中的“桥接模式”选项卡，然后单击“允许连接”。此操作会提示在扩展程序中运行的 `ExtensionBridgePageBrowserSide` 类（来自 `packages/web-integration/src/bridge-mode/page-browser-side.ts`）连接到本地 `BridgeServer`。
    *   **机制**：此模式通过 WebSocket 建立双向远程过程调用 (RPC) 通道：
        1.  来自 SDK 的命令（例如，用户脚本调用 `agent.aiTap(...)`）由 `AgentOverChromeBridge` 打包并通过 `BridgeServer` 作为 RPC 请求发送到 Chrome 扩展程序中的 `ExtensionBridgePageBrowserSide`。
        2.  `BridgeServer` 将这些 RPC 请求中继到 Chrome 扩展程序内连接的 `ExtensionBridgePageBrowserSide` 实例。
        3.  `ExtensionBridgePageBrowserSide` 在收到 RPC 调用后，使用其底层的 `ChromeExtensionProxyPage` 功能（即通过向其当前附加的浏览器选项卡发送 CDP 命令）执行相应的浏览器操作（例如，`this.mouse.click(...)`）。
        4.  这些 CDP 操作的结果（或错误）随后被序列化并通过相同的 Socket.IO 通道传回 `BridgeServer`，然后 `BridgeServer` 将它们返回给 SDK 脚本中的原始调用函数。
    *   **关键组件**：`packages/web-integration/src/bridge-mode/agent-cli-side.ts::AgentOverChromeBridge` (SDK 端)、`packages/web-integration/src/bridge-mode/io-server.ts::BridgeServer` (SDK 端)、`apps/chrome-extension/src/extension/bridge.tsx` (扩展程序 UI)、`packages/web-integration/src/bridge-mode/page-browser-side.ts::ExtensionBridgePageBrowserSide` (扩展程序客户端逻辑)、`packages/web-integration/src/chrome-extension/page.ts::ChromeExtensionProxyPage` (CDP 执行)。
    *   **用例**：桥接模式特别强大，因为它允许外部 Node.js 脚本（可以包含复杂逻辑、与其他系统集成或在 CI 环境中运行）控制用户打开的标准 Chrome 浏览器实例。这对于利用现有浏览器会话（cookie、登录状态）、调试需要观察浏览器行为的复杂自动化脚本以及需要混合编程控制和在同一浏览器上下文中进行潜在手动干预的场景非常有利。
*   **Playwright 模式**：
    *   **设置**：开发人员编写一个 Node.js 脚本，该脚本使用 Midscene SDK 并明确将 Playwright 配置为浏览器自动化驱动程序。这通常涉及将 `playwright` 安装为依赖项，并使用 Midscene 的辅助函数或类通过 Midscene 代理启动 Playwright。
    *   **机制**：`PageAgent`（来自 `packages/web-integration/src/common/agent.ts`）使用由 `packages/web-integration/src/playwright/page.ts` 提供的 `WebPage` 对象进行实例化。此 `WebPage` 类包装了一个原生的 Playwright `Page` 对象，并从 `BasePage`（位于 `packages/web-integration/src/puppeteer/`）派生通用功能。
    *   命令注入（特别是 `midscene_element_inspector` 脚本）是使用 Playwright 的 `page.evaluate()` 方法执行的。直接的浏览器交互（单击、键入、导航）利用 Playwright 的原生 API（例如，`page.mouse.click()`、`page.keyboard.type()`），如第 5.1.2 节所述。
    *   **关键组件**：`packages/web-integration/src/common/agent.ts::PageAgent`、`packages/web-integration/src/playwright/page.ts::WebPage`、`packages/web-integration/src/puppeteer/base-page.ts::Page`。
    *   **用例**：此模式专为那些喜欢使用 Playwright 作为其自动化后端或拥有基于 Playwright 构建的现有测试套件的开发人员量身定制。它允许他们将 Midscene 的 AI 驱动功能（如自然语言命令和智能、自适应的元素定位）无缝集成到其标准的 Playwright 自动化脚本中，从而通过 AI 智能增强这些脚本。
*   **Puppeteer 模式**：
    *   **设置**：与 Playwright 模式类似，但开发人员选择 Puppeteer 作为自动化驱动程序。这涉及安装 `puppeteer` 并使用 Midscene 的 Puppeteer 特定代理启动器（例如，CLI 使用的 `puppeteerAgentForTarget`）。
    *   **机制**：`PageAgent` 使用来自 `packages/web-integration/src/puppeteer/page.ts` 的 `WebPage` 对象进行实例化，该对象包装了一个 Puppeteer `Page` 对象，并且也使用通用的 `BasePage`。
    *   交互方法利用 Puppeteer 的原生 API 进行脚本评估 (`page.evaluate()`) 和浏览器控制 (`page.mouse.click()` 等)。
    *   **关键组件**：`packages/web-integration/src/common/agent.ts::PageAgent`、`packages/web-integration/src/puppeteer/page.ts::WebPage`、`packages/web-integration/src/puppeteer/base-page.ts::Page`。
    *   **用例**：对于已经使用 Puppeteer 或喜欢其 API 的开发人员，此模式可以将 Midscene 的 AI 功能添加到其基于 Puppeteer 的自动化项目中。如果未指定桥接模式，它也是通过 CLI 运行 YAML 脚本时的默认 Web 驱动程序。

`PageAgent` 类充当一个关键的抽象层。它定义了一组通用的高级自动化方法（如 `aiTap`、`aiQuery`、`aiAction`）。底层的 `AbstractPage` 接口由特定于模式的类（`ChromeExtensionProxyPage`、用于 Playwright/Puppeteer 的 `BasePage`）实现，确保 `PageAgent` 的核心 AI 和任务执行逻辑（通常位于 `packages/core` 中并由 `PageTaskExecutor` 管理）无论选择哪种浏览器交互后端都能一致地运行。这种架构选择允许开发人员根据其特定需求选择最合适的浏览器控制机制，同时仍能从 Midscene 统一的 AI 功能中受益。

## 6. 核心组件和库

本节深入探讨 `packages/` 目录中关键库的主要功能，不包括第 4 节中详细介绍的 `packages/core/src/ai-model/`。

### 6.1. `packages/core`

除了在 AI 模型集成中的核心作用外，`packages/core` 还为 Midscene 的操作提供了基础元素。它充当理解 UI 上下文、定义自动化任务和构建结果的大脑。

*   **Insight 编排 (`insight/index.ts`)**：
    *   `Insight` 类是感知和理解 UI 的基石。它本身不是一个 AI 模型，而是为特定的感知任务编排对 AI 服务（在 `ai-model/` 中定义）的调用。它弥合了原始页面数据和可操作的 AI 驱动洞察之间的差距。
    *   它使用 `contextRetrieverFn` 进行初始化，该函数可以在请求洞察操作时动态获取当前的 `UIContext`（包括屏幕截图、从 `packages/shared/src/extractor` 派生的元素树以及页面尺寸）。
    *   **关键方法**：
        *   `locate()`：管理基于自然语言查询或其他标准在页面上查找特定元素的复杂过程。它可以通过首先调用 `AiLocateSection`（查找与查询相关的更广泛的页面区域）然后调用 `AiLocateElement`（在该区域内精确定位特定元素）来执行“深度思考”。这种迭代方法对于复杂的 UI 特别有用。
        *   `extract()`：通过调用 `AiExtractElementInfo` 来编排数据提取。
        *   `assert()`：通过调用 `AiAssert` 来管理 UI 断言。
        *   `describe()`：通过使用来自 `ai-model/prompt/describe.ts` 的提示调用 AI，生成 UI 元素（由 `Rect` 或点坐标指定）的自然语言描述。它还可以通过关注目标周围的裁剪区域来执行“深度思考”。
    *   它通过 `DumpSubscriber` 机制处理洞察数据（查询、AI 响应、错误、时间）的日志记录，由 `insight/utils.ts::emitInsightDump` 辅助。
*   **YAML 自动化语言定义 (`yaml.ts`)**：
    *   此文件至关重要，因为它定义了构成 Midscene 基于 YAML 的自动化脚本模式的 TypeScript 类型和接口的完整集合。这种结构化定义允许解析、验证和执行用户创建的 YAML 文件。
    *   定义的关键类型包括：
        *   `MidsceneYamlScript`：YAML 脚本的根类型，包含环境配置（`web`、`android`）和任务列表。
        *   `MidsceneYamlTask`：定义一个具有一系列流程项的命名任务。
        *   `MidsceneYamlFlowItem`：一个联合类型，表示可以在 YAML 流中定义的所有可能的操作和运算。这包括各种 AI 驱动的操作（例如，`aiTap`、`aiInput`、`aiQuery`、`aiAssert`、`aiScroll`）、直接的浏览器交互 (`evaluateJavaScript`) 和控制流元素 (`sleep`)。
        *   特定的选项类型，如 `LocateOption`（例如，用于 `deepThink`、`cacheable`）和 `InsightExtractOption`（例如，`domIncluded`、`screenshotIncluded`），也在此处定义，允许用户直接从其 YAML 脚本中微调 AI 行为。
*   **核心数据类型 (`types.ts`)**：
    *   此文件是大量 TypeScript 类型和接口的中央存储库，这些类型和接口对于整个 Midscene 系统中使用的数据结构和契约至关重要。其中包括：
        *   UI 元素的表示（`BaseElement`、`ElementTreeNode`）、几何图元（`Rect`、`Size`、`Point`）以及封装给定时刻页面状态的 `UIContext` 对象。
        *   对应于各种任务（定位、提取、断言、规划）的 AI 模型响应的详细结构。
        *   `ActionExecutor`（在 `ai-model/action-executor.ts` 中）使用的操作执行框架的定义，例如 `ExecutionTask`、`ExecutionTaskApply`、`ExecutorContext` 和 `ExecutionDump`。
        *   诸如 `PageType`（例如，'puppeteer'、'playwright'、'chrome-extension-proxy'、'android'）之类的枚举，有助于管理特定于模式的逻辑。
*   **报告和通用实用程序 (`utils.ts`)**：
    *   **报告生成**：`reportHTMLContent()` 和 `writeDumpReport()` 负责从自动化运行期间收集的 `ExecutionDump` 数据创建用户友好的基于 HTML 的可视化报告。这些报告包括屏幕截图、操作日志和 AI 洞察，对于调试和理解自动化过程至关重要。报告是从注入了转储数据的模板字符串生成的。
    *   **文件系统操作**：`writeLogFile()` 提供了一种标准化的方式来将各种日志文件和其他操作数据（如执行转储或缓存文件）写入磁盘。它管理输出目录（通常在项目根目录下的 `midscene_run/` 文件夹中）的创建，并且可以更新项目的 `.gitignore` 文件以从版本控制中排除这些生成的文件。`getTmpDir()` 和 `getTmpFile()` 为管理临时文件提供帮助程序。
    *   **序列化**：`stringifyDumpData()` 提供了一个自定义的 JSON 字符串化程序。这一点很重要，因为自动化对象（如来自 Puppeteer/Playwright 的 Page 或 Browser 实例）可能具有循环引用或包含过多的内部细节。这个自定义字符串化程序可以优雅地处理此类对象，以防止错误并保持日志输出简洁。
    *   **版本信息**：`getVersion()` 提供当前的 SDK 版本，可用于日志记录和诊断。
    *   **可选遥测**：`uploadTestInfoToServer()` 概述了一种可选机制，用于将匿名的测试执行元数据（如代码仓库 URL 和测试 URL）发送到配置的中央服务器。这可能用于收集使用情况统计信息或用于项目改进跟踪，其激活将取决于用户/环境配置。
*   **图像和树实用程序（从 `packages/shared` 重新导出）**：
    *   `packages/core` 中的 `image/index.ts` 和 `tree.ts` 主要从 `packages/shared`（特别是从 `@midscene/shared/img` 和 `@midscene/shared/extractor`）重新导出功能。这种设计表明 `packages/core` 使用这些共享的、较低级别的实用程序来执行诸如图像分析（获取尺寸、调整大小、base64 转换）和处理 HTML 元素树（序列化为字符串格式以用于提示、截断文本/属性）之类的任务。

从本质上讲，`packages/core` 充当直接 AI 模型通信之上的编排层。它提供了用于智能 UI 查询的 `Insight` 类，定义了基于 YAML 的自动化的结构和类型，建立了用于内部数据表示的强大类型系统，并提供了用于生成报告和管理操作日志的基本实用程序。它依赖于 `packages/shared` 来执行更基本的数据提取和图像处理任务。

### 6.2. `packages/shared`

`packages/shared` 库充当基础层，提供由 Midscene monorepo 中各种其他包使用的基本实用程序和数据结构，从而促进代码重用和一致性。其作用是提供通用的、低级别的功能，这些功能是系统中其他部分更复杂操作的先决条件。

*   **DOM 元素提取 (`extractor/`)**：这可以说是 `packages/shared` 中最关键和最复杂的组件。它包含客户端 JavaScript 代码，旨在注入并在 Web 浏览器的上下文中直接运行以分析实时 DOM。
    *   **`web-extractor.ts`**：此文件包含核心提取逻辑。
        *   `collectElementInfo()`：遍历 DOM，使用 `dom-util.ts` 中定义的启发式方法识别交互式和有意义的元素（按钮、输入、文本、图像、链接、容器）。对于每个元素，它捕获其几何属性（矩形、中心点）、HTML 属性、文本内容，并生成唯一的哈希 ID (`midsceneGenerateHash`)。它还确定元素的 `NodeType`。
        *   `extractTreeNode()`：DOM 提取的主要入口点，编排遍历以构建检测到元素的层次结构树 (`WebElementNode`)。此树通常随后被序列化并发送到 AI 模型或由其他自动化逻辑使用。
        *   `extractTreeNodeAsString()`：使用 `descriptionOfTree` 将元素树转换为字符串格式，适用于 LLM 提示。
    *   **`tree.ts`**：
        *   `descriptionOfTree()`：将 `ElementTreeNode` 序列化为类似 XML/HTML 的字符串，为 AI 模型提供 UI 结构的文本表示。它包括文本截断和过滤选项。
        *   `treeToList()`：将元素树展平为简单列表。
    *   **`dom-util.ts`**：包含谓词函数（例如，`isButtonElement`、`isFormElement`）以根据其标签和属性对 DOM 节点进行分类。`generateElementByPosition()` 为 VLM 识别的坐标创建合成元素表示。
    *   **`locator.ts`**：提供诸如 `getXpathsById` 和 `getElementInfoByXpath` 之类的实用程序，这些实用程序可以在浏览器中运行以获取元素的 XPath 信息，从而有助于调试和元素重新识别。
    *   **`util.ts` (在 `extractor/` 中)**：包含用于几何计算 (`elementRect`)、属性提取 (`getNodeAttributes`)、伪元素内容检索、唯一 ID 生成 (`midsceneGenerateHash`) 以及管理元素哈希的浏览器内缓存 (`setNodeHashCacheListOnWindow`) 的帮助程序。
*   **图像处理 (`img/`)**：一套全面的图像处理实用程序，主要使用 `jimp` 库。这些对于为 AI 模型准备视觉数据和生成视觉反馈至关重要。
    *   **信息 (`info.ts`)**：诸如 `imageInfoOfBase64` 之类的函数，用于获取图像尺寸。
    *   **转换 (`transform.ts`)**：
        *   调整大小（`resizeImgBase64`、用于模型特定约束的 `zoomForGPT4o`）。
        *   裁剪 (`cropByRect`)。
        *   填充 (`paddingToMatchBlockByBase64`) 以满足 VLM 输入要求（例如，确保尺寸是块大小的倍数）。
        *   格式转换（例如，`jimpToBase64`）。
    *   **绘制 (`draw-box.ts`)**：`drawBoxOnImage` 用于在图像上标记点或区域，可用于调试或创建带注释的数据集。
    *   **合成 (`box-select.ts`)**：`compositeElementInfoImg` 将多个元素的边界框和标签绘制到基础图像上，创建某些 AI 交互流程使用的“标记截图”。
*   **日志记录 (`logger.ts`)**：
    *   提供一个 `getDebug(topic)` 函数，该函数返回一个用于命名空间日志记录的 `debug` 实例。
    *   在 Node.js 环境中，它会自动将这些日志写入 `midscene_run/log/` 目录中带时间戳的文件，按主题分类（例如，`midscene_run/log/ai-inspect.log`）。这种持久性日志记录对于服务器端调试非常宝贵。
*   **环境配置 (`env.ts`)**：
    *   为所有 Midscene 特定的环境变量（例如，`MIDSCENE_MODEL_NAME`、`OPENAI_API_KEY`、`MIDSCENE_RUN_DIR`）定义常量。
    *   提供实用程序函数（`getAIConfig`、`getAIConfigInBoolean`、`getAIConfigInJson`）以一致的方式访问这些配置。
    *   包括用于确定活动 VLM 模式（`vlLocateMode`、`uiTarsModelVersion`）和首选语言（`getPreferredLanguage`）的逻辑。
*   **Node.js 特定实用程序 (`node/fs.ts`)**：
    *   `getElementInfosScriptContent()` 和 `getExtraReturnLogic()`：这些函数对于 Playwright 和 Puppeteer 模式至关重要。它们从 `packages/shared/dist/script/` 读取预构建的 `htmlElement.js`（提取器的浏览器端部分，也称为 `midscene_element_inspector`）。然后，自动化驱动程序将此捆绑脚本注入到网页中。
    *   `getRunningPkgInfo()`：定位当前正在运行的包的 `package.json`。
*   **标准化输出目录 (`common.ts`)**：
    *   `getMidsceneRunDir()` 和 `getMidsceneRunSubDir()`：定义并创建 `midscene_run/` 目录及其子文件夹（`log`、`report`、`dump`、`cache`、`tmp`），用于存储所有操作输出。
*   **核心类型和常量 (`types/index.ts`, `constants/index.ts`)**：
    *   定义基本数据结构，如 `Rect`、`Size`、`Point`、`BaseElement`、`ElementTreeNode` 和 `NodeType` 枚举。这些在整个 monorepo 中共享以确保数据一致性。
*   **通用实用程序 (`utils.ts`)**：
    *   包括用于 UUID 生成 (`uuid`)、稳健的 `assert` 函数、HTML 转义/反转义以及识别执行环境 (`ifInBrowser`) 的帮助程序函数。
    *   `generateHashId()`：根据元素的属性为其创建简短的、唯一的（在合理范围内）标识符。

`packages/shared` 是通用功能的基石，确保诸如 DOM 分析、图像处理、配置和日志记录之类的任务在 Midscene 平台的各个不同部分得到一致执行。其提取器脚本 (`htmlElement.js`) 对于在各种浏览器环境中实现页面理解尤为重要。

### 6.3. `packages/cli`

命令行界面 (`packages/cli`)，其源代码位于 `packages/cli/src/`，是用户执行 Midscene 自动化（特别是那些在 YAML 脚本中定义的自动化）的主要面向用户的工具。它弥合了用户定义的自动化脚本与底层 Midscene 核心和集成库之间的差距。

*   **参数解析 (`args.ts`, `cli-utils.ts`)**：
    *   CLI 使用 `yargs` 库进行稳健的命令行参数解析，在 `cli-utils.ts::parseProcessArgs` 中配置。标准选项包括 `--headed`（以可见模式运行浏览器，用于调试）、`--keep-window`（防止浏览器在脚本完成后立即关闭）、`--version` 和 `--help`。
    *   预期的主要位置参数是 YAML 脚本文件或包含多个 YAML 脚本的目录的路径。
    *   `args.ts` 提供了一些较低级别的参数解析实用程序，包括用于需要特定参数顺序的场景的 `orderMattersParse`，尽管 `yargs` 在 `index.ts` 中处理主要解析。
*   **环境配置 (`index.ts`)**：
    *   启动时，CLI 会自动从当前工作目录中存在的 `.env` 文件加载环境变量（如果存在）。这是通过 `dotenv` 包实现的。这种做法允许用户在本地管理敏感配置（如 AI 服务的 API 密钥和其他设置），而无需将其硬编码到脚本或命令行中。
*   **YAML 脚本执行 (`yaml-runner.ts`, `index.ts`)**：
    *   **文件发现**：`cli-utils.ts::matchYamlFiles` 负责根据输入路径或 glob 模式定位所有 `.yml` 或 `.yaml` 文件。
    *   **核心执行逻辑 (`yaml-runner.ts::playYamlFiles`)**：此函数编排发现的 YAML 脚本的执行。
        1.  **解析**：从文件读取 YAML 内容，并使用 `parseYamlScript`（来自 `@midscene/web/yaml`，内部可能使用标准的 YAML 解析库如 `js-yaml`，如 `PageAgent.runYaml` 中所示）将其解析为 JavaScript 对象结构。
        2.  **脚本播放器**：为每个脚本创建一个 `ScriptPlayer` 实例（来自 `@midscene/web/yaml`）。此播放器负责解释解析的 YAML 结构（特别是每个任务中的 `flow` 数组）并按顺序执行定义的操作。
        3.  **动态代理创建 (`agentFactory`)**：`yaml-runner` 的一个关键功能是其 `agentFactory`。此函数传递给 `ScriptPlayer`，并负责根据 YAML 脚本中指定的 `web` 或 `android` 目标动态实例化和配置正确的自动化代理：
            *   **Web 目标**：
                *   如果 YAML 包含 `serve` 属性（指示要为自动化提供服务的本地目录），CLI 会使用 `http-server` 包通过 `launchServer()` 启动本地静态 HTTP 服务器。
                *   **桥接模式**：如果配置了 `bridgeMode`（例如，`newTabWithUrl` 或 `currentTab`），则会创建一个 `AgentOverChromeBridge`（来自 `@midscene/web/bridge-mode`）。此代理有助于通过 Midscene Chrome 扩展程序与现有的 Chrome 浏览器实例进行通信。
                *   **Puppeteer 模式**（如果未指定桥接模式，则为 Web 的默认模式）：调用 `puppeteerAgentForTarget`（来自 `@midscene/web/puppeteer-agent-launcher`）。此实用程序函数启动由 Puppeteer 控制的新浏览器实例，并根据 YAML 中的选项（视口、用户代理、cookie 注入）配置浏览器页面。
            *   **Android 目标**：如果在 YAML 中定义了 `android` 目标，则使用 `agentFromAdbDevice`（来自 `@midscene/android`）。此函数通过 ADB 连接到指定的 Android 设备/模拟器（或第一个可用的设备/模拟器）并为其自动化做好准备。CLI 还可以根据 YAML 在设备上启动特定的应用程序或 URL。
        4.  **资源管理**：代理工厂还返回一个清理函数数组 (`freeFn`)，`ScriptPlayer` 在脚本执行后调用这些函数以正确释放资源，如浏览器实例或 Web 服务器。
*   **用户反馈和报告 (`printer.ts`, `tty-renderer.ts`)**：
    *   CLI 向用户提供有关脚本执行进度的全面反馈。
    *   **TTY 渲染**：如果在与 TTY 兼容的终端（例如，标准命令提示符或终端窗口）中运行，它会利用 `TTYWindowRenderer`。此组件提供多个 YAML 文件及其各个任务状态的丰富、动态且持续更新的显示，通常使用旋转器和颜色编码的状态指示器（通过 `chalk` 库）以获得更好的可读性。
    *   **标准输出**：在非 TTY 环境（例如 CI/CD 管道日志）中，它默认打印更简单的顺序日志消息。
    *   `printer.ts` 中的实用程序（例如，`indicatorForStatus`、`contextInfo`、`singleTaskInfo`）用于格式化这些输出。
*   **主入口点 (`index.ts`)**：
    *   此文件将所有部分联系在一起。它解析命令行参数，加载 `.env` 配置，查找目标 YAML 脚本，然后调用 `playYamlFiles` 来启动自动化。
    *   它负责根据脚本执行的结果设置最终的进程退出代码（0 表示成功，1 表示失败）。
    *   它还通过使用 `setInterval` 调用来处理 `--keep-window` 选项，以在脚本完成后保持 Node.js 进程活动，从而防止任何有头浏览器窗口（例如，由 Puppeteer 启动的窗口）过早关闭。这允许用户检查浏览器的最终状态以进行调试。

总而言之，`packages/cli` 充当执行 YAML 中定义的 Midscene 自动化的主要用户界面。它根据 YAML 配置智能地设置所需的浏览器或设备环境（Puppeteer、到 Chrome 的桥接或 Android ADB），然后将实际的任务执行委托给 `ScriptPlayer` 和来自其他 Midscene 包的底层代理实现。

## 7. 数据管理和状态

本节探讨数据如何在 Midscene 系统的不同部分之间管理和传递，包括 Chrome 扩展程序内的状态管理。

### 7.1. Chrome 扩展程序状态 (`apps/chrome-extension/src/store.tsx`)

Midscene Chrome 扩展程序利用 `zustand` 库进行其内部状态管理。`Zustand` 是一个简约且基于钩子的 React 状态管理解决方案，因其简单性和性能而被选中。该扩展程序定义了两个主要存储：

*   **`useBlackboardPreference` 存储**：
    *   **目的**：此存储管理与“黑板”或可视化器界面相关的 UI 首选项，可能在扩展程序的“Playground”或类似的调试视图中使用，其中显示或突出显示当前网页的元素和 AI 的交互。
    *   **状态**：
        *   `markerVisible: boolean`：控制页面上突出显示元素的标记的可见性。
        *   `elementsVisible: boolean`：切换元素文本详细信息或叠加层的显示。
    *   **操作**：该存储公开诸如 `setMarkerVisible` 和 `setTextsVisible` 之类的操作，允许扩展程序内的 React 组件更新这些可见性首选项。
*   **`useEnvConfig` 存储**：此存储对于扩展程序的操作配置及其部分 UI 状态至关重要。
    *   **目的**：它允许用户配置通常在 Node.js 上下文中作为操作系统级别环境变量的设置（如 AI 服务的 API 密钥或模型选择）。这对于使扩展程序能够独立运行或以不同模式运行至关重要。它还存储一些弹出窗口的 UI 特定状态。
    *   **状态**：
        *   `serviceMode: ServiceModeType`：定义扩展程序如何与 AI 和自动化服务交互。可能的值为：
            *   `'Server'`：扩展程序期望连接到本地 Node.js 服务器（通常是在桥接模式下运行的 Midscene SDK/CLI）以卸载 AI 处理和自动化逻辑。
            *   `'In-Browser'`：扩展程序尝试使用浏览器的本机 `fetch` API 直接调用 AI 服务。如果 AI 模型可通过标准 HTTP/S 端点访问并且提供了必要的（API 密钥）配置，则会使用此模式。
            *   `'In-Browser-Extension'`：与 `'In-Browser'` 类似，但特别指明逻辑在扩展程序自身的上下文（例如，弹出页面本身）中运行。
        *   `config: Record<string, string>`：一个存储已解析的键值配置数据的对象。这通常包括 AI 服务 API 密钥、模型名称、基本 URL 以及 AI 服务交互所需的其他参数。此对象派生自 `configString`。
        *   `configString: string`：表示用户配置的原始多行字符串，通常采用类似于 `.env` 文件的格式（例如，`OPENAI_API_KEY=sk-xxxx`）。用户通常可以在扩展程序的设置 UI 中粘贴或编辑此字符串。
        *   `forceSameTabNavigation: boolean`：一个布尔标志，控制导航操作（如通常会打开新选项卡的链接单击）是否应强制在当前选项卡内发生。这对于 `ChromeExtensionProxyPage`尤为重要。
        *   `popupTab: 'playground' | 'bridge'`：一个字符串，用于跟踪扩展程序弹出 UI 中当前活动的选项卡（“Playground”或“桥接模式”）。
    *   **操作**：
        *   `setServiceMode()`：允许更改 `serviceMode`。
        *   `loadConfig()`：接收原始配置字符串，使用内部 `parseConfig` 实用程序（处理类似 `.env` 的行、注释和带引号的值）对其进行解析，并更新存储中的 `configString` 和已解析的 `config` 对象。
        *   `setForceSameTabNavigation()`：更新选项卡导航首选项。
        *   `setPopupTab()`：更新弹出窗口中的活动选项卡。
    *   **持久性**：为确保用户设置在浏览器会话和扩展程序更新之间得以保留，此状态的关键部分（`configString`、`serviceMode`、`forceSameTabNavigation`）将持久保存到浏览器的 `localStorage` 中。配置在存储初始化时从 `localStorage` 加载。

这种基于 Zustand 的状态管理系统提供了一种反应式且持久的方式来处理 Chrome 扩展程序内的用户首选项和操作配置，使其能够适应不同的用户需求和设置，特别是用于配置直接 AI 服务访问或准备桥接模式连接。

### 7.2. 组件间的数据传递

Midscene 内的数据流是多方面的，涉及针对交互组件及其环境量身定制的各种机制。理解此流程是了解用户意图或脚本定义如何转换为浏览器操作以及结果如何反馈的关键。

1.  **用户输入到执行引擎**：
    *   **CLI (YAML 脚本)**：当用户运行 `midscene <path_to_yaml>` 时，CLI (`packages/cli`) 会解析 YAML 文件。这种结构化数据表示任务和配置（由 `packages/core/src/yaml.ts` 中的类型定义），并传递给 `ScriptPlayer`（来自 `@midscene/web/yaml`）。然后，`ScriptPlayer` 使用此数据做出决策，例如实例化哪个代理（Web 或 Android）以及执行什么操作序列。
    *   **SDK (JavaScript/TypeScript)**：当 Midscene 作为库使用时，数据（如自然语言提示或目标 URL）作为标准函数参数传递给 `PageAgent` 方法（例如，`agent.aiTap("login button")`）。
    *   **Chrome 扩展程序 Playground**：Playground UI 中用户键入的自然语言命令由 React 组件捕获并传递给 `ChromeExtensionProxyPageAgent` 实例。
2.  **配置数据**：
    *   **环境变量**：`packages/shared/src/env.ts` 提供了一种访问操作系统级别环境变量的集中方式。这些变量由各种包读取（例如，`packages/core` 中的 `service-caller` 用于 API 密钥，`packages/cli` 用于操作标志）。
    *   **Chrome 扩展程序 `localStorage`**：如 7.1 节所述，扩展程序通过其 Zustand 存储使用 `localStorage` 来持久化和检索用户提供的配置（API 密钥、模型选择），使其可用于其内部 `ChromeExtensionProxyPageAgent` 或用于设置桥接模式。
3.  **进程间通信（桥接模式）**：当 SDK/CLI 通过 Chrome 扩展程序控制浏览器时，这是一条关键的数据路径。
    *   **机制**：采用 Socket.IO 实现基于 WebSocket 的 RPC 通道。`BridgeServer`（在 `packages/web-integration` 中，由 SDK/CLI 运行）和 `ExtensionBridgePageBrowserSide`（在 Chrome 扩展程序中）是两个端点。
    *   **数据流**：
        *   *SDK 到扩展程序*：诸如“获取 URL”或“在 (x,y) 处单击元素”之类的命令由 `AgentOverChromeBridge` 序列化为 `BridgeCallRequest` (`{ id, method, args }`)，并通过 `BridgeServer` 发送到 `ExtensionBridgePageBrowserSide`。
        *   *扩展程序到 SDK*：已执行命令的结果（例如，URL 字符串、成功/失败状态）或错误被打包到 `BridgeCallResponse` (`{ id, response, error }`) 中，由 `ExtensionBridgePageBrowserSide` 发回。
    *   **序列化**：通过 WebSocket 传递的数据被隐式序列化（可能由 Socket.IO 序列化为 JSON）。
4.  **浏览器交互数据（捕获页面状态）**：
    *   **`UIContext` 作为核心数据结构**：无论采用何种模式（CDP、Playwright、Puppeteer），`PageAgent`（在 `packages/web-integration` 中）都负责捕获网页的当前状态。这涉及：
        *   截取屏幕截图（base64 编码的图像）。
        *   注入并执行 `midscene_element_inspector` 脚本 (`packages/shared/src/extractor/`) 以获取 DOM 的结构化表示 (`ElementTreeNode<ElementInfo>`)。
        *   获取页面尺寸。
    *   此数据被组装到一个 `WebUIContext` 对象中（在 `packages/web-integration` 中定义的类型，扩展自 `packages/core` 中的 `UIContext`）。
5.  **将页面状态传递给 AI 核心**：
    *   `WebUIContext` 从 `PageAgent` 传递到 `packages/core` 中的 `Insight` 类（通常通过 `contextRetrieverFn`）。
    *   `packages/core/src/ai-model/` 中的模块（例如，`prompt/util.ts::describeUserPage`）然后使用此 `UIContext` 为 AI 生成提示，将屏幕截图与元素树的文本描述相结合。
6.  **与 AI 服务的通信**：
    *   **请求**：提示（文本，可能包含 VLM 的 base64 图像数据）作为 HTTP 请求（通常是带有包含提示消息的 JSON 主体的 POST 请求）发送到配置的 AI 服务端点。这由 `packages/core/src/ai-model/service-caller/index.ts` 管理。
    *   **响应**：AI 服务通常返回包含其分析、计划或已识别元素的 JSON 对象。
7.  **将 AI 洞察返回给操作执行器**：
    *   `service-caller` 解析 AI 的 JSON 响应。
    *   `packages/core` 中的更高级别函数（例如，`Insight.locate()`、`ai-model/llm-planning.ts::plan()`）将此原始 AI 输出处理为更精炼、结构化的 JavaScript 对象（如 `LocateResult`、`PlanningAIResponse`）。这些对象通常包含坐标、元素 ID、操作列表或提取的数据。
    *   然后将这些结构化结果返回给 `PageAgent`（或其 `PageTaskExecutor`）。`PageTaskExecutor` 使用此数据执行具体的浏览器操作（例如，使用坐标进行单击，或迭代计划的操作列表）。
8.  **日志记录和报告数据**：
    *   在所有过程中，都会捕获详细的日志、屏幕截图、AI 提示和响应。
    *   `PageAgent` 将这些累积到 `ExecutionDump` 对象中。
    *   然后，`packages/core/src/utils.ts` 中的实用程序使用这些转储来生成 HTML 报告，提供自动化会话的全面记录。
    *   持久性日志也由 `packages/shared` 中的 `logger` 写入 `midscene_run/log/` 目录。

因此，Midscene 中的数据流是一个精心策划的序列，将高级用户意图或脚本定义转换为用于 AI 处理的详细页面上下文，然后将 AI 输出转换回用于各种浏览器控制后端的 actionable 命令，同时捕获丰富的数据用于日志记录和报告。在进程或网络边界，序列化为 JSON 是一个共同的主题。

## 8. 测试与评估

Midscene 非常重视对其核心功能以及（至关重要的）其 AI 驱动组件的性能和可靠性进行严格测试。这是通过结合标准软件测试实践（单元测试、集成测试、E2E 测试）和位于 `packages/evaluation` 目录内的专用 AI 评估框架来实现的。该框架允许对各种 UI 自动化任务上的 AI 模型性能进行系统化和可量化的评估。

### 8.1. 执行的测试类型

Midscene 的测试策略包含多个层面，以确保从单个模块到完整的端到端场景的稳健性：

*   **单元测试**：标准单元测试在各个包内实现，`vitest.config.ts` 文件的存在证明了这一点（表明 Vitest 是一个常用的测试运行器和断言库）。这些测试侧重于在隔离环境中验证单个函数、类和模块的正确性。例如，`packages/shared` 中的实用程序函数（如图像处理或 DOM 实用程序谓词）、`packages/core/src/ai-model/service-caller` 中的特定解析逻辑（如 `safeParseJson`）或 `packages/cli` 中的参数解析都将接受单元测试。
*   **集成测试**：主要的 CI 工作流（`ci.yml` 执行 `pnpm run test`）隐式运行集成测试。这些测试确保 Midscene monorepo 中的不同包和组件能够正确交互。例如，它们可能会验证 `packages/cli` 是否可以正确实例化和利用来自 `packages/web-integration` 的代理，而后者又必须与 `packages/core` 正确接口以执行 AI 逻辑和感知任务。
*   **端到端 (E2E) 测试**：`ai.yml` 工作流专门用于使用 Playwright (`pnpm run e2e`) 运行 E2E 测试。这些测试模拟完整的用户场景，通过涉及 AI 驱动的规划和从头到尾执行的复杂交互来驱动 Web 浏览器。这验证了整个自动化管道，从高级指令到低级浏览器操作和断言。
*   **AI 模型和组件评估 (`packages/evaluation`)**：这是一种专门且关键的测试形式，专注于对各种 AI 模型（以及 Midscene 对它们的有效使用）在核心 UI 自动化任务上的性能进行基准测试。这些任务包括但不限于元素定位准确性、操作规划的连贯性和有效性，以及 UI 状态断言的正确性。这些评估通常是基于指标的（例如，定位的像素距离，任务的成功率），而不是简单的通过/失败二元结果。
*   **AI 单元测试 (`ai-unit-test.yml`)**：此 CI 工作流表明存在更侧重于特定 AI 组件或集成的测试，这些测试可能比完整的 E2E 场景更细粒度，但比纯单元测试更广泛。例如，使用模拟的浏览器环境测试特定的 AI 提示结构，验证不同 AI 服务的响应解析，或使用已知的输入和输出测试边界框适配函数。

### 8.2. AI 评估框架 (`packages/evaluation`)

`packages/evaluation` 目录提供了一个用于评估 Midscene AI 功能的结构化环境。该框架对于 AI 模型和提示策略的数据驱动改进至关重要。

*   **测试数据生成 (`data-generator/`)**：
    *   此子目录包含 Playwright 脚本（例如，`generator-headed.spec.ts`、`generator-headless.spec.ts`）。这些脚本旨在自动化（或半自动化）导航到预定义网页、在必要时执行某些操作，然后系统地捕获创建评估测试用例所需数据的过程。这些数据通常包括屏幕截图和详细的 DOM 快照。
*   **测试数据存储 (`page-data/`)**：
    *   此目录充当评估中使用的原始数据资产的存储库。它被组织成子目录，其中每个子目录（例如，`antd-carousel/`、`todo/`、`online_order/`）通常对应于正在测试的特定网页、应用程序状态或 UI 组件。
    *   在每个这样的子目录中，常见文件包括：
        *   `input.png`：UI 状态的主要屏幕截图，在评估运行期间作为视觉上下文呈现给 AI 模型。
        *   `element-snapshot.json`：相关 DOM 元素及其属性（例如，标签名称、属性、文本内容、边界框、可见性）的结构化 JSON 表示。这很可能是在数据生成阶段由来自 `packages/shared` 的 `midscene_element_inspector` 脚本生成的，并作为非 VLM 模型的基准真相或详细上下文。
        *   `element-tree.json` / `element-tree.txt`：页面元素层次结构的可选或补充文本表示，可能用于不同类型的 AI 模型或各种分析目的。
*   **测试用例定义 (`page-cases/`)**：
    *   特定的评估场景在 JSON 文件中正式定义，这些文件按其旨在评估的主要 AI 任务进行分类（例如，`inspect/` 用于元素定位任务，`planning/` 用于操作规划，`assertion/` 用于 UI 状态断言，以及 `section-locator/` 用于识别较大 UI 区域的功能）。
    *   每个 JSON 文件（例如，`page-cases/inspect/todo.json`）通常包含一个 `testDataPath` 字段（引用 `page-data/` 中的一个子目录）和一个名为 `testCases` 的数组。此数组中的单个测试用例对象通常包括：
        *   `prompt`：将提供给 AI 模型的自然语言指令或查询。
        *   `response_rect`（特别是对于基于 VLM 的元素定位测试）：目标 UI 元素的预期基准真相边界框（`left`、`top`、`width`、`height`，以像素为单位）。
        *   `response_element`（对于基于 ID 的元素定位，通常与非 VLM 模型一起使用）：目标元素的预期 Midscene 生成的 `id`（有时是 `indexId`，它可能是一个视觉标记 ID），正如 `midscene_element_inspector` 所识别的那样。
        *   `response_planning`（对于规划任务）：一个描述预期操作序列的对象，包括操作 `type`、目标元素详细信息（`locate`，其本身可以包含预期的 `bbox`）以及 `more_actions_needed_by_instruction` 布尔标志。
        *   `annotation_index_id`：一个标识符，可用于将测试用例链接到相应屏幕截图上的视觉注释（例如，`todo.json-coordinates-annotated.png`），这有助于手动验证测试数据和预期结果的正确性。
        *   `deepThink`：一个布尔标志，可能指示此案例是否期望更耗费计算资源或更彻底的 AI 推理过程，或者是否用于生成基准真相。
*   **评估执行 (`tests/`)**：
    *   实际的评估脚本位于此目录中，并使用 `vitest` 测试框架执行。诸如 `llm-locator.test.ts`、`llm-planning.test.ts` 和 `assertion.test.ts` 之类的测试文件驱动各自 AI 任务的评估过程。
    *   **评估测试脚本的一般工作流程**：
        1.  **环境设置**：脚本通常首先使用 `dotenv` 加载必要的配置，这对于为正在评估的 AI 模型设置 API 密钥和模型名称（例如，来自 `MIDSCENE_MODEL_NAME`）至关重要。
        2.  **测试用例迭代**：脚本迭代预定义的 `testSources` 列表（例如，'todo'、'online_order'，对应于 `page-data/` 和 `page-cases/` 中的子目录）。对于每个源，它们从相关的 JSON 文件加载关联的测试用例。
        3.  **上下文准备**：对于每个单独的测试用例，`buildContext(source)` 实用程序函数（来自 `tests/util.ts`）从适当的 `page-data/` 目录加载 `input.png` 屏幕截图和结构化 DOM 数据（`element-snapshot.json` 或 `element-tree.json`）。此数据用于构建 Midscene 的 `Insight` 类（来自 `packages/core`）或规划模块所需的 `UIContext` 对象作为输入。
        4.  **AI 调用**：使用准备好的 `UIContext` 实例化一个 `Insight` 对象。然后使用当前测试用例中的 `prompt` 和其他参数（如 `deepThink` 状态）调用 `Insight` 类的相关方法（例如，`insight.locate()` 或规划函数）。
        5.  **结果收集**：捕获 AI 返回的实际结果（例如，定位元素的属性、生成的操作计划）和执行时间 (`cost`) 以进行分析。
*   **结果分析和日志记录 (`src/test-analyzer.ts::TestResultCollector`)**：此类是系统分析评估运行的核心。
    *   **初始化**：创建 `TestResultCollector` 实例时，它会接收一个 `testName`（通常派生自指示操作模式的标签，例如，VLM 测试的 'by_coordinates' 或基于 ID 的测试的 'by_element'）和当前的 `modelName`（从 `MIDSCENE_MODEL_NAME` 环境变量中检索）。此信息用于在 `packages/evaluation/tests/__ai_responses__/[modelName]/` 下创建唯一的、有组织的日志文件路径。
    *   **`addResult()`**：在执行每个测试用例后调用此方法。其主要作用是调用内部 `compareResult()` 方法以确定 AI 的 `actualResult` 是否与 `testCase` 的预期结果匹配。然后，它会将有关测试的详细信息（包括其成功或失败状态、测试用例详细信息、实际 AI 响应、预期响应（如果不同）、任何错误消息以及执行成本）记录到两个不同的文件中：一个用于所有结果的通用日志文件和一个专门用于失败案例的单独日志文件。这种分离有助于快速识别故障。
    *   **`compareResult()`**：此方法包含用于将 AI 的输出与测试用例中定义的基准真相进行比较的核心逻辑。比较逻辑特定于任务：
        *   对于**规划任务**，它验证 AI 计划中的操作类型序列是否与预期序列匹配，`more_actions_needed_by_instruction` 标志是否正确，以及如果目标元素涉及边界框，则使用像素距离度量 (`distanceOfTwoBbox`) 将 AI 预测的 `bbox` 与预期的 `bbox` 进行比较，并与预定义的 `distanceThreshold`（例如，16 像素）进行比较。
        *   对于**基于 VLM 的元素定位任务**，它使用 `distanceOfTwoRect`（计算矩形中心之间的距离）将 AI 返回的 `rect`（矩形）与测试用例中的 `response_rect` 进行比较，并与相同的像素阈值进行比较。
        *   对于**基于 ID 的元素定位任务**（常见于非 VLM 模型），它将 AI 定位的元素的 `id`（或 `indexId`）与测试用例中指定的预期 ID 进行比较。
        *   如果比较成功（即，在几何比较的定义阈值内），该方法返回 `true`；如果失败，则返回包含描述性消息的 `Error` 对象。
    *   **`printSummary()`**：在一个套件中的所有测试（例如，给定数据源的所有定位器测试，或一个文件中的所有测试）完成后，调用此方法（通常通过 `vitest` 中的 `afterAll`）。它计算并向控制台打印一个摘要表。此摘要按 `caseGroup`（例如，'todo'、'online_order'）分组，并包括关键绩效指标 (KPI)，例如案例总数、成功和失败计数、通过率（百分比）、平均执行成本（毫秒）以及该组的总时间成本。这提供了对 AI 在不同场景中性能的快速清晰的概述。
    *   **`analyze()` (质量门控)**：此方法支持在 CI 过程中实施质量门。它检查特定 `caseGroup` 内的失败案例数量是否超过可配置的 `allowFailCaseCount`。如果失败计数超过此阈值，它会将失败案例的提示打印到控制台（以便于立即调试），然后抛出错误。这对于 CI 环境至关重要，因为如果 AI 性能低于可接受的水平，它将导致构建或测试运行失败。
*   **更新基准真相数据 (`UPDATE_ANSWER_DATA` 标志)**：
    *   评估脚本（例如，`llm-locator.test.ts`）包含一个用于管理基准真相数据的宝贵功能，通过设置 `UPDATE_ANSWER_DATA` 环境变量来激活。当此标志激活时，脚本以“更新”模式运行：它们不会根据现有基准真相断言 AI 的结果，而是会使用从当前配置的 AI 模型获得的新结果覆盖相应 `page-cases/*.json` 文件中的 `response_rect`、`response_element` 或 `response_planning` 字段。这种机制对于以下方面非常有用：
        *   随着 AI 模型的改进或其行为的轻微变化，有效地维护和更新测试套件。
        *   简化添加新测试用例的过程：可以创建输入数据 (`page-data/`) 和基本的测试用例结构，然后使用此标志运行评估以自动生成初始的“正确”答案（然后应手动验证和微调）。
        *   它还有助于生成带注释的屏幕截图（例如，`*-coordinates-annotated.png`），其中 AI 预测的边界框绘制在输入图像上，提供了一种快速直观的方式来检查和验证 VLM 定位器的准确性。

### 8.3. 与 CI 工作流集成

测试和评估框架不仅仅是一个独立的工具，它还通过 GitHub Actions 紧密集成了项目的 CI/CD 管道，确保 AI 性能得到持续监控：
*   **`ai-evaluation.yml` 工作流**专门设计用于执行这些评估脚本。它通常运行诸如 `pnpm run evaluate:locator`、`pnpm run evaluate:planning` 之类的命令，这些命令又会触发相应的 `vitest` 测试脚本（例如，`llm-locator.test.ts`）。来自 `TestResultCollector` 的输出日志（存储在 `packages/evaluation/tests/__ai_responses__/` 中）作为构建工件上传。这种做法允许开发人员和研究人员跟踪 AI 性能随时间变化的趋势，通过检查 AI 的原始响应与预期进行比较来详细分析故障，并比较不同模型版本或提示策略的有效性。
*   其他 CI 工作流，例如 **`ai-unit-test.yml`** 和 **`ai.yml`**（用于 E2E 测试），也通过执行不同的测试集为 AI 组件的整体质量保证做出贡献。它们还会生成自己的报告（例如，来自 `packages/web-integration/midscene_run/report`），这些报告可以使用类似的原则或补充工具进行分析，以确保 AI 功能在更广泛的应用程序上下文中正常运行。

总而言之，Midscene 采用了一种稳健、数据驱动且自动化的测试和评估方法，特别关注其 AI 功能。这一全面的策略包括系统的测试数据生成和管理、具有可版本化基准真相的明确定义的测试用例、使用 `vitest` 自动执行评估脚本、使用 `TestResultCollector` 对结果进行定量分析，以及与 CI 工作流无缝集成以进行持续的性能监控和回归检测。轻松更新基准真相数据的能力也使得该框架随着 AI 模型和 Midscene 平台本身的发展而具有适应性和可持续性。这种严格的测试对于在 AI 驱动的自动化系统中建立信任和可靠性至关重要。

## 9. 可扩展性和配置

Midscene 设计了多种配置和扩展机制，允许用户和开发人员根据特定的 AI 模型、目标应用程序和自动化需求对其进行定制。这种适应性是其在各种场景中发挥作用的关键。

### 9.1. 关键配置点

Midscene 中的配置通过环境变量（用于全局和后端设置）、命令行参数（用于 CLI 执行）、YAML 自动化脚本中的属性（用于特定于任务的行为）以及 Chrome 扩展程序 UI 中的设置（用于用户特定的首选项和独立操作）的组合进行管理。

*   **环境变量（由 `packages/shared/src/env.ts` 管理）**：这是配置后端设置的主要方法，特别是与 AI 模型访问、操作行为和调试相关的设置。`packages/shared/src/env.ts` 文件定义了一个公认的环境变量键的完整列表。这些变量通常在执行 Midscene SDK 或 CLI 的 shell 环境中设置，或者可以从项目根目录下的 `.env` 文件加载。可通过环境变量配置的关键方面包括：
    *   **AI 模型选择**：
        *   `MIDSCENE_MODEL_NAME`：指定要使用的默认语言或多模态模型（例如，“gpt-4o”、“claude-3-opus-20240229”）。
        *   与 `vlLocateMode` 相关的变量（例如，`MIDSCENE_USE_QWEN_VL`、`MIDSCENE_USE_DOUBAO_VISION`、`MIDSCENE_USE_GEMINI`、`MIDSCENE_USE_VLM_UI_TARS`）：这些布尔标志确定哪个视觉语言模型（或类似 VLM 的模式，如 UI-TARS）对于需要直接视觉处理的任务处于活动状态。系统设计为一次只有一个处于活动状态以避免冲突。
    *   **AI 服务凭据和端点**：
        *   `OPENAI_API_KEY`、`OPENAI_BASE_URL`：用于 OpenAI 模型和兼容的第三方服务。`OPENAI_BASE_URL` 允许指向自定义或代理 OpenAI API 端点。
        *   `ANTHROPIC_API_KEY`：用于访问 Anthropic 的 Claude 模型。
        *   Azure OpenAI 特定变量：`AZURE_OPENAI_ENDPOINT`、`AZURE_OPENAI_KEY`、`AZURE_OPENAI_API_VERSION`、`AZURE_OPENAI_DEPLOYMENT`、`MIDSCENE_AZURE_OPENAI_SCOPE`。这些允许利用 Azure AI 平台的用户进行详细配置。
    *   **AI 行为定制**：
        *   `OPENAI_MAX_TOKENS`：设置 AI 在响应中允许生成的最大令牌数，有助于控制成本和响应延迟。
        *   `MIDSCENE_FORCE_DEEP_THINK`：一个全局开关，可以为元素定位任务启用“深度思考”模式，这可能涉及更彻底（但可能更慢）的 AI 推理，例如在元素定位之前使用区域定位。
        *   `MIDSCENE_PREFERRED_LANGUAGE`：允许用户为 AI 生成的文本响应（如元素描述或想法）建议首选语言（例如，“中文”、“英文”）。
    *   **网络配置**：`MIDSCENE_OPENAI_SOCKS_PROXY`、`MIDSCENE_OPENAI_HTTP_PROXY` 支持通过指定的代理服务器路由 AI API 调用，这在某些企业或受限网络环境中至关重要。
    *   **调试和日志记录**：
        *   `MIDSCENE_DEBUG_MODE` 或标准 `DEBUG` 变量（例如，`DEBUG=midscene:ai:call,midscene:web:page`）：通过 `debug` 库启用来自指定 Midscene 模块的详细日志记录输出。这对于故障排除非常宝贵。
        *   `MIDSCENE_LANGSMITH_DEBUG`：激活与 LangSmith 的集成，用于 LLM 应用程序调用的高级跟踪和调试。
        *   `MIDSCENE_RUN_DIR`：指定 Midscene 操作输出（日志、报告、缓存）的根目录，默认为当前工作目录中的 `midscene_run`。
    *   **功能标志**：
        *   `MIDSCENE_CACHE`：一个布尔标志，用于启用或禁用 AI 任务结果（元素位置、计划）的缓存，以加快重复执行的速度。
    *   **特定于平台的路径**：`MIDSCENE_ADB_PATH`：允许用户指定其 Android 调试桥 (ADB) 可执行文件的路径（如果它不在系统的默认 PATH 中），这对于 Android 自动化至关重要。
*   **高级 AI 服务连接详细信息 (`packages/core/src/ai-model/service-caller/index.ts`)**：
    *   此模块中的 `createChatClient` 函数使用环境变量来选择和配置适当的 AI SDK 客户端。
    *   对于未被专用环境变量覆盖的高度特定或新引入的 SDK 参数，Midscene 提供了 `MIDSCENE_OPENAI_INIT_CONFIG_JSON` 和 `MIDSCENE_AZURE_OPENAI_INIT_CONFIG_JSON`。这些允许用户在客户端初始化期间将包含其他配置选项的 JSON 字符串直接传递给 OpenAI 或 Azure OpenAI SDK，从而为细粒度控制提供了一个强大的逃生舱口。
*   **命令行界面 (CLI) 参数 (`packages/cli/src/cli-utils.ts`)**：
    *   通过 `midscene` CLI 运行自动化时，用户可以提供修改该特定运行执行行为的参数：
        *   主要参数是 `<path-to-yaml-script-file-or-directory>`，指定要执行的自动化脚本。
        *   `--headed`：覆盖浏览器自动化的默认无头模式，在可见窗口中运行浏览器。这对于实时观察自动化和调试脚本至关重要。
        *   `--keep-window`：指示 CLI 即使在脚本完成执行后也保持浏览器窗口打开。这对于检查网页的最终状态或调试关闭过快的自动化流程很有用。
*   **YAML 脚本属性（模式定义在 `packages/core/src/yaml.ts` 中）**：
    *   YAML 脚本格式本身是一个主要的配置点，允许对单个自动化任务和环境进行细粒度控制。用户可以定义：
        *   **目标环境**：YAML 中的 `web` 或 `android` 部分允许指定特定于环境的参数。对于 `web`，这包括要导航到的 `url`、Puppeteer 特定的启动选项（`userAgent`、`viewportWidth`、`viewportHeight`、`cookie`）和桥接模式设置（`bridgeMode: 'newTabWithUrl' | 'currentTab'`、`closeNewTabsAfterDisconnect`）。对于 `android`，这包括 `deviceId` 和应用程序或 URL 的 `launch` 字符串。
        *   **全局 AI 上下文**：可以在脚本级别提供 `aiActionContext`。此字符串将传递给该脚本中所有任务的 AI，提供总体上下文，帮助 AI 更好地理解应用程序的领域或特定目标。
        *   **任务级选项**：YAML 任务中的单个流程项（操作）可以具有特定选项，用于微调该步骤的 AI 行为。例如，诸如 `aiTap` 或 `aiInput` 之类的 AI 操作接受 `LocateOption` 参数，例如 `deepThink: true/false`（控制元素搜索的彻底性，可能首先使用区域定位）或 `cacheable: true/false`（覆盖该特定步骤的全局缓存行为）。类似地，`aiQuery` 可以采用 `InsightExtractOption` 来控制是否将 DOM 结构或屏幕截图包含在为数据提取提供给 AI 的上下文中。
*   **Chrome 扩展程序设置 (`apps/chrome-extension/src/store.tsx`)**：
    *   如第 7.1 节所述，Chrome 扩展程序提供了自己的 UI 进行配置，设置持久保存在浏览器的 `localStorage` 中（通过 Zustand 存储管理）。这对于使用扩展程序“Playground”或希望使用“浏览器内”AI 服务模式的用户尤为重要。
    *   用户可以直接在扩展程序内的文本区域中输入其 AI 提供商凭据（API 密钥、模型名称、基本 URL），该文本区域会解析这个类似 `.env` 的 `configString`。
    *   他们还可以设置 `serviceMode`（服务器、浏览器内、浏览器内扩展程序）和 UI 首选项，如 `forceSameTabNavigation`。

这种多层配置系统——涵盖全局环境设置、CLI 标志、详细的 YAML 脚本指令以及交互式 Chrome 扩展程序首选项——使得 Midscene 能够高度适应广泛的操作要求和用户偏好。

### 9.2. 使用新的 AI 模型或服务进行扩展

Midscene 的架构，特别是 `packages/core` 中 `service-caller` 模块的设计，具有可扩展性，允许将来集成新的 AI 模型或服务提供商，超越当前支持的 OpenAI/Azure 和 Anthropic SDK。以下是如何添加对假设的“NewAIProvider”支持的概念性概述：

1.  **添加 SDK/客户端库**：如果“NewAIProvider”提供官方 Node.js SDK，则将其添加为项目依赖项。如果不存在 SDK，则需要开发自定义 HTTP 客户端以与“NewAIProvider”的特定 API 端点交互，处理身份验证、请求格式化和响应解析。
2.  **更新环境配置 (`packages/shared/src/env.ts`)**：
    *   定义新的环境变量键，用于保存“NewAIProvider”所需的凭据和配置（例如，`NEWAI_API_KEY`、`NEWAI_BASE_URL`、任何特定于模型的参数）。
    *   这些新键必须添加到 `allConfigFromEnv()` 函数中，以便它们被识别并加载到可通过 `getAIConfig()` 访问的全局配置中。
3.  **修改 `service-caller/index.ts` 中的 `createChatClient`**：
    *   扩展 `createChatClient` 中的条件逻辑以包含“NewAIProvider”的新块。
    *   此块将首先检查“NewAIProvider”所需的环境变量（例如，`NEWAI_API_KEY`）是否已设置且有效。
    *   如果是，它将使用这些配置实例化“NewAIProvider”客户端（其 SDK 或自定义 HTTP 客户端）。例如：`const newAiClient = new NewAIProviderSDK.Client({ apiKey: getAIConfig('NEWAI_API_KEY'), baseUrl: getAIConfig('NEWAI_BASE_URL') });`。
    *   然后，该函数应返回一个对象，该对象标准化对客户端聊天完成（或等效）功能的访问，并包含一个用于在 `call` 函数中使用的唯一“样式”标识符，例如 `{ completion: newAiClient.chat, style: 'newaiprovider' }`。
4.  **调整 `call` 函数 (`service-caller/index.ts`) 中的请求/响应处理**：
    *   发出实际 API 请求的主 `call` 函数将需要一个新的 `else if (style === 'newaiprovider') { ... }` 块。
    *   **请求适配**：在此块内部，Midscene 的标准提示消息格式（一个 `ChatCompletionMessageParam` 类对象数组，可能包含 VLM 的图像数据）必须转换为“NewAIProvider”API 期望的特定请求格式。这可能涉及：
        *   重构消息数组（例如，不同的角色名称，如 'human' 与 'user'）。
        *   以不同方式处理图像数据（例如，不同的编码方法、URL 引用与直接字节上传、每条消息单个与多个图像）。
        *   将 Midscene 的通用参数（如 `temperature`、`max_tokens`）映射到“NewAIProvider”的等效参数。
    *   **响应适配**：从“NewAIProvider”接收到 HTTP 响应后，此块必须对其进行解析（如果是 JSON、XML 或其他格式）并将相关部分映射回 Midscene 内部期望的结构，即 `{ content: string; usage?: AIUsageInfo }`。这涉及提取模型生成的主要文本内容和任何可用的令牌使用情况统计信息（提示令牌、完成令牌、总令牌）。
5.  **JSON 解析和输出处理**：
    *   如果期望“NewAIProvider”返回 JSON 但具有特定的输出怪癖或不严格遵守 JSON 标准，则可能需要在 `safeParseJson` 函数内部或在调用 `safeParseJson` 之前作为初步步骤进行自定义预处理逻辑（类似于 `preprocessDoubaoBboxJson`）。
    *   如果新模型支持特定的“JSON 模式”或结构化输出机制，则应设计请求适配逻辑以利用该机制来提高可靠性。
6.  **VLM 坐标归一化（如果“NewAIProvider”是 VLM）**：
    *   如果“NewAIProvider”是视觉语言模型并返回元素的边界框坐标，则需要在 `packages/core/src/ai-model/common.ts` 中创建新的适配函数（类似于 `adaptQwenBbox`、`adaptGeminiBbox`）。这些函数对于将“NewAIProvider”的特定坐标系（例如，归一化的 [0-1] 与绝对像素，不同的点顺序如 [xmin, ymin, xmax, ymax] 与 [ymin, xmin, ymax, xmax]）和格式转换为 Midscene 内部的 `Rect` 对象格式至关重要。
    *   `packages/shared/src/env.ts` 中的 `vlLocateMode` 逻辑也需要使用新的环境变量（例如，`MIDSCENE_USE_NEWAI_VL`）和相应的返回值进行更新，以允许用户选择和激活这个新的 VLM。
7.  **特定于模型的提示（可选但很可能）**：
    *   不同的 AI 模型通常在以特定方式构建或带有特定系统消息的提示下表现最佳。如果“NewAIProvider”有此类偏好，则可能需要在 `packages/core/src/ai-model/prompt/` 的文件中精心制作新的提示变体。然后，`packages/core` 中的核心逻辑（例如，`Insight` 类中的方法或规划函数）可能需要进行调整，以便在“NewAIProvider”是活动模型时选择这些新的提示变体。
8.  **Chrome 扩展程序中的配置（可选）**：
    *   如果新模型旨在可配置并可直接从 Chrome 扩展程序的“浏览器内”服务模式使用，则 `apps/chrome-extension/src/store.tsx` 中的 `parseConfig` 函数（解析来自 `localStorage` 的类似 `.env` 的字符串）可能需要更新，以识别并正确解析与“NewAIProvider”关联的任何新配置键。

虽然没有明确详细说明一个完全通用的、即插即用的 AI 提供商接口（例如，只需实现一些预定义的方法），但 `service-caller` 模块的当前结构为这类扩展提供了一个清晰、集中的模式。主要的开发工作将涉及理解新提供商的 API、编写客户端交互逻辑，并确保 Midscene 内部结构与提供商特定格式之间的无缝数据转换。

### 9.3. 适应不同的 Web 应用程序或场景

Midscene 提供了强大的机制，供用户和开发人员为各种 Web 应用程序以及特定的测试或自动化场景定制自动化逻辑。这种适应性源于其灵活的输入方法（自然语言、YAML、SDK）及其 AI 驱动的 UI 理解方法。

*   **YAML 脚本编写（模式在 `packages/core/src/yaml.ts` 中）**：
    *   这是最终用户和测试人员定义自定义自动化流程的主要方法，无需深入的编程知识。YAML 模式设计得富有表现力，并允许：
        *   **定义操作序列**：用户可以在命名的 `tasks` 中创建项目 `flow`。每个项目代表一个操作或运算。
        *   **AI 驱动的命令**：大多数交互都是 AI 驱动的（例如，`aiTap`、`aiInput`、`aiQuery`、`aiAssert`、`aiScroll`、`aiAction`）。这里的主要定制点是为每个命令提供的**自然语言提示**。用户定制这些提示以引用特定于其目标应用程序 UI 和工作流程的元素、数据或操作。例如，`aiTap: "主登录按钮"` 或 `aiQuery: "购物车中所有商品的列表"`。
        *   **微调 AI 行为**：这些 AI 命令中的选项，例如 `LocateOption`（包括 `deepThink` 和 `cacheable`）或 `InsightExtractOption`（包括 `domIncluded` 和 `screenshotIncluded`），允许用户影响 AI 如何处理特定步骤的任务。例如，对于需要更多推理的视觉模糊元素，可以使用 `deepThink: true`，而对于其状态不应缓存的高度动态元素，则可能适合使用 `cacheable: false`。
        *   **直接浏览器交互**：`evaluateJavaScript` 流程项允许用户直接在页面上下文中执行任意 JavaScript 代码。这为标准 Midscene AI 操作未涵盖的自定义交互、数据提取逻辑或操作提供了一个强大的逃生舱口。
        *   **环境配置**：YAML 脚本可以定义具有特定参数的目标环境（`web` 或 `android`）。对于 `web` 目标，这包括起始 `url`、Puppeteer 特定的浏览器选项（如 `userAgent`、`viewportWidth`、`viewportHeight`、`cookie`）和桥接模式设置（`bridgeMode: 'newTabWithUrl' | 'currentTab'`、`closeNewTabsAfterDisconnect`）。对于 `android` 目标，它包括 `deviceId` 和应用程序 `launch` 字符串。这使得相同的逻辑流程可能针对不同的设置运行。
        *   **AI 的全局上下文**：可以在脚本级别提供 `aiActionContext`。此字符串将传递给该脚本中所有任务的 AI，提供总体上下文，帮助 AI 更好地理解应用程序的领域、常见的用户角色或 UI 中使用的特定术语。
    *   这种以自然语言和可配置 AI 操作为中心的声明性方法，允许用户创建和修改高度特定于其应用程序 UI 和工作流程的自动化脚本，通常无需担心脆弱的选择器。
*   **JavaScript/TypeScript SDK (`packages/web-integration/src/common/agent.ts` 中的 `PageAgent` API)**：
    *   对于需要更复杂逻辑、条件分支、复杂错误处理或与现有测试框架（如 Jest、Mocha 或自定义测试运行器）集成的开发人员，Midscene SDK 提供了一套全面的 API。
    *   `PageAgent` 类是编程自动化的主要入口点。其方法（例如，`agent.aiTap()`、`agent.aiQuery()`、`agent.aiAction()`、`agent.runYaml()`）反映了 YAML 中可用的功能，但提供了通用编程语言的全部功能。
    *   **SDK 使用的好处**：
        *   **动态提示构建**：可以根据应用程序状态、测试数据或先前的 AI 输出动态构建 AI 操作的提示。
        *   **结果的自定义逻辑**：开发人员可以实现自定义逻辑来处理 AI 调用返回的结构化数据（例如，来自 `aiQuery` 或 `aiLocate` 的数据）、执行复杂计算或根据此数据做出决策。
        *   **与外部系统集成**：SDK 允许轻松地将 Midscene 操作与外部数据源、API、数据库或报告框架集成。
        *   **可重用的自动化模块**：开发人员可以创建可重用的函数、类或页面对象模型，这些模型封装了特定于其目标应用程序的常见自动化模式，从而产生更结构化、可维护和可扩展的自动化代码库。
*   **自定义提示工程**：
    *   虽然 Midscene 为其核心 AI 任务提供了有效的默认提示（如 `packages/core/src/ai-model/prompt/` 中所定义），但 SDK 用户可以通过仔细制作各种 `PageAgent` 方法的自然语言输入（`prompt` 参数）来显著影响 AI 行为。提示越具描述性和明确性，AI 的表现就可能越好。
    *   `aiActionContext` 参数（在 YAML 和 SDK 方法如 `PageAgent.aiAction()` 中均可用）允许用户为整个脚本或会话向 AI 提供总体性的、特定于领域的上下文。这可以包括有关应用程序用途、常见用户角色、UI 中使用的特定术语或交互的一般指南的详细信息，帮助 AI 更好地解释模糊指令并做出更明智的决策。
*   **元素提取配置（间接）**：
    *   核心 `midscene_element_inspector` 脚本（来自 `packages/shared/src/extractor/`）使用一组启发式方法来确定哪些 DOM 元素是“交互式”或“文本式”的。虽然最终用户直接配置这些启发式方法不是标准功能，但 AI 处理视觉屏幕截图和文本 DOM 树（如 `descriptionOfTree` 所述）的能力提供了一定程度的稳健性。如果默认提取不能完美捕获元素的性质，AI 通常仍然可以通过将视觉提示与文本信息相关联或通过用户提供更具描述性的提示来成功。对于非常不寻常的自定义元素，从源代码构建的高级用户可能会修改提取器逻辑，尽管这是一个更复杂的定制。

通过这些机制——特别是自然语言提示的表达能力与 YAML 提供的结构化控制以及 JavaScript/TypeScript SDK 的编程灵活性相结合——Midscene 为用户和开发人员提供了相当大的自由度，使其能够将其自动化功能适应各种 Web 应用程序和特定的自动化目标。重点是利用 AI 来减少对详细、脆弱配置的需求，允许用户专注于他们想要实现的目标，而不是如何精确选择每个元素。

### 9.4. 插件架构和显式扩展点

虽然 Midscene 目前没有像某些传统软件那样高度明确或正式的插件架构（例如，具有插件市场或用于在不修改核心包的情况下添加全新类型操作的非常通用的 API 的系统），但其模块化设计和特定抽象确实提供了几个隐式和显式的扩展点：

1.  **AI 模型服务集成（最明确的扩展点）**：
    *   如第 9.2 节所述，`packages/core/src/ai-model/service-caller/index.ts` 模块的结构允许添加新的 AI 服务提供商。`createChatClient` 函数充当中央调度程序，`call` 函数包含用于请求/响应处理的适配逻辑。添加对新 AI 模型的支持主要涉及使用特定于提供商的客户端实例化和数据转换逻辑来扩展这两个函数。这是扩展 Midscene 核心 AI 功能以适应新的或自定义模型的最明确和最受期待的领域。
2.  **浏览器驱动程序抽象 (`AbstractPage` 接口)**：
    *   在 `packages/web-integration/src/page.ts` 中定义的 `AbstractPage` 接口充当浏览器交互的契约。它目前由 `ChromeExtensionProxyPage`（用于基于 CDP 的控制）和 `BasePage`（支持 Playwright 和 Puppeteer 集成）实现。
    *   这种抽象理论上允许集成其他浏览器自动化驱动程序或远程浏览器服务。开发人员可以为不同的后端（例如，用于 Safari 的基于 WebDriver 的驱动程序，或用于基于云的浏览器场服务（如 BrowserStack 或 Sauce Labs）的适配器）创建一个实现 `AbstractPage` 接口的新类。然后，这个新的页面实现可以被现有的 `PageAgent`（来自 `packages/web-integration/src/common/agent.ts`）使用，从而使 Midscene 的 AI 功能能够与该新驱动程序一起使用。这将是一项重大的开发工作，但在架构上得到了接口的支持。
3.  **使用 `evaluateJavaScript` 进行自定义脚本编写**：
    *   YAML 流程项 (`evaluateJavaScript: "your_script_here"`) 和 `PageAgent` SDK（通过 `agent.page.evaluateJavaScript("your_script_here")`）都提供了一个操作，用于直接在正在自动化的网页上下文中执行任意 JavaScript 代码。
    *   这是一个强大但较低级别的扩展点。它允许用户：
        *   执行标准 Midscene 操作未涵盖的自定义 DOM 操作或查询。
        *   从页面的 JavaScript 环境或全局变量中提取高度特定或复杂的数据。
        *   以特定于目标应用程序的独特方式与页面元素或 JavaScript 对象（例如，图表库的 API）交互。
        *   实际上，这使用户能够在其更广泛的自动化脚本中为特定任务编写自己的“迷你插件”或自定义交互片段，而无需修改 Midscene 的核心代码。
4.  **用于编程扩展和组合的 SDK**：
    *   为复杂场景“扩展”Midscene 的最常见和预期方式是使用其 JavaScript/TypeScript SDK。开发人员可以利用 `PageAgent` 和 `packages/core` 中的功能（如 `Insight`）来构建自定义应用程序、更复杂的自动化框架或专门的测试工具。
    *   这允许：
        *   创建针对特定应用程序量身定制的可重用自动化模块或页面对象模型 (POM)。
        *   围绕 Midscene 的 AI 操作实现复杂的条件逻辑、循环和错误处理。
        *   将 Midscene 的功能与外部数据源、API、数据库或自定义报告系统集成。
        *   从本质上讲，任何可以在 Node.js 中编码的自定义行为都可以围绕 Midscene 的核心功能构建。
5.  **自定义 YAML 任务定义（用户级可扩展性）**：
    *   虽然 YAML 本身定义了一组内置操作，但用户可以通过在其 YAML 脚本中将复杂的、可重用的自动化例程构建为命名的 `tasks` 来创建它们。这些 YAML 文件可以进行版本控制，在团队成员之间共享，并由 CLI 调用。
    *   这允许用户为其特定应用程序或组织内的常见工作流程构建自定义自动化“脚本”库，从而有效地扩展 Midscene 在其特定需求方面的实用性，而无需直接更改框架的核心代码。
6.  **`packages/mcp` (Midscene Copilot Package)**：
    *   虽然代码库审查的细节仍在浮现，但 `packages/mcp` 的存在表明存在一个专为更高级别抽象或“copilot 类”功能设计的层。此包本身可以是一个扩展点，或者提供允许其他 AI 代理或系统与 Midscene 的核心自动化功能交互并将其用作专门“工具”或“技能”的工具。其提示中包含 API 文档和 Playwright 示例意味着它可能有助于更复杂的交互或代码生成任务。

虽然 Midscene 目前可能没有针对所有可想到的扩展类型的正式“插件商店”或高度解耦的插件 API（例如，在不修改 `packages/core` 的情况下向 AI 的功能库添加全新的核心操作类型将具有挑战性），但其现有的 AI 服务和浏览器控制抽象，结合其 SDK 和脚本编写功能的强大功能，为用户和开发人员提供了大量途径来适应和扩展框架以适应各种新的需求和场景。其设计理念似乎倾向于提供强大的核心智能和灵活的集成点，然后可以利用这些点来构建自定义解决方案并以更定制的方式扩展功能。

## 10. 结论

Midscene 展现为一个复杂且功能多样的 AI 驱动自动化框架，其架构经过精心设计，旨在应对现代 Web 和移动应用程序交互的复杂性。其核心优势在于能够将自然语言指令和高级目标转化为具体的自动化计划，并灵活选用包括视觉语言模型在内的先进 AI 模型。这显著降低了自动化的门槛，并有望实现比传统基于选择器的方法更具弹性的脚本。

该项目的 monorepo 结构采用 pnpm 和 Nx 进行管理，促进了其多样化组件之间的模块化和代码重用。诸如 `core`（用于 AI 逻辑和 YAML 定义）、`shared`（用于 DOM 提取、图像处理和通用实用程序）、`web-integration`（用于通过 CDP、Playwright、Puppeteer 和独特的桥接模式进行多模式浏览器控制）、`android`（用于移动自动化）以及 `cli`（用于 YAML 脚本执行）等关键包协同工作，提供了一个全面的自动化解决方案。

Midscene 的 AI 集成方法因其适应性而著称，支持各种模型和服务提供商。细致的提示工程将视觉和文本 UI 上下文与特定于任务的指令和示例相结合，是其有效性的核心。此外，用于命令注入、元素定位和数据传递的强大机制确保了在不同平台和操作模式下的可靠执行。

该框架对测试和评估的投入，特别是通过专门的 `packages/evaluation` 套件和 CI 集成，突显了其对 AI 功能可靠性和持续改进的关注。虽然在所有方面都没有传统的插件系统，但 Midscene 通过其 SDK、YAML 脚本、可配置的 AI 服务以及抽象的浏览器控制接口提供了显著的可扩展性。

总而言之，Midscene 代表了向更智能、更适应性强、更易于访问的 UI 自动化迈出的重要一步。通过将现代 AI 的理解能力与稳健的工程实践相结合，它为开发人员和测试人员提供了一个强大的平台，以应对 Web 和移动平台上的复杂自动化挑战。其持续发展，特别是在改进 AI 交互和扩展其集成能力方面，可能会巩固其在不断发展的 AI 驱动自动化领域的领先解决方案地位。随着 AI 模型的不断进步，像 Midscene 这样设计用于灵活整合这些模型的框架将变得越来越重要。