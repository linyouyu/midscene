import {
  ActionType,
  DomNode, // Using canonical DomNode from shared-types
  RecommendedActionStep,
  SpecialControlRecommendation,
  WebElementInfo, // For convenience
} from '@web-agent/shared-types';

// Export types for consumers of this plugin (now re-exporting from shared-types via local types.ts)
export * from './types';


// Helper function to traverse the new DomNode structure (DFS)
function traverseDom(
  node: DomNode,
  visitor: (elementNode: DomNode) // Visitor now receives the full DomNode
): void {
  visitor(node); // Visit current node (which contains element and children)
  if (node.children) {
    for (const child of node.children) {
      traverseDom(child, visitor);
    }
  }
}

// Simple regex for dates (MM/DD/YYYY or Month Day, Year) - very basic
// For "March 15, 2024" or "03/15/2024"
const DATE_REGEX_MONTH_DAY_YEAR = /(\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*\d{4}\b)/i;
const DATE_REGEX_MMDDYYYY = /(\b\d{1,2}\/\d{1,2}\/\d{4}\b)/;

// Function to normalize extracted date to MM/DD/YYYY format (very simplified)
function normalizeDateToMMDDYYYY(dateString: string): string | null {
  if (DATE_REGEX_MMDDYYYY.test(dateString)) {
    // Already in a good enough format, or assume it is for this basic example
    // Could add padding for single digit month/day here if needed
    return dateString;
  }

  if (DATE_REGEX_MONTH_DAY_YEAR.test(dateString)) {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      console.warn(`Could not parse date string: ${dateString}`, e);
      return null;
    }
  }
  return null;
}


export function identifySpecialControls(
  domRoot: DomNode, // Takes the canonical DomNode
  userInstruction: string
): SpecialControlRecommendation[] {
  const recommendations: SpecialControlRecommendation[] = [];

  // --- Example Rule: Date Picker by attribute 'data-testid' ---
  traverseDom(domRoot, (node) => { // node is DomNode
    const element = node.element; // Get the WebElementInfo
    if (!element) {
      return; // Skip nodes without element info
    }

    // Access attributes via element.attributes
    if (element.attributes['data-testid'] === 'date-picker-input' ||
        element.attributes['aria-label']?.toLowerCase().includes('date picker') ||
        element.attributes['placeholder']?.toLowerCase().includes('date') ||
        element.htmlTagName?.toLowerCase() === 'input' && element.attributes['type'] === 'date') { // Added more heuristics

      // Try to extract a date from the user instruction
      let instructionDateFragment: string | null = null;
      let extractedDate: string | null = null;

      const matchMonthDayYear = userInstruction.match(DATE_REGEX_MONTH_DAY_YEAR);
      if (matchMonthDayYear && matchMonthDayYear[1]) {
        instructionDateFragment = matchMonthDayYear[1];
        extractedDate = normalizeDateToMMDDYYYY(instructionDateFragment);
      } else {
        const matchMMDDYYYY = userInstruction.match(DATE_REGEX_MMDDYYYY);
        if (matchMMDDYYYY && matchMMDDYYYY[1]) {
          instructionDateFragment = matchMMDDYYYY[1];
          extractedDate = normalizeDateToMMDDYYYY(instructionDateFragment);
        }
      }

      if (extractedDate && instructionDateFragment) {
        const recommendedSteps: RecommendedActionStep[] = [
          {
            type: ActionType.CLICK,
            targetElementId: element.id, // Use element.id from WebElementInfo
            description: `Click the identified date picker input (id: ${element.id}) to open the calendar.`,
            parameters: { associatedText: instructionDateFragment }
          },
          {
            type: ActionType.INPUT,
            targetElementId: element.id, // Use element.id
            value: extractedDate,
            description: `Directly input normalized date "${extractedDate}" into the date picker (id: ${element.id}).`,
            parameters: { associatedText: instructionDateFragment, format: "MM/DD/YYYY" }
          },
        ];

        recommendations.push({
          detectedElementId: element.id, // Use element.id
          originalInstructionFragment: instructionDateFragment,
          confidence: 0.75,
          recommendedSteps,
        });
      }
    }
  });

  return recommendations;
}

// Example Usage (for testing purposes, needs to be updated to use new DomNode structure)
/*
if (require.main === module) {
  const sampleDom: DomNode = { // Adjusted to new DomNode structure
    element: {
      id: 'root',
      attributes: {},
      content: '',
      rect: { left: 0, top: 0, width: 0, height: 0 },
      nodeType: 'DIV', // Example
      htmlTagName: 'div',
    },
    children: [
      {
        element: {
          id: 'form1',
          attributes: {},
          content: '',
          rect: { left: 0, top: 0, width: 0, height: 0 },
          nodeType: 'FORM', // Example
          htmlTagName: 'form',
        },
        children: [
          {
            element: {
              id: 'datepicker1',
              attributes: { 'data-testid': 'date-picker-input', 'type': 'text' },
              content: '',
              rect: { left: 0, top: 0, width: 0, height: 0 },
              nodeType: 'INPUT_TEXT', // Example
              htmlTagName: 'input',
            },
            children: []
          },
          // ... other elements
        ]
      }
    ]
  };

  const instruction1 = "Please set the delivery date to March 15, 2024.";
  const recs1 = identifySpecialControls(sampleDom, instruction1);
  console.log("Recommendations for instruction 1:", JSON.stringify(recs1, null, 2));
}
*/
