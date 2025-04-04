/**
 * AIPreviewModal Component
 * 
 * This component displays a modal with an AI-generated preview image of the comic panel layout.
 * It provides a full-screen overlay with the preview image and explanatory text about how
 * the AI interprets the panel layout. Users can close the modal by clicking the X button.
 * 
 * - The modal uses fixed positioning and z-index: 50 to display above other content
 * 
 * @module AIPreviewModal
 */
import React from 'react';
import { ModalHeader } from './ModalHeader';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';

// DEBUG flag - set to true to enable console logging for this component
const DEBUG = false;

/**
 * Log debug information if DEBUG flag is enabled
 * @param message - The message to log
 * @param data - Optional data to log
 */
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[AIPreviewModal] ${message}`, data || '');
  }
};

/**
 * Props for the AIPreviewModal component
 */
interface AIPreviewModalProps {
  /** URL of the AI-generated preview image to display */
  imageUrl: string;
  /** Callback function to execute when the modal is closed */
  onClose: () => void;
}

/**
 * AIPreviewModal component displays an AI-generated preview image in a modal dialog
 * 
 * @param {AIPreviewModalProps} props - The component props
 * @returns {JSX.Element} The rendered AIPreviewModal component
 */
export const AIPreviewModal: React.FC<AIPreviewModalProps> = ({ imageUrl, onClose }) => {
  // Log component render with props for debugging
  debugLog('Rendering AIPreviewModal', { imageUrl });
  return (
    <div 
      id="ai-preview-modal-overlay" 
      data-testid="ai-preview-modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div 
        id="ai-preview-modal-container" 
        data-testid="ai-preview-modal-container"
        className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100"
      >
        {/* Modal header with title and close button */}
        <ModalHeader title="AI Panel Layout Preview" onClose={onClose} />
        
        {/* Modal content area with preview image and explanation */}
        <ModalContent imageUrl={imageUrl} />
        
        {/* Modal footer with actions */}
        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
};
