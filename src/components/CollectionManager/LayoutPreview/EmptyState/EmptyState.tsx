/**
 * EmptyState Component
 * 
 * This component displays a message when there are no layouts in a collection.
 * 
 * @module EmptyState
 */
import React from 'react';

/**
 * EmptyState component displays a message when there are no layouts
 * 
 * @returns {JSX.Element} The rendered EmptyState component
 */
const EmptyState: React.FC = () => {
  return (
    <div 
      id="empty-state-container" 
      data-testid="empty-state-container"
      className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded"
    >
      {/* Main message */}
      <p 
        id="empty-state-message"
        data-testid="empty-state-message"
        className="text-gray-600 dark:text-gray-400"
      >
        No pages in this collection yet.
      </p>
      
      {/* Hint message */}
      <p 
        id="empty-state-hint"
        data-testid="empty-state-hint"
        className="text-sm text-gray-500 dark:text-gray-500 mt-1"
      >
        Create a new layout to get started.
      </p>
    </div>
  );
};

export default EmptyState;
