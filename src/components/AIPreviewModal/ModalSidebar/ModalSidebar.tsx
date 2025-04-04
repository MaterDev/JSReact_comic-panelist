/**
 * ModalSidebar Component
 * 
 * This component displays the sidebar section of the AI Preview modal with explanatory text
 * about how the AI interprets the panel layout. It provides context to help users understand
 * what elements are included in the preview and how they will be used by the AI.
 * 
 * @module ModalSidebar
 */
import React from 'react';

// DEBUG flag - set to true to enable console logging for this component
const DEBUG = false;

/**
 * Log debug information if DEBUG flag is enabled
 * @param message - The message to log
 * @param data - Optional data to log
 */
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[ModalSidebar] ${message}`, data || '');
  }
};

/**
 * Props for the ModalSidebar component
 */
interface ModalSidebarProps {
  /** Optional title to display in the sidebar */
  title?: string;
}

/**
 * ModalSidebar component displays explanatory text about the AI preview
 * 
 * @param {ModalSidebarProps} props - The component props
 * @returns {JSX.Element} The rendered ModalSidebar component
 */
export const ModalSidebar: React.FC<ModalSidebarProps> = ({ 
  title = "AI Layout Preview" // Default title if none provided
}) => {
  // Log component render for debugging
  debugLog('Rendering ModalSidebar', { title });
  
  return (
    <div id="modal-sidebar" data-testid="modal-sidebar" className="w-1/3">
      <h3 id="modal-sidebar-title" className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div id="modal-sidebar-explanation" data-testid="modal-sidebar-explanation" className="text-sm text-gray-700 dark:text-gray-200 space-y-3">
        <p>
          This is the panel layout image that will be sent to the AI for script generation.
        </p>
        <p>
          <strong className="text-gray-900 dark:text-white">Panel Numbers:</strong> Shown to help the AI understand the reading order.
        </p>
        <p>
          <strong className="text-gray-900 dark:text-white">Controls:</strong> Hidden to provide a clean view for the AI.
        </p>
        <p>
          <strong className="text-gray-900 dark:text-white">Guidelines:</strong> Hidden as they're not relevant to the script content.
        </p>
        <p className="italic mt-4 text-gray-700 dark:text-gray-200">
          The AI will use this visual representation along with the panel coordinates to generate a script that matches your layout.
        </p>
      </div>
    </div>
  );
};
