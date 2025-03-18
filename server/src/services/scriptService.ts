import { PanelLayout, ComicPage } from '@shared/types/comic';
import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_PROMPT = `You are a comic book scriptwriter. I will provide you with a JSON structure that describes the layout of comic panels on a single page. Each panel has position (x, y) and dimensions (width, height) as percentages (0-100%).

Your task is to generate a complete comic page script that follows this TypeScript interface:

interface ComicPage {
  title: string;
  synopsis: string;
  panels: {
    id: number;
    position: { x: number; y: number; width: number; height: number; };
    scene: { description: string; setting: string; time: string; weather: string; };
    characters: { name: string; age?: string; appearance?: string; emotion: string; }[];
    dialogue: { type: "caption" | "speech" | "thought" | "radio" | "sfx"; speaker?: string; text: string; position?: "interior" | "exterior" | "off-panel"; }[];
    visualDirection: { shotType: string; angle: string; focus: string; lighting: string; detail?: string; symbolism?: string; };
  }[];
}

Consider these storytelling principles:
- Larger panels represent more important or dramatic moments
- Wide panels often show establishing shots or panoramic views
- Tall panels emphasize character moments or vertical action
- Small panels suggest quick action or rapid dialogue
- Panel sequence affects pacing (left-to-right, top-to-bottom)

Rules:
- Create a complete narrative that fits the visual flow
- Consider how adjacent panels relate to each other
- Let the panel sizes guide the story's dramatic moments
- Ensure all required fields are filled out
- Return ONLY valid JSON matching the TypeScript interface

Here's the panel layout:
{panels}

Generate a compelling story that naturally fits this visual structure. Return ONLY the JSON response.`;

export async function generateScript(layout: PanelLayout, overrideApiKey?: string): Promise<ComicPage> {
  const apiKey = overrideApiKey || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const anthropic = new Anthropic({
      apiKey
    });

    const prompt = ANTHROPIC_PROMPT.replace('{panels}', JSON.stringify(layout, null, 2));
    
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }],
      system: 'You are a comic book scriptwriter. Always return valid JSON matching the specified TypeScript interface.'
    });

    if (!message.content || message.content.length === 0) {
      throw new Error('No content received from Anthropic API');
    }

    try {
      const scriptData = JSON.parse(message.content[0].text);
      return scriptData as ComicPage;
    } catch (parseError) {
      console.error('Error parsing script JSON:', parseError);
      throw new Error('Failed to parse script data from API response');
    }
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}
