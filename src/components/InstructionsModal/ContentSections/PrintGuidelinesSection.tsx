/**
 * PrintGuidelinesSection Component
 * 
 * Displays information about print guidelines and export options for the instructions modal.
 * Includes explanations of print guides and available export formats.
 */
import React from 'react';

/**
 * Renders the print guidelines and export section for the instructions modal
 * 
 * @returns A React component with print guide and export option explanations
 */
export const PrintGuidelinesSection: React.FC = () => {
  return (
    <div 
      id="instructions-modal-print-guidelines-section"
      data-testid="instructions-modal-print-guidelines-section"
      className="space-y-4"
    >
      {/* Print Guidelines */}
      <div
        id="instructions-modal-print-guidelines"
        data-testid="instructions-modal-print-guidelines"
      >
        <h4 
          id="instructions-modal-print-guidelines-title"
          data-testid="instructions-modal-print-guidelines-title"
          className="font-medium mb-2"
        >Print Guidelines</h4>
        <ul 
          id="instructions-modal-print-guidelines-list"
          data-testid="instructions-modal-print-guidelines-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li><span className="font-medium text-cyan-500">Cyan lines:</span> Indicate trim area (where the page will be cut)</li>
          <li><span className="font-medium text-pink-500">Magenta lines:</span> Indicate safe area (keep important content inside)</li>
          <li>Toggle "Show Print Guides" to hide/show these guidelines</li>
          <li>Guidelines appear in non-photo blue when exporting for professional printing</li>
        </ul>
      </div>
      
      <div
        id="instructions-modal-export-options"
        data-testid="instructions-modal-export-options"
      >
        {/* Export Options */}
        <h4 
          id="instructions-modal-export-options-title"
          data-testid="instructions-modal-export-options-title"
          className="font-medium mb-2"
        >Export Options</h4>
        <ul 
          id="instructions-modal-export-options-list"
          data-testid="instructions-modal-export-options-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li>Export your comic as PDF or PNG</li>
          <li>Select your preferred format using the radio buttons</li>
          <li>Panel numbers and controls are hidden in exports</li>
          <li>Panel borders appear in black in exports for clarity</li>
          <li>Use the "Gutter Size" slider to adjust spacing between panels</li>
        </ul>
      </div>
    </div>
  );
};
