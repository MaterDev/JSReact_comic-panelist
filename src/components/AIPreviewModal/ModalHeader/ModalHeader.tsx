/**
 * ModalHeader Component
 * 
 * This component displays a header section for modal dialogs with a title and close button.
 * It's designed to be reusable across different modal components in the application.
 * 
 * @module ModalHeader
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
    console.log(`[ModalHeader] ${message}`, data || '');
  }
};

/**
 * Props for the ModalHeader component
 */
interface ModalHeaderProps {
  /** Title to display in the header */
  title: string;
  /** Callback function to execute when the close button is clicked */
  onClose: () => void;
}

/**
 * ModalHeader component displays a header with title and close button
 * 
 * @param {ModalHeaderProps} props - The component props
 * @returns {JSX.Element} The rendered ModalHeader component
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  // Log component render for debugging
  debugLog('Rendering ModalHeader', { title });
  
  return (
    <div 
      id="modal-header" 
      data-testid="modal-header"
      className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center"
    >
      <h2 id="modal-header-title" className="text-xl font-semibold">{title}</h2>
      <button
        id="modal-header-close-button"
        data-testid="modal-header-close-button"
        onClick={() => {
          debugLog('Header close button clicked');
          onClose();
        }}
        aria-label="Close modal"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
