/**
 * Script Utilities
 * 
 * Utility functions for script generation and manipulation.
 */
import { Panel } from '../../../../shared/types/panelTypes';
import { ComicPage, PanelLayout } from '../../ScriptGenerator';

/**
 * Safe JSON replacer function that handles circular references
 * Use with JSON.stringify to prevent errors when serializing objects with circular structures
 * @param key The current key being processed
 * @param value The current value being processed
 * @returns The filtered or processed value
 */
export function safeJSONReplacer(key: string, value: any): any {
  // Return a placeholder for null or undefined values
  if (value === null || value === undefined) {
    return value;
  }
  
  // Handle primitive values directly
  if (typeof value !== 'object') {
    return value;
  }
  
  // Check for Window object or DOM-related objects
  try {
    if (value === window || 
        value instanceof Node || 
        value instanceof Window || 
        (value && typeof value === 'object' && value.window === window) || 
        key === 'window' || 
        key.startsWith('__react') || 
        key === 'stateNode' ||
        key === 'ref' ||
        key === '_owner') {
      return '[Circular Reference]';
    }
  } catch (e) {
    // If any error occurs while checking for circular refs, return a safe value
    return '[Potentially Circular Reference]';
  }
    
  // Handle other potential circular references
  const seen = new WeakSet();
  return (function replacer(_, v) {
    if (typeof v === 'object' && v !== null) {
      if (seen.has(v)) {
        return '[Circular Reference]';
      }
      seen.add(v);
    }
    return v;
  })(key, value);
}

/**
 * Converts panel array to layout format for script generation
 */
export function convertPanelsToLayout(panels: Panel[]): PanelLayout {
  return {
    panels: panels.map(panel => ({
      id: panel.id,
      x: panel.x,
      y: panel.y,
      width: panel.width,
      height: panel.height
    }))
  };
}

/**
 * Finds a script panel matching a canvas panel by ID
 */
export function findScriptPanelByCanvasPanelId(
  panels: Panel[], 
  generatedScript: ComicPage | null, 
  panelId: string
): any | null {
  if (!generatedScript) return null;

  // Find the panel number from the canvas panel id
  const panel = panels.find(p => p.id === panelId);
  if (!panel || typeof panel.panelNumber === 'undefined') {
    console.warn(`Could not find panel or panel number for ID ${panelId}`);
    return null;
  }

  // Find the corresponding script panel by matching position
  return generatedScript.panels.find(p => p.id === panel.panelNumber) || null;
}

/**
 * Creates a creative direction object with non-empty values
 */
export function createCreativeDirectionObject(
  genre?: string,
  emotion?: string,
  inspiration?: string,
  inspirationText?: string,
  exclusions?: string
): any {
  const creativeDirection: any = {};
  
  if (genre) creativeDirection.genre = genre;
  if (emotion) creativeDirection.emotion = emotion;
  if (inspiration) creativeDirection.inspiration = inspiration;
  if (inspirationText) creativeDirection.inspirationText = inspirationText;
  if (exclusions) creativeDirection.exclusions = exclusions;
  
  return Object.keys(creativeDirection).length > 0 ? creativeDirection : undefined;
}
