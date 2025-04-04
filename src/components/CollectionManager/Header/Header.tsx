/**
 * CollectionManager Header Component
 * 
 * This component displays the header section of the Collection Manager, including
 * the title and the "New Collection" button.
 * 
 * @module CollectionManager/Header
 */
import React from 'react';

/**
 * Props for the Header component
 */
interface HeaderProps {
  /**
   * Handler for when the "New Collection" button is clicked
   */
  onNewCollection: () => void;
  
  /**
   * Whether the component is in editing mode
   */
  isEditing: boolean;
  
  /**
   * Whether the component is in creating mode
   */
  isCreating: boolean;
}

/**
 * Header component displays the title and "New Collection" button
 * 
 * @param {HeaderProps} props - The component props
 * @returns {JSX.Element} The rendered Header component
 */
const Header: React.FC<HeaderProps> = ({ onNewCollection, isEditing, isCreating }) => {
  return (
    <div 
      id="collection-manager-header" 
      data-testid="collection-manager-header"
      className="flex justify-between items-center mb-4"
    >
      <h2 
        id="collection-manager-title" 
        data-testid="collection-manager-title"
        className="text-xl font-bold text-gray-800 dark:text-gray-200"
      >
        Collection Manager
      </h2>
      <button
        id="collection-manager-new-button"
        data-testid="collection-manager-new-button"
        onClick={onNewCollection}
        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
        disabled={isEditing || isCreating}
        aria-label="Create new collection"
      >
        New Collection
      </button>
    </div>
  );
};

export default Header;
