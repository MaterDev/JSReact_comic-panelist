import { PanelLayout, ComicPage } from '../../../shared/types/comic';



const FETCH_TIMEOUT = 110000; // 110 seconds, slightly less than server timeout

const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. The AI is taking longer than expected to generate your script. Please try again.');
    }
    throw error;
  }
};

export async function generateScript(layout: PanelLayout, apiKey?: string): Promise<ComicPage> {
  try {
    const response = await fetchWithTimeout('http://localhost:3001/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ layout, apiKey })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate script';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // If response isn't JSON, try to get text
        const text = await response.text();
        if (text) errorMessage = text;
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    const data = await response.json();
    return data as ComicPage;
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}

export function validateComicPage(page: ComicPage): boolean {
  // Basic validation of required fields
  if (!page.title || !page.synopsis || !Array.isArray(page.panels)) {
    return false;
  }

  return page.panels.every(panel => {
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
        !panel.characters.every(char => char.name && char.emotion)) {
      return false;
    }

    // Validate dialogue array
    if (!Array.isArray(panel.dialogue) ||
        !panel.dialogue.every(d => d.type && d.text)) {
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
}
