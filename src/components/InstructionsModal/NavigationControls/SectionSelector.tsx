/**
 * Section Selector Component
 * 
 * Renders a dropdown selector for instruction sections in the InstructionsModal.
 * Allows users to directly navigate to specific sections of the guide.
 */
import React from 'react';

/**
 * Section structure interface
 */
interface GuideSection {
  title: string;
  content: React.ReactNode;
}

/**
 * Props for the SectionSelector component
 */
interface SectionSelectorProps {
  /** Current page number */
  currentPage: number;
  /** Array of guide sections */
  sections: GuideSection[];
  /** Function to handle going to a specific page */
  onGoToPage: (page: number) => void;
}

/**
 * Renders a dropdown selector for instruction sections
 * 
 * @param props - The component props
 * @returns A React component with section dropdown selector
 */
export const SectionSelector: React.FC<SectionSelectorProps> = ({
  currentPage,
  sections,
  onGoToPage
}) => {
  return (
    <div 
      id="instructions-modal-section-selector"
      data-testid="instructions-modal-section-selector"
      className="px-6 py-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center"
    >
      <div 
        id="instructions-modal-dropdown-container"
        data-testid="instructions-modal-dropdown-container"
        className="relative w-full max-w-xs"
      >
        {/* Dropdown for section selection */}
        <select
          id="instructions-modal-section-select"
          data-testid="instructions-modal-section-select"
          value={currentPage}
          onChange={(e) => onGoToPage(parseInt(e.target.value))}
          className="w-full p-2 pr-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select instruction section"
        >
          {sections.map((section, index) => (
            <option key={index} value={index}>
              {index + 1}. {section.title}
            </option>
          ))}
        </select>
        <div 
          id="instructions-modal-dropdown-icon"
          data-testid="instructions-modal-dropdown-icon"
          className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
