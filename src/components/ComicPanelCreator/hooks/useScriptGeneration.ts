/**
 * Script Generation Hook
 * 
 * This hook manages script generation state and functionality:
 * - Script generation API calls
 * - Loading and error states
 * - Panel script selection
 * - Script validation
 */
import { useState, useCallback } from 'react';
import {
  ComicPage,
  PanelLayout,
  Panel as ScriptPanel,
  generateScript as generateScriptApi,
  validateComicPage
} from '../../ScriptGenerator';
import { Panel } from '../../../../shared/types/panelTypes';

interface UseScriptGenerationProps {
  panels: Panel[];
  generatePreviewImage: () => Promise<string>;
  apiKey?: string;
  onScriptGenerated?: (script: ComicPage) => void;
}

interface UseScriptGenerationReturn {
  generatedScript: ComicPage | null;
  isGeneratingScript: boolean;
  generateError: string | null;
  selectedScriptPanel: ScriptPanel | null;
  generatePanelScript: () => Promise<void>;
  viewPanelScript: (panelId: string) => void;
  setSelectedScriptPanel: (panel: ScriptPanel | null) => void;
  setGeneratedScript: (script: ComicPage | null) => void;
  clearScript: () => void;
}

/**
 * Hook for managing script generation state and functionality
 */
export const useScriptGeneration = ({
  panels,
  generatePreviewImage,
  apiKey,
  onScriptGenerated
}: UseScriptGenerationProps): UseScriptGenerationReturn => {
  // Script state
  const [generatedScript, setGeneratedScript] = useState<ComicPage | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [selectedScriptPanel, setSelectedScriptPanel] = useState<ScriptPanel | null>(null);

  /**
   * Generates a script for the current panel layout
   */
  const generatePanelScript = useCallback(async (creativeDirection?: any): Promise<void> => {
    try {
      setIsGeneratingScript(true);
      setGenerateError(null);

      // Generate the preview image for AI context
      const layoutImageBase64 = await generatePreviewImage();

      // Convert current panels to layout format
      const layout: PanelLayout = {
        panels: panels.map(panel => ({
          id: panel.id,
          x: panel.x,
          y: panel.y,
          width: panel.width,
          height: panel.height
        }))
      };

      // Generate script using API
      const script = await generateScriptApi(
        layout,
        apiKey,
        layoutImageBase64,
        creativeDirection
      );

      // Validate the response
      if (!validateComicPage(script)) {
        throw new Error('Generated script does not match expected format');
      }

      setGeneratedScript(script);
      
      // Call the callback if provided
      if (onScriptGenerated) {
        onScriptGenerated(script);
      }
    } catch (error) {
      console.error('Error generating script:', error);
      setGenerateError(error instanceof Error ? error.message : 'Unknown error generating script');
    } finally {
      setIsGeneratingScript(false);
    }
  }, [panels, generatePreviewImage, apiKey, onScriptGenerated]);

  /**
   * Handles viewing the script for a specific panel
   */
  const viewPanelScript = useCallback((panelId: string) => {
    if (!generatedScript) return;

    // Find the panel number from the canvas panel id
    const panel = panels.find(p => p.id === panelId);
    if (!panel || typeof panel.panelNumber === 'undefined') {
      console.warn(`Could not find panel or panel number for ID ${panelId}`);
      return;
    }

    // Find the corresponding script panel by matching position
    const scriptPanel = generatedScript?.panels.find(p => p.id === panel.panelNumber);
    if (scriptPanel) {
      setSelectedScriptPanel(scriptPanel);
    }
  }, [generatedScript, panels]);

  /**
   * Clears the generated script and related state
   */
  const clearScript = useCallback(() => {
    setGeneratedScript(null);
    setSelectedScriptPanel(null);
    setGenerateError(null);
  }, []);

  return {
    generatedScript,
    isGeneratingScript,
    generateError,
    selectedScriptPanel,
    generatePanelScript,
    viewPanelScript,
    setSelectedScriptPanel,
    setGeneratedScript,
    clearScript
  };
};