/**
 * ResizeHandles Component
 * 
 * Renders a set of resize handles for comic panels, allowing resizing from:
 * - All four corners (NW, NE, SW, SE)
 * - All four edges (N, E, S, W)
 * 
 * Each handle triggers the appropriate resize operation when dragged.
 */
import React from 'react';
import { ResizeDirection } from '../../../../shared/types/panelTypes';

/**
 * Props for the ResizeHandles component
 */
interface ResizeHandlesProps {
  panelId: string;
  onStartResize: (e: React.MouseEvent, id: string, direction: ResizeDirection) => void;
}

/**
 * Renders resize handles for all corners and edges of a panel
 * 
 * @param panelId - ID of the panel these handles affect
 * @param onStartResize - Callback when resizing starts, with direction
 * @returns A set of resize handles positioned around the panel
 */
export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  panelId,
  onStartResize,
}) => {
  return (
    <>
      {/* Corner resize handles */}
      <div 
        id={`panel-${panelId}-resize-nw`}
        data-testid={`panel-${panelId}-resize-nw`}
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'nw')}
        aria-label="Resize from northwest corner"
      />
      <div 
        id={`panel-${panelId}-resize-ne`}
        data-testid={`panel-${panelId}-resize-ne`}
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'ne')}
        aria-label="Resize from northeast corner"
      />
      <div 
        id={`panel-${panelId}-resize-sw`}
        data-testid={`panel-${panelId}-resize-sw`}
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'sw')}
        aria-label="Resize from southwest corner"
      />
      <div 
        id={`panel-${panelId}-resize-se`}
        data-testid={`panel-${panelId}-resize-se`}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'se')}
        aria-label="Resize from southeast corner"
      />
      
      {/* Edge resize handles */}
      <div 
        id={`panel-${panelId}-resize-n`}
        data-testid={`panel-${panelId}-resize-n`}
        className="absolute top-0 w-full h-2 cursor-n-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'n')}
        aria-label="Resize from top edge"
      />
      <div 
        id={`panel-${panelId}-resize-e`}
        data-testid={`panel-${panelId}-resize-e`}
        className="absolute right-0 h-full w-2 cursor-e-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'e')}
        aria-label="Resize from right edge"
      />
      <div 
        id={`panel-${panelId}-resize-s`}
        data-testid={`panel-${panelId}-resize-s`}
        className="absolute bottom-0 w-full h-2 cursor-s-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 's')}
        aria-label="Resize from bottom edge"
      />
      <div 
        id={`panel-${panelId}-resize-w`}
        data-testid={`panel-${panelId}-resize-w`}
        className="absolute left-0 h-full w-2 cursor-w-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'w')}
        aria-label="Resize from left edge"
      />
    </>
  );
};
