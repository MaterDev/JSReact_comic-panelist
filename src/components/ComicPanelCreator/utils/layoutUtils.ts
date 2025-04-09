/**
 * Layout Utilities
 * 
 * Utility functions for layout management and transformation.
 */
import { Panel } from '../../../../shared/types/panelTypes';
import { Layout } from '../hooks/useLayoutManagement';

/**
 * Processes a raw layout from the API into a consistent format
 */
export function processLoadedLayout(rawLayout: any): Layout | null {
  if (!rawLayout || !rawLayout.panel_data) {
    console.error("Invalid layout data:", rawLayout);
    return null;
  }

  // Convert incoming layout to consistent format
  return {
    ...rawLayout,
    description: rawLayout.description || '', // Provide default description
    panel_data: {
      ...rawLayout.panel_data,
      // Ensure panels array exists and map panel numbers
      panels: (rawLayout.panel_data.panels || []).map((p: any, index: number) => ({
        ...p,
        panelNumber: p.panelNumber || index + 1 // Assign panel number if missing
      })),
      gutterSize: rawLayout.panel_data.gutterSize ?? 1, // Use nullish coalescing for gutterSize
    }
  };
}

/**
 * Creates an updated layout object with current state
 */
export function createUpdatedLayout(
  loadedLayout: Layout,
  panels: Panel[],
  gutterSize: number,
  scriptData: any,
  creativeDirection: any
): Layout {
  // Ensure all panels have a panelNumber
  const layoutPanels = panels.map(panel => ({
    ...panel,
    panelNumber: panel.panelNumber !== undefined ? panel.panelNumber : 0
  }));

  return {
    ...loadedLayout,
    panel_data: {
      panels: layoutPanels,
      gutterSize
    },
    script_data: scriptData,
    creative_direction: creativeDirection
  };
}

/**
 * Extracts panel data from a layout
 */
export function extractPanelDataFromLayout(layout: Layout): Panel[] {
  if (!layout.panel_data || !layout.panel_data.panels) {
    return [];
  }
  
  return layout.panel_data.panels.map(p => ({
    ...p,
    panelNumber: p.panelNumber
  }));
}
