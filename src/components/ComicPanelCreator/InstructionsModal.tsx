import React, { useState } from 'react';

interface InstructionsModalProps {
  onClose: () => void;
}

// Define guide sections
interface GuideSection {
  title: string;
  content: React.ReactNode;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Define all guide sections
  const guideSections: GuideSection[] = [
    // Section 1: Introduction
    {
      title: "Welcome to Comic Panelist",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Comic Panelist is a comprehensive tool for creating and managing comic book layouts and scripts.
            This guide will walk you through all the features available in the application.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Key Features:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Design panel layouts with intuitive controls</li>
              <li>Generate AI-powered scripts based on your layouts</li>
              <li>Organize layouts into collections (comic books)</li>
              <li>View layouts in a professional comic spread format</li>
              <li>Export your work in various formats</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Navigate through this guide using the page controls at the bottom.
          </p>
        </div>
      )
    },
    
    // Section 2: Panel Layout Creation
    {
      title: "Panel Layout Creation",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Panel Management</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><span className="font-medium">Select:</span> Click on a panel to select it</li>
              <li><span className="font-medium">Move:</span> Drag panels to reposition them</li>
              <li><span className="font-medium">Resize:</span> Use the corner and edge handles to resize panels</li>
              <li><span className="font-medium">Numbers:</span> Panel numbers are automatically displayed and updated</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Panel Controls</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><span className="font-medium">Split:</span> Divide panels horizontally or vertically</li>
              <li><span className="font-medium">Delete:</span> Remove panels (when more than one exists)</li>
              <li><span className="font-medium">Toggle Controls:</span> Hide panel controls for a cleaner view</li>
              <li><span className="font-medium">Reset:</span> Start over with a single panel</li>
            </ul>
          </div>
          

        </div>
      )
    },
    
    // Section 3: Print Guidelines
    {
      title: "Print Guidelines & Export",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Print Guidelines</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><span className="font-medium text-cyan-500">Cyan lines:</span> Indicate trim area (where the page will be cut)</li>
              <li><span className="font-medium text-pink-500">Magenta lines:</span> Indicate safe area (keep important content inside)</li>
              <li>Toggle "Show Print Guides" to hide/show these guidelines</li>
              <li>Guidelines appear in non-photo blue when exporting for professional printing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Export Options</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Export your comic as PDF or PNG</li>
              <li>Select your preferred format using the radio buttons</li>
              <li>Panel numbers and controls are hidden in exports</li>
              <li>Panel borders appear in black in exports for clarity</li>
              <li>Use the "Gutter Size" slider to adjust spacing between panels</li>
            </ul>
          </div>
          

        </div>
      )
    },
    
    // Section 4: Script Generation
    {
      title: "AI Script Generation",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Script Generation Process</h4>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Create your panel layout first</li>
              <li>Click "Preview AI Image" to see exactly what will be sent to the AI</li>
              <li>Use the "Generate Script" button to create a script based on your layout</li>
              <li>Review and edit the generated script in the script panel</li>
              <li>Save your layout with the script to revisit later</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Creative Direction Controls</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><span className="font-medium">Genre:</span> Specify genre preferences (e.g., Sci-fi, Fantasy, Noir)</li>
              <li><span className="font-medium">Tone:</span> Set emotional tone (e.g., Suspenseful, Humorous)</li>
              <li><span className="font-medium">Inspiration:</span> Provide sources of inspiration (e.g., Film noir, Cyberpunk)</li>
              <li><span className="font-medium">Detailed Guidance:</span> Add longer inspiration text for more specific direction</li>
              <li><span className="font-medium">Exclusions:</span> List content you want to avoid in the script</li>
            </ul>
          </div>
          

        </div>
      )
    },
    
    // Section 5: Collection Management
    {
      title: "Collection Management",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Comic Book Collections</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Create named collections to organize your comic book pages</li>
              <li>Add descriptions to keep track of your projects</li>
              <li>Switch between collections using the dropdown selector</li>
              <li>Edit or delete collections as needed</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Page Management</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><span className="font-medium">Create Pages:</span> Add new pages to your collection</li>
              <li><span className="font-medium">Delete Pages:</span> Remove pages with confirmation</li>
              <li><span className="font-medium">Load Pages:</span> Open existing pages for editing</li>
              <li><span className="font-medium">Page Types:</span> Designate special pages for covers and back covers</li>
              <li><span className="font-medium">Automatic Ordering:</span> Pages maintain sequential display order</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Comic Spread View</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>View your pages in a professional comic spread format</li>
              <li>Pages are displayed in pairs as they would appear in a physical book</li>
              <li>Front and back covers are displayed appropriately</li>
              <li>Thumbnails provide quick visual reference to your layouts</li>
            </ul>
          </div>
        </div>
      )
    },
    
    // Section 6: Tips & Keyboard Shortcuts
    {
      title: "Tips & Keyboard Shortcuts",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono mr-2">Ctrl+Z</span>
                <span>Undo last action</span>
              </div>
              <div className="flex items-center">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono mr-2">Ctrl+Y</span>
                <span>Redo action</span>
              </div>
              <div className="flex items-center">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono mr-2">Del</span>
                <span>Delete selected panel</span>
              </div>
              <div className="flex items-center">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono mr-2">Esc</span>
                <span>Deselect panel</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Best Practices</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Save your work frequently by creating layouts in collections</li>
              <li>Use descriptive names for collections and pages</li>
              <li>Consider reader flow when designing panel layouts</li>
              <li>Use the AI preview to ensure your layout is clear before generating scripts</li>
              <li>Experiment with different creative direction settings for varied results</li>
            </ul>
          </div>
          

        </div>
      )
    }
  ];
  
  const totalPages = guideSections.length;
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100">
        <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Comic Panelist Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Dropdown */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center">
          <div className="relative w-full max-w-xs">
            <select
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              className="w-full p-2 pr-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {guideSections.map((section, index) => (
                <option key={index} value={index}>
                  {index + 1}. {section.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Section Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {guideSections[currentPage].content}
        </div>
        
        {/* Navigation Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end items-center">

          
          <div className="flex space-x-2">
            {/* Previous Button */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`px-3 py-1.5 rounded flex items-center ${currentPage === 0 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            {/* Next/Close Button */}
            {currentPage < totalPages - 1 ? (
              <button
                onClick={goToNextPage}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded flex items-center"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded"
              >
                Got it!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
