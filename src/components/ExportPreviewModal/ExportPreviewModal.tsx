import React, { useEffect, useState, useRef } from 'react';
import { ExportFormat } from '../ComicPanelCreator/Controls/Controls';
import { generatePreviewImage } from '../ExportUtils';


interface ExportPreviewModalProps {
  containerRef: React.RefObject<HTMLDivElement>;
  exportFormat: ExportFormat;
  onClose: () => void;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({ 
  containerRef, 
  exportFormat, 
  onClose 
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generatePreview = async () => {
      if (!containerRef.current) return;
      
      setIsLoading(true);
      
      try {
        // Use the generatePreviewImage function from ExportUtils
        const imgData = await generatePreviewImage(containerRef);
        if (imgData) {
          setPreviewImage(imgData);
        }
      } catch (error) {
        console.error('Error generating export preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [containerRef]);

  // We don't need to manually resize the image as we'll use CSS to handle it

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalContentRef}
        className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-600">
          <h2 className="text-xl font-semibold">Export Preview ({exportFormat.toUpperCase()})</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-auto flex-grow flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-300">Generating export preview...</p>
            </div>
          ) : previewImage ? (
            <div className="flex flex-col items-center w-full">
              <div className="w-full border border-gray-300 dark:border-dark-600 shadow-md max-h-[70vh] overflow-hidden">
                <img 
                  src={previewImage} 
                  alt="Export Preview" 
                  className="max-w-full object-contain max-h-[70vh]"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                This is how your comic will look when exported as {exportFormat.toUpperCase()}.
              </p>
            </div>
          ) : (
            <div className="text-red-500 p-4">
              Failed to generate preview. Please try again.
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-800 dark:text-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
