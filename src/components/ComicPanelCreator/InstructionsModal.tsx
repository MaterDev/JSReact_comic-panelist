import React from 'react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100">
        <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Comic Panel Creator Instructions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Panel Management</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Click on a panel to select it</li>
                <li>Drag panels to reposition them</li>
                <li>Use the corner and edge handles to resize panels</li>
                <li>Panel numbers are automatically displayed and updated</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Panel Controls</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Split panels horizontally or vertically</li>
                <li>Delete panels (when more than one exists)</li>
                <li>Toggle "Show Controls" to hide panel controls</li>
                <li>Controls are automatically hidden when exporting</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Print Guidelines</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Cyan lines indicate trim area</li>
                <li>Magenta lines indicate safe area</li>
                <li>Toggle "Show Print Guides" to hide/show these guidelines</li>
                <li>Guidelines appear in non-photo blue when exporting</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Script Generation</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Create your panel layout first</li>
                <li>Use "Preview AI Image" to see what will be sent to the AI</li>
                <li>Click "Generate Script" to create a script based on your layout</li>
                <li>View and edit the generated script</li>
                <li>Optional: Add your Anthropic API key for better results</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Export Options</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Export your comic as PDF or PNG</li>
                <li>Select your preferred format using the radio buttons</li>
                <li>Panel numbers are hidden in exports</li>
                <li>Panel borders appear in black in exports</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Additional Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Toggle between light and dark mode</li>
                <li>Adjust gutter size between panels</li>
                <li>Reset all panels to start over</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
