import React from 'react';
import { Panel as PanelType, ResizeDirection } from './types';
import { percentToPixels } from './utils';

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
  const pixelDims = percentToPixels(panel);
  const isLargeEnough = pixelDims.width > 60 && pixelDims.height > 60;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(panel.id);
  };

  const renderControls = () => {
    const controls = (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSplitHorizontally(panel.id);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded w-6 h-6 flex items-center justify-center text-xs"
          title="Split Horizontally"
        >
          ⬍
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSplitVertically(panel.id);
          }}
          className="bg-green-500 hover:bg-green-600 text-white p-1 rounded w-6 h-6 flex items-center justify-center text-xs"
          title="Split Vertically"
        >
          ⬌
        </button>
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(panel.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded w-6 h-6 flex items-center justify-center text-xs"
            title="Delete Panel"
          >
            ×
          </button>
        )}
        {hasScript && onViewScript && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewScript(panel.id);
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white p-1 rounded w-6 h-6 flex items-center justify-center text-xs"
            title="View Script"
          >
            📝
          </button>
        )}
      </>
    );

    if (!isLargeEnough) {
      return (
        <div className="absolute inset-0 flex items-center justify-center panel-controls">
          <div className="bg-black bg-opacity-60 rounded p-1 flex gap-1">
            {controls}
          </div>
        </div>
      );
    }

    return (
      <div className="panel-controls absolute top-2 right-2 flex gap-1 z-10">
        {controls}
      </div>
    );
  };

  const renderResizeHandles = () => (
    <>
      <div 
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'nw')}
      />
      <div 
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'ne')}
      />
      <div 
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'sw')}
      />
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'se')}
      />
      <div 
        className="absolute top-0 w-full h-2 cursor-n-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'n')}
      />
      <div 
        className="absolute right-0 h-full w-2 cursor-e-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'e')}
      />
      <div 
        className="absolute bottom-0 w-full h-2 cursor-s-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 's')}
      />
      <div 
        className="absolute left-0 h-full w-2 cursor-w-resize handle" 
        onMouseDown={(e) => onStartResize(e, panel.id, 'w')}
      />
    </>
  );

  return (
    <div
      className={`panel absolute border-2 ${isSelected ? 'border-blue-500' : 'border-gray-400'} bg-white hover:bg-gray-50 overflow-hidden`}
      style={{
        left: pixelDims.x,
        top: pixelDims.y,
        width: pixelDims.width,
        height: pixelDims.height,
        cursor: 'grab',
        zIndex: isSelected ? 2 : 1
      }}
      onClick={handleClick}
      onMouseDown={(e) => onStartDrag(e, panel.id)}
    >
      {panel.number !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-300 text-5xl font-bold panel-number">
            {panel.number}
          </div>
        </div>
      )}
      {showControls && renderControls()}
      {showControls && renderResizeHandles()}
    </div>
  );
};
