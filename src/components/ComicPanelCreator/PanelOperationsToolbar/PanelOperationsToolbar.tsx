import React from 'react';
import { Panel } from '../../../../shared/types/panelTypes';

interface PanelOperationsToolbarProps {
  selectedPanel: Panel | undefined;
  canDelete: boolean;
  hasScript: boolean;
  onSplitHorizontally: (id: string) => void;
  onSplitVertically: (id: string) => void;
  onDelete: (id: string) => void;
  onViewScript?: (id: string) => void;
}

export const PanelOperationsToolbar: React.FC<PanelOperationsToolbarProps> = ({
  selectedPanel,
  canDelete,
  hasScript,
  onSplitHorizontally,
  onSplitVertically,
  onDelete,
  onViewScript
}) => {
  if (!selectedPanel) {
    return (
      <div className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
        <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
          Select a panel to perform operations
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
      <h2 className="text-base font-semibold mb-2">Panel Operations</h2>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Panel #{selectedPanel.number}</span>
          <div className="flex gap-1">
            <button
              onClick={() => onSplitHorizontally(selectedPanel.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded w-8 h-8 flex items-center justify-center text-lg"
              title="Split Horizontally"
              data-testid="split-horizontally-button"
            >
              ⬍
            </button>
            <button
              onClick={() => onSplitVertically(selectedPanel.id)}
              className="bg-green-500 hover:bg-green-600 text-white p-1 rounded w-8 h-8 flex items-center justify-center text-lg"
              title="Split Vertically"
              data-testid="split-vertically-button"
            >
              ⬌
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(selectedPanel.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded w-8 h-8 flex items-center justify-center text-lg"
                title="Delete Panel"
                data-testid="delete-panel-button"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {hasScript && onViewScript && (
          <button
            onClick={() => onViewScript(selectedPanel.id)}
            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded w-full flex items-center justify-center text-sm"
            title="View Script for this Panel"
            data-testid="view-panel-script-button"
          >
            <span className="mr-1">📝</span> View Panel Script
          </button>
        )}
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Position:</span>
            <span>X: {selectedPanel.x.toFixed(1)}%, Y: {selectedPanel.y.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span>W: {selectedPanel.width.toFixed(1)}%, H: {selectedPanel.height.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelOperationsToolbar;
