/**
 * Script Generation Utilities
 * 
 * Core functionality for generating comic scripts from panel layouts.
 * Provides API communication with the script generation backend.
 */

import { PanelLayout, ComicPage } from '../../../../shared/types/comic';
import { API_URL } from '../../../constants';
import { fetchWithTimeout } from './apiUtils';
import { validateComicPage } from './validationUtils';

/**
 * Creative direction options for script generation
 */
export interface CreativeDirection {
  genre?: string;
  emotion?: string;
  inspiration?: string;
  inspirationText?: string;
  exclusions?: string;
}

/**
 * Generates a comic script based on panel layout and creative direction
 * 
 * @param layout - The panel layout to generate a script for
 * @param apiKey - Optional API key for authentication
 * @param layoutImage - Optional base64 encoded image of the layout
 * @param creativeDirection - Optional creative direction parameters
 * @returns Promise resolving to the generated ComicPage
 * @throws Error if script generation fails
 */
export async function generateScript(
  layout: PanelLayout, 
  apiKey?: string, 
  layoutImage?: string, 
  creativeDirection?: CreativeDirection
): Promise<ComicPage> {
  try {
    // Ensure creativeDirection is passed as a proper object with empty strings preserved
    const requestData = { 
      layout, 
      apiKey, 
      layoutImage, 
      creativeDirection: creativeDirection ? {
        genre: creativeDirection.genre ?? '',
        emotion: creativeDirection.emotion ?? '',
        inspiration: creativeDirection.inspiration ?? '',
        inspirationText: creativeDirection.inspirationText ?? '',
        exclusions: creativeDirection.exclusions ?? ''
      } : undefined
    };
    
    console.log('Sending API request with creativeDirection:', requestData.creativeDirection);
    
    const response = await fetchWithTimeout(`${API_URL}/script/generate-script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate script';
      const responseClone = response.clone();
      
      try {
        const error = await responseClone.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // If response isn't JSON, try to get text
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch (textError) {
          console.error('Error reading response text:', textError);
        }
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    const data = await response.json();
    return validateComicPage(data);
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}
