/**
 * ModalFooter Component
 * 
 * This component displays the footer section of the AI Preview modal with action buttons.
 * It provides a consistent UI for modal actions and handles user interactions with
 * the footer buttons.
 * 
 * @module ModalFooter
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
    console.log(`[ModalFooter] ${message}`, data || '');
  }
};

/**
 * Props for the ModalFooter component
 */
interface ModalFooterProps {
  /** Callback function to execute when the close button is clicked */
  onClose: () => void;
  /** Optional additional buttons to render in the footer */
  children?: React.ReactNode;
}

/**
 * ModalFooter component displays action buttons in the modal footer
 * 
 * @param {ModalFooterProps} props - The component props
 * @returns {JSX.Element} The rendered ModalFooter component
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  onClose,
  children 
}) => {
  // Log component render for debugging
  debugLog('Rendering ModalFooter');
  
  return (
    <div 
      id="modal-footer" 
      data-testid="modal-footer"
      className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end"
    >
      {/* Render any additional buttons passed as children */}
      {children}
      
      {/* Close button */}
      <button
        id="modal-close-button-footer"
        data-testid="modal-close-button"
        onClick={() => {
          debugLog('Footer close button clicked');
          onClose();
        }}
        aria-label="Close preview"
        className="bg-gray-500 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 text-white px-4 py-2 rounded mr-2"
      >
        Close
      </button>
    </div>
  );
};
