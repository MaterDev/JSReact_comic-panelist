/**
 * Panel State Hook
 * 
 * This hook manages the state of panels in the comic creator, including:
 * - Panel array state (add, update, delete)
 * - Panel numbering logic
 * - Gutter size management
 */
import { useState, useRef, useCallback } from 'react';
import { Panel } from '../../../../shared/types/panelTypes';
import {
  TRIM_INSET_PERCENT,
  TRIM_WIDTH_PERCENT,
  TRIM_HEIGHT_PERCENT,
  percentToPixels
} from '../../../../shared/utils/panelUtils';

interface UsePanelStateProps {
  onPanelChange?: () => void;
}

interface UsePanelStateReturn {
  panels: Panel[];
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>;
  gutterSize: number;
  setGutterSize: React.Dispatch<React.SetStateAction<number>>;
  nextPanelIdRef: React.MutableRefObject<number>;
  updatePanelNumbers: (updatedPanels: Panel[]) => Panel[];
  resetPanels: () => void;
}

export const usePanelState = ({ onPanelChange }: UsePanelStateProps = {}): UsePanelStateReturn => {
  // Initialize with a default panel
  const [panels, setPanels] = useState<Panel[]>([
    {
      id: 'panel-1',
      x: TRIM_INSET_PERCENT,
      y: (100 - TRIM_HEIGHT_PERCENT) / 2,
      width: TRIM_WIDTH_PERCENT,
      height: TRIM_HEIGHT_PERCENT,
      panelNumber: 1
    }
  ]);
  
  // Gutter size between panels
  const [gutterSize, setGutterSize] = useState(10);
  
  // Track next panel ID
  const nextPanelIdRef = useRef(2);

  /**
   * Updates panel numbers based on their position (top to bottom, left to right)
   */
  const updatePanelNumbers = useCallback((updatedPanels: Panel[]): Panel[] => {
    // Sort panels by position (top to bottom, left to right)
    const sortedPanels = [...updatedPanels].sort((a, b) => {
      const aPixels = percentToPixels(a);
      const bPixels = percentToPixels(b);
      // First sort by y (top to bottom)
      if (Math.abs(aPixels.y - bPixels.y) > 20) { // Use a threshold to group panels in roughly the same row
        return aPixels.y - bPixels.y;
      }
      // If y is similar, sort by x (left to right)
      return aPixels.x - bPixels.x;
    });

    // Assign numbers sequentially
    return sortedPanels.map((panel, index) => ({
      ...panel,
      panelNumber: index + 1
    }));
  }, []);

  /**
   * Resets the panel layout to a single default panel
   */
  const resetPanels = useCallback((): void => {
    setPanels([
      {
        id: 'panel-1',
        x: TRIM_INSET_PERCENT,
        y: (100 - TRIM_HEIGHT_PERCENT) / 2,
        width: TRIM_WIDTH_PERCENT,
        height: TRIM_HEIGHT_PERCENT,
        panelNumber: 1
      }
    ]);
    nextPanelIdRef.current = 2;
  }, []);

  // Wrap setPanels to call onPanelChange when panels are updated
  const wrappedSetPanels = useCallback((panelsOrUpdater: React.SetStateAction<Panel[]>) => {
    setPanels(prevPanels => {
      const newPanels = typeof panelsOrUpdater === 'function' 
        ? panelsOrUpdater(prevPanels) 
        : panelsOrUpdater;
      
      // Call onPanelChange if provided
      if (onPanelChange) {
        onPanelChange();
      }
      
      return newPanels;
    });
  }, [onPanelChange]);

  return {
    panels,
    setPanels: wrappedSetPanels,
    gutterSize,
    setGutterSize,
    nextPanelIdRef,
    updatePanelNumbers,
    resetPanels
  };
};
