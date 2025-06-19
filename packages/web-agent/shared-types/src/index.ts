// ---------------- DomNode and related types ----------------

/**
 * Represents the detailed information about a captured web element.
 * Based on structures from @midscene/shared/types and typical extractor outputs.
 */
export interface WebElementInfo {
  id: string; // MidScene ID
  indexId?: number;
  nodeHashId?: string;
  attributes: { [key: string]: string }; // e.g., class, href, data-testid, also includes htmlTagName, nodeType
  content: string; // Inner text or value of the element
  rect: { // Bounding box
    left: number;
    top: number;
    width: number;
    height: number;
    zoom?: number; // Optional zoom level if applicable
  };
  center?: [number, number]; // Optional center coordinates
  isVisible?: boolean;
  nodeType: string; // From a NodeType enum, e.g., 'BUTTON', 'TEXT', 'INPUT_TEXT'
  htmlTagName?: string; // e.g., 'DIV', 'A', 'INPUT'
  // Potentially other fields like role, aria-label, etc.
}

/**
 * Represents a node in the DOM tree, compatible with midscene_element_inspector output
 * and suitable for UIContext.tree in @midscene/core.
 * The structure `WebElementNode` from `@midscene/shared/types/element-tree` is `{ node: WebElementInfo | null; children: WebElementNode[]; }`
 * We will align with that, renaming `node` to `element` for clarity.
 */
export interface DomNode {
  element: WebElementInfo | null; // Information about the current HTML element
  children: DomNode[];          // Child nodes in the DOM tree
}

// ---------------- DomData ----------------

export interface DomData {
  rootNode: DomNode; // The root of the captured DOM tree
  treeString?: string; // Optional string representation of the DOM tree
  url: string; // Current page URL
  windowSize: { width: number; height: number }; // Size of the browser window
  // timestamp?: number; // Optional: if frontend wants to include it
}

// ---------------- Action Types (copied from frontend/backend) ----------------

export enum ActionType {
  CLICK = "CLICK",
  TYPE = "TYPE",
  NAVIGATE = "NAVIGATE",
  SCROLL = "SCROLL",
  WAIT = "WAIT",
  TAP = "TAP", // Could be an alias for CLICK or more specific for touch
  INPUT = "INPUT", // Could be an alias for TYPE or more specific
  // Add other action types as needed by core planner or plugins
}

export interface ActionStep {
  type: ActionType;
  description: string; // Human-readable description of the step
  elementId?: string; // Midscene ID of the target element (optional for actions like NAVIGATE or WAIT)
  value?: string; // Value for TYPE/INPUT action, URL for NAVIGATE
  parameters?: Record<string, any>; // For additional parameters, e.g., scroll direction, coordinates, wait time
  // Potentially add fields for expected outcomes or verification steps
}

export interface ActionPlan {
  goal: string;
  steps: ActionStep[];
  // Could include planId, confidence, etc.
}

// ---------------- Special Control Plugin Types (copied) ----------------

export interface RecommendedActionStep {
  type: ActionType;
  targetElementId?: string; // ID of the element to interact with (part of the special control)
  targetElementSelector?: string; // A more specific selector within the special control context
  value?: string; // For INPUT actions
  parameters?: Record<string, any>; // For SCROLL, WAIT, etc.
  description: string; // Why this step is recommended
}

export interface SpecialControlRecommendation {
  detectedElementId: string; // The ID of the top-level special control element
  originalInstructionFragment?: string; // The part of user instruction relevant to this control
  confidence?: number; // How confident the plugin is about this recommendation
  recommendedSteps: RecommendedActionStep[];
}

// Consider adding ScreenshotData if it's broadly used, though it's simple now.
// export interface ScreenshotData {
//   imageDataUrl: string; // Base64 encoded image
//   timestamp: number;
// }
