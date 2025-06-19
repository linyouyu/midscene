import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  ActionStep,
  ActionPlan,
  DomNode, // Using canonical DomNode from shared-types
  SpecialControlRecommendation,
  // DomData, // If other fields from DomData were needed, import it too
  // ActionType, // Not directly used here, but available from shared-types
} from '@web-agent/shared-types';

// MidScene Core imports
import { Insight } from '@midscene/core/insight';
import { plan, LLMPlannerOptions, ActionPlanStep } from '@midscene/core/ai-model/llm-planning';
import { UIContext } from '@midscene/core/types';

// MidScene Shared imports
import { getAIConfig } from '@midscene/shared/env';
// ElementTreeNode from @midscene/shared is { node: Element | null, children: ElementTreeNode[] }
// Our shared DomNode is { element: WebElementInfo | null, children: DomNode[] }
// These are structurally compatible if WebElementInfo is compatible with Element.
// For UIContext, we pass `domTree` which is now our shared `DomNode`.
// A type assertion will be used for now.
import { ElementTreeNode as CoreElementTreeNode } from '@midscene/shared/types';


// Load environment variables
dotenv.config();

// Helper function to format recommendations into a text string for the AI
function formatRecommendationsToText(recommendations?: SpecialControlRecommendation[]): string {
  if (!recommendations || recommendations.length === 0) {
    return '';
  }

  let hintsText = "Special Control Hints:\n";
  recommendations.forEach((rec, index) => {
    hintsText += `${index + 1}. For element (ID: '${rec.detectedElementId}'):\n`;
    if (rec.originalInstructionFragment) {
      hintsText += `   User seems to want to interact with this regarding: "${rec.originalInstructionFragment}".\n`;
    }
    if (rec.recommendedSteps && rec.recommendedSteps.length > 0) {
      hintsText += "   Suggested interaction steps:\n";
      rec.recommendedSteps.forEach((step, stepIndex) => {
        hintsText += `   ${stepIndex + 1}) ${step.description} (Action: ${step.type}`;
        if (step.value) hintsText += `, Value: "${step.value}"`;
        if (step.targetElementId && step.targetElementId !== rec.detectedElementId) hintsText += `, Target Sub-Element ID: ${step.targetElementId}`;
        if (step.targetElementSelector) hintsText += `, Target Selector: "${step.targetElementSelector}"`;
        hintsText += ").\n";
      });
    }
    if (rec.confidence) {
        hintsText += `   Confidence in this hint: ${Math.round(rec.confidence * 100)}%.\n`;
    }
  });
  return hintsText;
}

const app = express(); // Keep as local const for typical execution
const port = process.env.PORT || 3001;

// Export app for testing purposes
export { app };

// Middleware
app.use(cors());
// Adjust limit based on expected payload size, 50mb is generous
app.use(express.json({ limit: '50mb' }));

