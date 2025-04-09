/**
 * ImagePreviewContainer Component
 * 
 * This component displays the AI-generated panel layout image in a container with
 * appropriate styling and error handling. It provides a visual representation of
 * the panel layout that will be sent to the AI for script generation.
 * 
 * @module ImagePreviewContainer
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
    console.log(`[ImagePreviewContainer] ${message}`, data || '');
  }
};

/**
 * Props for the ImagePreviewContainer component
 */
interface ImagePreviewContainerProps {
  /** URL of the AI-generated preview image to display */
  imageUrl: string;
}

/**
 * ImagePreviewContainer component displays the AI-generated panel layout image
 * 
 * @param {ImagePreviewContainerProps} props - The component props
 * @returns {JSX.Element} The rendered ImagePreviewContainer component
 */
export const ImagePreviewContainer: React.FC<ImagePreviewContainerProps> = ({ imageUrl }) => {
  // Log component render for debugging
  debugLog('Rendering ImagePreviewContainer', { imageUrl });
  
  return (
    <div 
      id="image-preview-container" 
      data-testid="image-preview-container"
      className="w-2/3 border border-gray-300 dark:border-dark-600 shadow-md max-h-[70vh] overflow-hidden"
    >
      <img 
        id="preview-image"
        data-testid="preview-image"
        src={imageUrl} 
        alt="Panel Layout Preview" 
        className="max-w-full object-contain max-h-[70vh]"
        style={{ width: '100%', height: 'auto' }}
        onError={() => debugLog('Error loading image', { imageUrl })}
        onLoad={() => debugLog('Image loaded successfully')}
      />
    </div>
  );
};
