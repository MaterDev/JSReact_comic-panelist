// Position and size of panel on the page
export interface PanelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Scene details
export interface Scene {
  description: string;
  setting: string;
  time: string;
  weather: string;
}

// Character information
export interface Character {
  name: string;
  age?: string;
  appearance?: string;
  emotion: string;
}

// Types of dialogue entries
export type DialogueType = "caption" | "speech" | "thought" | "radio" | "sfx";

// Dialogue information
export interface Dialogue {
  type: DialogueType;
  speaker?: string;
  text: string;
  position?: "interior" | "exterior" | "off-panel";
}

// Visual direction for artists
export interface VisualDirection {
  shotType: string;
  angle: string;
  focus: string;
  lighting: string;
  detail?: string;
  symbolism?: string;
}

// Individual panel information
export interface Panel {
  id: number;
  position: PanelPosition;
  scene: Scene;
  characters: Character[];
  dialogue: Dialogue[];
  visualDirection: VisualDirection;
}

// Full comic page information
export interface ComicPage {
  title: string;
  synopsis: string;
  panels: Panel[];
}

// Current panel layout for AI input
export interface PanelLayout {
  panels: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}