// API Endpoints
app.post('/api/v1/process-page', async (req: Request, res: Response) => {
  const {
    instruction,
    domTree,
    screenshotData,
    url: pageUrl,
    recommendations,
  } = req.body as {
    instruction: string;
    domTree: DomNode; // domTree is now our shared DomNode type
    screenshotData: string;
    url: string; // Now expecting url directly
    windowSize: { width: number; height: number }; // Now expecting windowSize directly
    recommendations?: SpecialControlRecommendation[];
  };

  console.log(
    `Received /process-page request. Instruction: "${instruction}". URL: ${url}. WindowSize: ${windowSize?.width}x${windowSize?.height}. DOM tree root element tag: ${domTree?.element?.htmlTagName || domTree?.element?.nodeType}. Screenshot length: ${screenshotData?.length}. Recommendations: ${recommendations?.length || 0}`
  );

  if (!instruction || !domTree || !screenshotData || !url || !windowSize) {
    return res.status(400).json({ error: 'Missing instruction, domTree, screenshotData, url, or windowSize.' });
  }

  try {
    const uiContext: UIContext = {
      screen: screenshotData,
      // Cast our shared DomNode to @midscene/shared's ElementTreeNode (CoreElementTreeNode)
      tree: domTree as any as CoreElementTreeNode,
      windowSize: windowSize, // Use from request
      url: url,               // Use from request
    };

    const insight = new Insight(async () => uiContext);
    const aiConfig = getAIConfig(); // Needs OPENAI_API_KEY, etc., from .env

    if (!aiConfig.apiKey) {
        console.error("OPENAI_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: "AI configuration error: API key missing." });
    }


    const recommendationsText = formatRecommendationsToText(recommendations);
    if (recommendationsText) {
      console.log("Formatted Special Control Recommendations Text for AI:\n", recommendationsText);
    }

    const options: LLMPlannerOptions = {
      aiConfig,
      actionContext: recommendationsText, // Prepending/setting as actionContext
      previous_logs: [],
    };

    console.log('Calling AI plan function with actionContext:', options.actionContext);
    const planningResponse = await plan(instruction, insight, options);

    // The backend's ActionPlan { goal, steps: ActionStep[] }
    // planningResponse.plan is ActionPlanStep[]
    // Assuming ActionPlanStep and our ActionStep are compatible.
    const responsePlan: ActionPlan = {
        goal: instruction, // Use the original instruction as the goal
        steps: planningResponse.plan as ActionStep[], // Type assertion
    };

    res.json({ message: 'Plan generated successfully.', plan: responsePlan });
  } catch (error: any) {
    console.error('Error during AI planning for /process-page:', error);
    res.status(500).json({ error: 'Failed to generate plan.', details: error.message });
  }
});

app.post('/api/v1/replan', async (req: Request, res: Response) => {
  const {
    instruction, // Added instruction for replanning context
    problematicStep,
    domTree,
    screenshotData,
    url: pageUrl,
    recommendations,
  } = req.body as {
    instruction: string;
    problematicStep: ActionStep;
    domTree: DomNode; // domTree is now our shared DomNode type
    screenshotData: string;
    url: string; // Now expecting url directly
    windowSize: { width: number; height: number }; // Now expecting windowSize directly
    recommendations?: SpecialControlRecommendation[];
  };

  console.log(
    `Received /replan request. Instruction: "${instruction}". URL: ${url}. WindowSize: ${windowSize?.width}x${windowSize?.height}. Problematic step: "${problematicStep?.description}". DOM tree root element tag: ${domTree?.element?.htmlTagName || domTree?.element?.nodeType}. Screenshot length: ${screenshotData?.length}. Recommendations: ${recommendations?.length || 0}`
  );

  if (!instruction || !problematicStep || !domTree || !screenshotData || !url || !windowSize) {
    return res.status(400).json({ error: 'Missing instruction, problematicStep, domTree, screenshotData, url, or windowSize.' });
  }

  try {
    const uiContext: UIContext = {
      screen: screenshotData,
      // Cast our shared DomNode to @midscene/shared's ElementTreeNode (CoreElementTreeNode)
      tree: domTree as any as CoreElementTreeNode,
      windowSize: windowSize, // Use from request
      url: url,               // Use from request
    };

    const insight = new Insight(async () => uiContext);
    const aiConfig = getAIConfig();

    if (!aiConfig.apiKey) {
        console.error("OPENAI_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: "AI configuration error: API key missing." });
    }

    const previous_logs = [
      { role: 'assistant' as const, content: `I previously tried this step: ${JSON.stringify(problematicStep)}` },
      { role: 'user' as const, content: 'This step failed to achieve the desired outcome or an error occurred. Please provide a new plan based on the current state to achieve the original goal.' },
    ];

    const recommendationsText = formatRecommendationsToText(recommendations);
    if (recommendationsText) {
      console.log("Formatted Special Control Recommendations Text for AI (Replan):\n", recommendationsText);
    }

    // Append recommendations text to existing replan context
    const replanActionContext = `Replanning after failed step: ${problematicStep.description}\n${recommendationsText}`.trim();

    const options: LLMPlannerOptions = {
      aiConfig,
      actionContext: replanActionContext,
      previous_logs,
    };

    console.log('Calling AI plan function for replan with actionContext:', options.actionContext);
    const planningResponse = await plan(instruction, insight, options);

    const responsePlan: ActionPlan = {
        goal: instruction, // Original goal
        steps: planningResponse.plan as ActionStep[],
    };

    res.json({ message: 'Replan successful.', plan: responsePlan });
  } catch (error: any) {
    console.error('Error during AI planning for /replan:', error);
    res.status(500).json({ error: 'Failed to generate replan.', details: error.message });
  }
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Web Agent Backend is running. Use POST requests for API endpoints.');
});

// Start server only if not in test environment or if specifically run
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Web Agent Backend server listening on http://localhost:${port}`);
  });
}
