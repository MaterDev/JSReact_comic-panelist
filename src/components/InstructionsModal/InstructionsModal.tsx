/**
 * InstructionsModal Component
 * 
 * A multi-page modal that provides comprehensive instructions and guidance for using
 * the Comic Panelist application. Features include:
 * - Step-by-step walkthrough of application features
 * - Visual guides with explanatory text
 * - Pagination controls for navigating through instruction pages
 * - Responsive design that works in both light and dark modes
 */
import React, { useState } from 'react';

// Import content section components
import {
  IntroductionSection,
  PanelLayoutSection,
  PrintGuidelinesSection,
  ScriptGenerationSection,
  CollectionManagementSection
} from './ContentSections';

// Import navigation controls
import { SectionSelector, NavigationButtons } from './NavigationControls';

/**
 * Props for the InstructionsModal component
 */
interface InstructionsModalProps {
  onClose: () => void;
}

/**
 * Structure for instruction guide sections
 */
interface GuideSection {
  title: string;
  content: React.ReactNode;
}

/**
 * Renders a multi-page modal with instructions for using the application
 * 
 * @param onClose - Function to call when the modal is closed
 * @returns A modal component with paginated instructions
 */
export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  /**
   * Define all guide sections for the instructions modal
   */
  const guideSections: GuideSection[] = [
    // Section 1: Introduction
    {
      title: "Welcome to Comic Panelist",
      content: <IntroductionSection />
    },
    
    // Section 2: Panel Layout Creation
    {
      title: "Panel Layout Creation",
      content: <PanelLayoutSection />
    },
    
    // Section 3: Print Guidelines
    {
      title: "Print Guidelines & Export",
      content: <PrintGuidelinesSection />
    },
    
    // Section 4: Script Generation
    {
      title: "AI Script Generation",
      content: <ScriptGenerationSection />
    },
    
    // Section 5: Collection Management
    {
      title: "Collection Management",
      content: <CollectionManagementSection />
    },
    
    // Section 6: Tips & Keyboard Shortcuts
    {
      title: "Tips & Keyboard Shortcuts",
      content: (
        <div
          id="instructions-modal-tips-section"
          data-testid="instructions-modal-tips-section"
          className="space-y-4"
        >
          {/* Keyboard Shortcuts */}
          <div
            id="instructions-modal-shortcuts"
            data-testid="instructions-modal-shortcuts"
          >
            <h4 
              id="instructions-modal-shortcuts-title"
              data-testid="instructions-modal-shortcuts-title"
              className="font-medium mb-2"
            >Keyboard Shortcuts (Not Fully Implemented)</h4>
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">
              Note: These keyboard shortcuts are planned but may not be fully implemented in the current version.
            </p>
            <div 
              id="instructions-modal-shortcuts-grid"
              data-testid="instructions-modal-shortcuts-grid"
              className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300"
            >
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
          
          {/* Best Practices */}
          <div
            id="instructions-modal-best-practices"
            data-testid="instructions-modal-best-practices"
          >
            <h4 
              id="instructions-modal-best-practices-title"
              data-testid="instructions-modal-best-practices-title"
              className="font-medium mb-2"
            >Best Practices</h4>
            <ul 
              id="instructions-modal-best-practices-list"
              data-testid="instructions-modal-best-practices-list"
              className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
            >
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
  
  /**
   * Navigate to the next instruction page
   */
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  /**
   * Navigate to the previous instruction page
   */
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  /**
   * Navigate to a specific instruction page by index
   * 
   * @param pageIndex - The zero-based index of the page to navigate to
   */
  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };
  
  return (
    <div 
      id="instructions-modal-backdrop"
      data-testid="instructions-modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div 
        id="instructions-modal-container"
        data-testid="instructions-modal-container"
        className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100"
      >
        {/* Header */}
        <div 
          id="instructions-modal-header"
          data-testid="instructions-modal-header"
          className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center"
        >
          <h2 
            id="instructions-modal-title"
            data-testid="instructions-modal-title"
            className="text-xl font-semibold"
          >
            Comic Panelist Guide
          </h2>
          <button
            id="instructions-modal-close-button"
            data-testid="instructions-modal-close-button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Section Selector */}
        <SectionSelector 
          currentPage={currentPage}
          sections={guideSections}
          onGoToPage={goToPage}
        />
        
        {/* Section Content */}
        <div 
          id="instructions-modal-content"
          data-testid="instructions-modal-content"
          className="p-6 overflow-y-auto flex-grow"
        >
          <div
            id={`instructions-modal-section-${currentPage}-content`}
            data-testid={`instructions-modal-section-${currentPage}-content`}
          >
            {guideSections[currentPage].content}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <NavigationButtons 
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={goToPrevPage}
          onNext={goToNextPage}
          onClose={onClose}
        />
        
      </div>
    </div>
  );
};

export default InstructionsModal;
