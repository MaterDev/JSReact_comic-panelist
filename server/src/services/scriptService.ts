import { PanelLayout, ComicPage } from '@shared/types/comic';
import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_PROMPT = `You are a comic book scriptwriter specializing in the Kishōtenketsu narrative structure. I will provide you with a JSON structure that describes the layout of comic panels on a single page. Each panel has position (x, y) and dimensions (width, height) as percentages (0-100%). I will also provide an accompanying image that visually represents this panel layout.

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

Use the Kishōtenketsu four-act narrative structure to organize your story across the panels:

1. Ki (Introduction): Establish the characters and setting in the initial panels
2. Shō (Development): Develop the situation and deepen understanding of the characters
3. Ten (Twist): Introduce an unexpected element or perspective shift
4. Ketsu (Conclusion): Bring the elements together for a meaningful conclusion

Note that Kishōtenketsu does not require conflict to drive the narrative. The story can unfold through exposition and the introduction of a twist or new perspective.

For dialogue and sound effects:
- Each panel can have multiple dialogue entries of different types (speech, thought, caption, sfx)
- Use "sfx" type dialogue entries for major sound effects within speech bubbles
- Include ambient or background sound effect suggestions in the visualDirection.detail field
- Consider how sound effects enhance the mood and pacing of the story
- Vary dialogue positions (interior, exterior, off-panel) for dynamic storytelling

Consider these visual storytelling principles:
- Larger panels represent more important or dramatic moments
- Wide panels often show establishing shots or panoramic views
- Tall panels emphasize character moments or vertical action
- Small panels suggest quick action or rapid dialogue
- Panel sequence affects pacing (left-to-right, top-to-bottom)

Rules:
- Create a complete Kishōtenketsu narrative that fits the visual flow
- Distribute the four acts (Ki, Shō, Ten, Ketsu) appropriately across the panels
- Let the panel sizes guide the story's dramatic moments
- Use the accompanying image to understand the exact layout of panels
- Pay attention to panel numbers in the image to ensure your script follows the correct sequence
- Include multiple dialogue entries per panel when appropriate (multiple speech bubbles, captions, sound effects)
- Provide sound effect recommendations in the visualDirection.detail field (e.g., "CRASH!", "BOOM!", "whisper...", etc.)
- Ensure all required fields are filled out
- Return ONLY valid JSON matching the TypeScript interface

Here's the panel layout:
{panels}

The accompanying image shows the exact panel layout with panel numbers. Use both the JSON data and the visual representation to understand the layout when creating your script.

Generate a compelling Kishōtenketsu story that naturally fits this visual structure. Return ONLY the JSON response.`;

export interface CreativeDirection {
  genre?: string;
  emotion?: string;
  inspiration?: string;
  inspirationText?: string;
  exclusions?: string;
}

export async function generateScript(
  layout: PanelLayout, 
  overrideApiKey?: string, 
  layoutImage?: string,
  creativeDirection?: CreativeDirection
): Promise<ComicPage> {
  const apiKey = overrideApiKey || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const anthropic = new Anthropic({
      apiKey
    });

    let prompt = ANTHROPIC_PROMPT.replace('{panels}', JSON.stringify(layout, null, 2));
    
    // Add creative direction if provided
    if (creativeDirection) {
      let creativeDirectionText = "\n\nCreative Direction:\n";
      
      if (creativeDirection.genre) {
        creativeDirectionText += `- Genre: ${creativeDirection.genre}\n`;
      }
      
      if (creativeDirection.emotion) {
        creativeDirectionText += `- Emotional tone: ${creativeDirection.emotion}\n`;
      }
      
      if (creativeDirection.inspiration) {
        creativeDirectionText += `- Inspiration: ${creativeDirection.inspiration}\n`;
      }
      
      if (creativeDirection.inspirationText) {
        creativeDirectionText += `- Inspiration text: ${creativeDirection.inspirationText}\n`;
      }
      
      if (creativeDirection.exclusions) {
        creativeDirectionText += `- Please avoid: ${creativeDirection.exclusions}\n`;
      }
      
      prompt += creativeDirectionText;
    }
    
    // Create message content array
    const messageContent: any[] = [
      {
        type: 'text',
        text: prompt
      }
    ];
    
    // Add image content if provided
    if (layoutImage) {
      // Extract the base64 data (remove the data:image/png;base64, prefix)
      const base64Data = layoutImage.split(',')[1];
      
      messageContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: base64Data
        }
      });
    }
    
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user' as const,
          content: messageContent
        }],
        system: 'You are a comic book scriptwriter. Always return valid JSON matching the specified TypeScript interface.'
      });

      if (!message.content || message.content.length === 0) {
        throw new Error('No content received from Anthropic API');
      }

      // Find the text content in the response
      const textContent = message.content.find(item => item.type === 'text');
      if (!textContent || !textContent.text) {
        throw new Error('No text content found in Anthropic API response');
      }

      try {
        const scriptData = JSON.parse(textContent.text);
        return scriptData as ComicPage;
      } catch (parseError) {
        console.error('Error parsing script JSON:', parseError);
        throw new Error('Failed to parse script data from API response');
      }
    } catch (apiError: any) {
      console.error('Error calling Anthropic API:', apiError);
      throw new Error(`Anthropic API error: ${apiError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}
