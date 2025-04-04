/**
 * ModalContent Component
 * 
 * This component displays the main content area of the AI Preview modal, including
 * the sidebar with explanatory text and the image preview. It handles the layout
 * and presentation of the preview image and supporting information.
 * 
 * @module ModalContent
 */
import React from 'react';
import { ModalSidebar } from '../ModalSidebar';
import { ImagePreviewContainer } from '../ImagePreviewContainer';

// DEBUG flag - set to true to enable console logging for this component
const DEBUG = false;

/**
 * Log debug information if DEBUG flag is enabled
 * @param message - The message to log
 * @param data - Optional data to log
 */
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[ModalContent] ${message}`, data || '');
  }
};

/**
 * Props for the ModalContent component
 */
interface ModalContentProps {
  /** URL of the AI-generated preview image to display */
  imageUrl: string;
}

/**
 * ModalContent component displays the main content area with sidebar and image preview
 * 
 * @param {ModalContentProps} props - The component props
 * @returns {JSX.Element} The rendered ModalContent component
 */
export const ModalContent: React.FC<ModalContentProps> = ({ imageUrl }) => {
  // Log component render for debugging
  debugLog('Rendering ModalContent', { imageUrl });
  
  return (
    <div 
      id="modal-content" 
      data-testid="modal-content"
      className="p-4 overflow-auto flex-grow"
    >
      <div 
        id="modal-content-layout" 
        data-testid="modal-content-layout"
        className="flex flex-row items-start gap-6"
      >
        {/* Sidebar with explanatory text */}
        <ModalSidebar />
        
        {/* Image preview container */}
        <ImagePreviewContainer imageUrl={imageUrl} />
      </div>
    </div>
  );
};
