import React from 'react';

interface PreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100">
        <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Panel Layout Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-auto flex-grow">
          <div className="flex flex-row items-start gap-6">
            <div className="w-1/3">
              <h3 className="text-lg font-medium mb-3">AI Layout Preview</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                <p>
                  This is the panel layout image that will be sent to the AI for script generation.
                </p>
                <p>
                  <strong>Panel Numbers:</strong> Shown to help the AI understand the reading order.
                </p>
                <p>
                  <strong>Controls:</strong> Hidden to provide a clean view for the AI.
                </p>
                <p>
                  <strong>Guidelines:</strong> Hidden as they're not relevant to the script content.
                </p>
                <p className="italic mt-4 dark:text-gray-300">
                  The AI will use this visual representation along with the panel coordinates to generate a script that matches your layout.
                </p>
              </div>
            </div>
            <div className="w-2/3 border border-gray-300 dark:border-dark-600 shadow-md max-h-[70vh] overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Panel Layout Preview" 
                className="max-w-full object-contain max-h-[70vh]"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 text-white px-4 py-2 rounded mr-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
