/**
 * PanelLayoutSection Component
 * 
 * Displays information about panel layout creation within the instructions modal.
 * Includes panel management and controls explanations with instructions.
 */
import React from 'react';

/**
 * Renders the panel layout creation section for the instructions modal
 * 
 * @returns A React component with panel management and control explanations
 */
export const PanelLayoutSection: React.FC = () => {
  return (
    <div 
      id="instructions-modal-panel-layout-section"
      data-testid="instructions-modal-panel-layout-section"
      className="space-y-4"
    >
      {/* Panel Management */}
      <div 
        id="instructions-modal-panel-management"
        data-testid="instructions-modal-panel-management"
      >
        <h4 
          id="instructions-modal-panel-management-title"
          data-testid="instructions-modal-panel-management-title"
          className="font-medium mb-2"
        >Panel Management</h4>
        <ul 
          id="instructions-modal-panel-management-list"
          data-testid="instructions-modal-panel-management-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li><span className="font-medium">Select:</span> Click on a panel to select it</li>
          <li><span className="font-medium">Move:</span> Drag panels to reposition them</li>
          <li><span className="font-medium">Resize:</span> Use the corner and edge handles to resize panels</li>
          <li><span className="font-medium">Numbers:</span> Panel numbers are automatically displayed and updated</li>
        </ul>
      </div>
      
      {/* Panel Controls */}
      <div
        id="instructions-modal-panel-controls"
        data-testid="instructions-modal-panel-controls"
      >
        <h4 
          id="instructions-modal-panel-controls-title"
          data-testid="instructions-modal-panel-controls-title"
          className="font-medium mb-2"
        >Panel Controls</h4>
        <ul 
          id="instructions-modal-panel-controls-list"
          data-testid="instructions-modal-panel-controls-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li><span className="font-medium">Split:</span> Divide panels horizontally or vertically</li>
          <li><span className="font-medium">Delete:</span> Remove panels (when more than one exists)</li>
          <li><span className="font-medium">Toggle Controls:</span> Hide panel controls for a cleaner view</li>
          <li><span className="font-medium">Reset:</span> Start over with a single panel</li>
        </ul>
      </div>
    </div>
  );
};
