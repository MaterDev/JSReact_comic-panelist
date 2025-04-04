/**
 * Panel Operations Hook
 * 
 * This hook provides operations for manipulating panels in the comic creator:
 * - Split panels (horizontally/vertically)
 * - Delete panels
 */
import { useCallback } from 'react';
import { Panel } from '../../../../shared/types/panelTypes';
import {
  percentToPixels,
  pixelsToPercent,
  generatePanelId,
  findPanelById
} from '../../../../shared/utils/panelUtils';

interface UsePanelOperationsProps {
  panels: Panel[];
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>;
  gutterSize: number;
  nextPanelIdRef: React.MutableRefObject<number>;
  updatePanelNumbers: (panels: Panel[]) => Panel[];
  setSelectedPanelId: (id: string | null) => void;
}

interface UsePanelOperationsReturn {
  splitPanelHorizontally: (panelId: string) => void;
  splitPanelVertically: (panelId: string) => void;
  deletePanel: (panelId: string) => void;
}

export const usePanelOperations = ({
  panels,
  setPanels,
  gutterSize,
  nextPanelIdRef,
  updatePanelNumbers,
  setSelectedPanelId
}: UsePanelOperationsProps): UsePanelOperationsReturn => {
  
  /**
   * Splits the target panel horizontally into two equal halves
   */
  const splitPanelHorizontally = useCallback((panelId: string): void => {
    const panel = findPanelById(panels, panelId);
    if (!panel) return;

    const pixelDims = percentToPixels(panel);
    const halfHeight = pixelDims.height / 2;
    const gapHeight = gutterSize / 2;

    const topPanel = {
      ...panel,
      id: generatePanelId(nextPanelIdRef.current++),
      height: pixelsToPercent(0, 0, 0, halfHeight - gapHeight).height
    };

    const bottomPanel = {
      ...panel,
      id: generatePanelId(nextPanelIdRef.current++),
      y: pixelsToPercent(0, pixelDims.y + halfHeight + gapHeight, 0, 0).y,
      height: pixelsToPercent(0, 0, 0, halfHeight - gapHeight).height
    };

    setPanels(prev => {
      const updatedPanels = [
        ...prev.filter(p => p.id !== panelId),
        topPanel,
        bottomPanel
      ];
      return updatePanelNumbers(updatedPanels);
    });
    setSelectedPanelId(null);
  }, [panels, gutterSize, nextPanelIdRef, setPanels, updatePanelNumbers, setSelectedPanelId]);

  /**
   * Splits the target panel vertically into two equal halves
   */
  const splitPanelVertically = useCallback((panelId: string): void => {
    const panel = findPanelById(panels, panelId);
    if (!panel) return;

    const pixelDims = percentToPixels(panel);
    const halfWidth = pixelDims.width / 2;
    const gapWidth = gutterSize / 2;

    const leftPanel = {
      ...panel,
      id: generatePanelId(nextPanelIdRef.current++),
      width: pixelsToPercent(0, 0, halfWidth - gapWidth, 0).width
    };

    const rightPanel = {
      ...panel,
      id: generatePanelId(nextPanelIdRef.current++),
      x: pixelsToPercent(pixelDims.x + halfWidth + gapWidth, 0, 0, 0).x,
      width: pixelsToPercent(0, 0, halfWidth - gapWidth, 0).width
    };

    setPanels(prev => {
      const updatedPanels = [
        ...prev.filter(p => p.id !== panelId),
        leftPanel,
        rightPanel
      ];
      return updatePanelNumbers(updatedPanels);
    });
    setSelectedPanelId(null);
  }, [panels, gutterSize, nextPanelIdRef, setPanels, updatePanelNumbers, setSelectedPanelId]);

  /**
   * Deletes the target panel from the layout
   * Ensures at least one panel always remains
   */
  const deletePanel = useCallback((panelId: string): void => {
    if (panels.length <= 1) return;
    
    setPanels(prev => {
      const filteredPanels = prev.filter(p => p.id !== panelId);
      return updatePanelNumbers(filteredPanels);
    });
    
    // Clear selection if the deleted panel was selected
    if (setSelectedPanelId) {
      setSelectedPanelId(null);
    }
  }, [panels.length, setPanels, updatePanelNumbers, setSelectedPanelId]);

  return {
    splitPanelHorizontally,
    splitPanelVertically,
    deletePanel
  };
};
