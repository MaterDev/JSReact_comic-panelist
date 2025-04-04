import React from 'react';
import { ResizeDirection } from '../../../shared/types/panelTypes';

interface ResizeHandlesProps {
  panelId: string;
  onStartResize: (e: React.MouseEvent, id: string, direction: ResizeDirection) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  panelId,
  onStartResize,
}) => {
  return (
    <>
      <div 
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'nw')}
      />
      <div 
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'ne')}
      />
      <div 
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'sw')}
      />
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'se')}
      />
      <div 
        className="absolute top-0 w-full h-2 cursor-n-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'n')}
      />
      <div 
        className="absolute right-0 h-full w-2 cursor-e-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'e')}
      />
      <div 
        className="absolute bottom-0 w-full h-2 cursor-s-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 's')}
      />
      <div 
        className="absolute left-0 h-full w-2 cursor-w-resize handle" 
        onMouseDown={(e) => onStartResize(e, panelId, 'w')}
      />
    </>
  );
};

export default ResizeHandles;
