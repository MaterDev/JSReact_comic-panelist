/**
 * PanelControls Component
 * 
 * Renders a set of control buttons for manipulating comic panels, including:
 * - Splitting panels horizontally or vertically
 * - Deleting panels (when allowed)
 * - Viewing panel scripts (when available)
 * 
 * Controls adapt their layout based on panel size, displaying either in the corner
 * or centered for small panels.
 */
import React from 'react';

/**
 * Props for the PanelControls component
 */
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

/**
 * Renders control buttons for panel manipulation
 * 
 * @param panelId - ID of the panel these controls affect
 * @param isLargeEnough - Whether the panel is large enough for corner controls
 * @param canDelete - Whether the panel can be deleted
 * @param hasScript - Whether the panel has an associated script
 * @param onSplitHorizontally - Callback to split panel horizontally
 * @param onSplitVertically - Callback to split panel vertically
 * @param onDelete - Callback to delete the panel
 * @param onViewScript - Callback to view the panel's script
 * @returns Control buttons positioned appropriately for the panel size
 */
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
  /**
   * Common control buttons
   */
  const controls = (
    <>
      {/* Split and delete buttons */}
      <button
        id={`panel-${panelId}-split-h-button`}
        data-testid={`panel-${panelId}-split-h-button`}
        onClick={(e) => {
          e.stopPropagation();
          onSplitHorizontally(panelId);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
        title="Split Horizontally"
        aria-label="Split panel horizontally"
      >
        ⬍
      </button>
      {/* Vertical split button */}
      <button
        id={`panel-${panelId}-split-v-button`}
        data-testid={`panel-${panelId}-split-v-button`}
        onClick={(e) => {
          e.stopPropagation();
          onSplitVertically(panelId);
        }}
        className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
        title="Split Vertically"
        aria-label="Split panel vertically"
      >
        ⬌
      </button>
      {/* Delete button */}
      {canDelete && (
        <button
          id={`panel-${panelId}-delete-button`}
          data-testid={`panel-${panelId}-delete-button`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(panelId);
          }}
          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
          title="Delete Panel"
          aria-label="Delete panel"
        >
          ×
        </button>
      )}
      {/* Script button */}
      {hasScript && onViewScript && (
        <button
          id={`panel-${panelId}-script-button`}
          data-testid={`panel-${panelId}-script-button`}
          onClick={(e) => {
            e.stopPropagation();
            onViewScript(panelId);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-none w-6 h-6 flex items-center justify-center text-xs"
          title="View Script"
          aria-label="View panel script"
        >
          📝
        </button>
      )}
    </>
  );

  /**
   * For small panels, display controls centered in the panel
   */
  if (!isLargeEnough) {
    return (
      <div 
        id={`panel-${panelId}-centered-controls`}
        data-testid={`panel-${panelId}-centered-controls`}
        className="absolute inset-0 flex items-center justify-center panel-controls"
      >
        <div 
          id={`panel-${panelId}-controls-container`}
          data-testid={`panel-${panelId}-controls-container`}
          className="bg-black bg-opacity-60 rounded-none p-1 flex gap-1"
        >
          {controls}
        </div>
      </div>
    );
  }

  /**
   * For larger panels, display controls in the top-right corner
   */
  return (
    <div 
      id={`panel-${panelId}-corner-controls`}
      data-testid={`panel-${panelId}-corner-controls`}
      className="panel-controls absolute top-2 right-2 flex gap-1 z-10"
    >
      {controls}
    </div>
  );
};
