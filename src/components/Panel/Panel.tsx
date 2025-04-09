/**
 * Panel Component
 * 
 * Renders an individual comic panel with interactive controls for:
 * - Selection and dragging
 * - Resizing from any edge or corner
 * - Splitting horizontally or vertically
 * - Deletion (when allowed)
 * - Script viewing (when available)
 * 
 * Panels display their number and can be manipulated through a set of controls
 * that appear when the panel is selected and controls are enabled.
 */
import React from 'react';
import { Panel as PanelType, ResizeDirection } from '../../../shared/types/panelTypes';
import { percentToPixels } from '../../../shared/utils/panelUtils';
import { PanelControls } from './PanelControls/index';
import { ResizeHandles } from './ResizeHandles/index';

/**
 * Props for the Panel component
 */
interface PanelProps {
  panel: PanelType;
  isSelected: boolean;
  showControls: boolean;
  onSelect: (id: string) => void;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
  onStartResize: (e: React.MouseEvent, id: string, direction: ResizeDirection) => void;
  onSplitHorizontally: (id: string) => void;
  onSplitVertically: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  hasScript: boolean;
  onViewScript?: (id: string) => void;
}

/**
 * Renders an interactive comic panel with controls for manipulation
 * 
 * @param panel - The panel data to render
 * @param isSelected - Whether this panel is currently selected
 * @param showControls - Whether to show the interactive controls
 * @param onSelect - Callback when panel is selected
 * @param onStartDrag - Callback when dragging starts
 * @param onStartResize - Callback when resizing starts
 * @param onSplitHorizontally - Callback to split panel horizontally
 * @param onSplitVertically - Callback to split panel vertically
 * @param onDelete - Callback to delete the panel
 * @param canDelete - Whether this panel can be deleted
 * @param hasScript - Whether this panel has an associated script
 * @param onViewScript - Callback to view the panel's script
 * @returns A panel component with interactive controls
 */
export const Panel: React.FC<PanelProps> = ({
  panel,
  isSelected,
  showControls,
  onSelect,
  onStartDrag,
  onStartResize,
  onSplitHorizontally,
  onSplitVertically,
  onDelete,
  canDelete,
  hasScript,
  onViewScript,
}) => {
  /**
   * Convert panel dimensions from percentages to pixels
   */
  const pixelDims = percentToPixels(panel);
  
  /**
   * Determine if panel is large enough for standard controls
   */
  const isLargeEnough = pixelDims.width > 60 && pixelDims.height > 60;

  /**
   * Handle panel selection
   * 
   * @param e - Mouse event
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(panel.id);
  };

  return (
    <div
      id={`panel-${panel.id}`}
      data-testid={`panel-${panel.id}`}
      className={`panel absolute border-2 ${isSelected ? 'border-blue-500' : 'border-gray-400'} overflow-visible rounded-none`}
      style={{
        backgroundColor: 'rgba(150, 150, 150, 0.5)',
        background: 'rgba(150, 150, 150, 0.5)',
        mixBlendMode: 'normal',
        opacity: 1,
        left: pixelDims.x,
        top: pixelDims.y,
        width: pixelDims.width,
        height: pixelDims.height,
        cursor: 'grab',
        zIndex: isSelected ? 3 : 2,
        pointerEvents: 'auto',
        boxShadow: 'none',
        borderRadius: 0
      }}
      onClick={handleClick}
      onMouseDown={(e) => onStartDrag(e, panel.id)}
    >
      {/* Panel Number */}
      {panel.panelNumber !== undefined && (
        <div 
          id={`panel-${panel.id}-number-container`}
          data-testid={`panel-${panel.id}-number-container`}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div 
            id={`panel-${panel.id}-number`}
            data-testid={`panel-${panel.id}-number`}
            className="text-gray-800 text-5xl font-bold panel-number" 
            style={{ textShadow: '0px 0px 3px white' }}
          >
            {panel.panelNumber}
          </div>
        </div>
      )}
      {/* Panel Controls - Only shown when panel is selected */}
      {showControls && (
        <PanelControls
          panelId={panel.id}
          isLargeEnough={isLargeEnough}
          canDelete={canDelete}
          hasScript={hasScript}
          onSplitHorizontally={onSplitHorizontally}
          onSplitVertically={onSplitVertically}
          onDelete={onDelete}
          onViewScript={onViewScript}
        />
      )}
      
      {/* Resize Handles - Only shown when panel is selected */}
      {showControls && (
        <ResizeHandles
          panelId={panel.id}
          onStartResize={onStartResize}
        />
      )}
    </div>
  );
};
