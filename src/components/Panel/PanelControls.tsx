import React from 'react';

interface PanelControlsProps {
  panelId: string;
  isLargeEnough: boolean;
  canDelete: boolean;
  hasScript: boolean;
  onSplitHorizontally: (id: string) => void;
  onSplitVertically: (id: string) => void;
  onDelete: (id: string) => void;
  onViewScript?: (id: string) => void;
}

export const PanelControls: React.FC<PanelControlsProps> = ({
  panelId,
  isLargeEnough,
  canDelete,
  hasScript,
  onSplitHorizontally,
  onSplitVertically,
  onDelete,
  onViewScript,
}) => {
  const controls = (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSplitHorizontally(panelId);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
        title="Split Horizontally"
      >
        ⬍
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSplitVertically(panelId);
        }}
        className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
        title="Split Vertically"
      >
        ⬌
      </button>
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(panelId);
          }}
          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
          title="Delete Panel"
        >
          ×
        </button>
      )}
      {hasScript && onViewScript && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewScript(panelId);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
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
        <div className="bg-black bg-opacity-60 rounded-none p-1 flex gap-1">
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

export default PanelControls;
