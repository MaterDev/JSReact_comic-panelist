/**
 * Script Validation Utilities
 * 
 * Functions for validating script data structures to ensure they meet
 * the required format before being used in the application.
 */

import { ComicPage } from '../../../../shared/types/comic';

/**
 * Validates the structure of a ComicPage object
 * 
 * @param page - The object to validate as a ComicPage
 * @returns The validated ComicPage object
 * @throws Error if the page structure is invalid
 */
export function validateComicPage(page: any): ComicPage {
  // Basic validation of required fields
  if (!page.title || !page.synopsis || !Array.isArray(page.panels)) {
    throw new Error('Invalid comic page structure: missing title, synopsis, or panels array');
  }

  const isValid = page.panels.every((panel: any) => {
    // Validate position
    if (!panel.position || 
        typeof panel.position.x !== 'number' ||
        typeof panel.position.y !== 'number' ||
        typeof panel.position.width !== 'number' ||
        typeof panel.position.height !== 'number') {
      return false;
    }

    // Validate scene
    if (!panel.scene ||
        !panel.scene.description ||
        !panel.scene.setting ||
        !panel.scene.time ||
        !panel.scene.weather) {
      return false;
    }

    // Validate characters array
    if (!Array.isArray(panel.characters) ||
        !panel.characters.every((char: any) => char.name && char.emotion)) {
      return false;
    }

    // Validate dialogue array
    if (!Array.isArray(panel.dialogue) ||
        !panel.dialogue.every((d: any) => d.type && d.text)) {
      return false;
    }

    // Validate visual direction
    if (!panel.visualDirection ||
        !panel.visualDirection.shotType ||
        !panel.visualDirection.angle ||
        !panel.visualDirection.focus ||
        !panel.visualDirection.lighting) {
      return false;
    }

    return true;
  });
  
  // If any panel is invalid, throw an error
  if (!isValid) {
    throw new Error('Invalid comic page structure: one or more panels have invalid data');
  }
  
  return page as ComicPage;
}
