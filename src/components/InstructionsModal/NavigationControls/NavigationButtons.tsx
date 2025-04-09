/**
 * Navigation Buttons Component
 * 
 * Renders navigation buttons for moving between instruction pages in the InstructionsModal.
 * Provides previous/next buttons and pagination indicators.
 */
import React from 'react';

/**
 * Props for the NavigationButtons component
 */
interface NavigationButtonsProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Function to handle going to the previous page */
  onPrevious: () => void;
  /** Function to handle going to the next page */
  onNext: () => void;
  /** Function to close the modal */
  onClose: () => void;
}

/**
 * Renders navigation buttons for moving between instruction pages
 * 
 * @param props - The component props
 * @returns A React component with navigation buttons
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onClose
}) => {
  return (
    <div 
      id="instructions-modal-navigation"
      data-testid="instructions-modal-navigation"
      className="flex justify-between mt-6 px-6 py-4 border-t border-gray-200 dark:border-dark-600"
    >
      {/* Previous button */}
      <div>
        {currentPage > 0 && (
          <button
            id="instructions-modal-previous-button"
            data-testid="instructions-modal-previous-button"
            onClick={onPrevious}
            aria-label="Previous page"
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded flex items-center"
          >
            <svg 
              id="instructions-modal-previous-icon"
              data-testid="instructions-modal-previous-icon"
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
        )}
      </div>
      
      {/* Pagination indicator */}
      <div
        id="instructions-modal-pagination-indicator"
        data-testid="instructions-modal-pagination-indicator"
        className="text-sm text-gray-500 dark:text-gray-400 self-center"
      >
        {currentPage + 1} of {totalPages}
      </div>
      
      {/* Next/Complete button */}
      <div>
        {currentPage < totalPages - 1 ? (
          <button
            id="instructions-modal-next-button"
            data-testid="instructions-modal-next-button"
            onClick={onNext}
            aria-label="Next page"
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded flex items-center"
          >
            Next
            <svg 
              id="instructions-modal-next-icon"
              data-testid="instructions-modal-next-icon"
              className="w-4 h-4 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          // Complete button
          <button
            id="instructions-modal-complete-button"
            data-testid="instructions-modal-complete-button"
            onClick={onClose}
            aria-label="Close instructions"
            className="px-4 py-1.5 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded"
          >
            Got it!
          </button>
        )}
      </div>
    </div>
  );
};
