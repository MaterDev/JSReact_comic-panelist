/**
 * CollectionSelector Component
 * 
 * This component displays a dropdown selector for collections with search functionality.
 * 
 * @module CollectionManager/CollectionSelector
 */
import React from 'react';
import { Collection } from '../types';

/**
 * Props for the CollectionSelector component that handles collection selection
 */
interface CollectionSelectorProps {
  collections: Collection[];
  selectedCollection: number | null;
  searchTerm: string;
  isCollectionDropdownOpen: boolean;
  isEditing: boolean;
  setSearchTerm: (term: string) => void;
  setIsCollectionDropdownOpen: (isOpen: boolean) => void;
  handleCollectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * CollectionSelector component displays a dropdown for selecting collections
 * 
 * @param {CollectionSelectorProps} props - The component props
 * @returns {JSX.Element} The rendered CollectionSelector component
 */
const CollectionSelector: React.FC<CollectionSelectorProps> = ({
  collections,
  selectedCollection,
  searchTerm,
  isCollectionDropdownOpen,
  isEditing,
  setSearchTerm,
  setIsCollectionDropdownOpen,
  handleCollectionChange
}) => {
  return (
    <div
      id="collection-manager-selector-container"
      data-testid="collection-manager-selector-container"
      className="mb-4 relative"
    >
      {/* Label */}
      <label
        id="collection-manager-selector-label"
        data-testid="collection-manager-selector-label"
        htmlFor="collection-search"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Select Collection
      </label>

      {/* Collection Selector Button */}
      <div
        id="collection-manager-selector-button"
        data-testid="collection-manager-selector-button"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => !isEditing && setIsCollectionDropdownOpen(!isCollectionDropdownOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isCollectionDropdownOpen}
        aria-label="Select collection"
      >
        {/* Selected Collection Display */}
        <div
          id="collection-manager-selected-collection"
          data-testid="collection-manager-selected-collection"
          className="flex items-center"
        >
          {selectedCollection ?
            // If a collection is selected, show its name
            (
              <>
                <div
                  id="collection-manager-selected-indicator"
                  className="w-3 h-3 rounded-full bg-blue-500 mr-2"
                ></div>
                <span
                  id="collection-manager-selected-name"
                  data-testid="collection-manager-selected-name"
                >
                  {collections.find(c => c.id === selectedCollection)?.name}
                </span>
              </>
            ) :
            // If no collection is selected, show "No-Collection"
            (
              <>
                <div
                  id="collection-manager-no-selection-indicator"
                  className="w-3 h-3 rounded-full bg-amber-500 mr-2"
                ></div>
                <span
                  id="collection-manager-no-selection-text"
                  data-testid="collection-manager-no-selection-text"
                >
                  No-Collection
                </span>
              </>
            )}
        </div>

        {/* Dropdown Icon */}
        <svg
          id="collection-manager-dropdown-icon"
          data-testid="collection-manager-dropdown-icon"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isCollectionDropdownOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isCollectionDropdownOpen && !isEditing && (
        <div
          id="collection-manager-dropdown"
          data-testid="collection-manager-dropdown"
          className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-labelledby="collection-manager-selector-label"
        >
          {/* Search Input */}
          <div
            id="collection-manager-search-container"
            data-testid="collection-manager-search-container"
            className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-dark-700"
          >
            <input
              id="collection-search"
              data-testid="collection-manager-search-input"
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
              onClick={(e) => e.stopPropagation()}
              aria-label="Search collections"
            />
          </div>

          {/* No-Collection Option */}
          <div
            id="collection-manager-no-collection-option"
            data-testid="collection-manager-no-collection-option"
            className={`p-2 hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center ${!selectedCollection ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
            onClick={() => {
              const e = { target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>;
              handleCollectionChange(e);
              setIsCollectionDropdownOpen(false);
            }}
            role="option"
            aria-selected={!selectedCollection}
          >
            {/* No-Collection Indicator, a small circle with an amber background */}
            <div
              id="collection-manager-no-collection-indicator"
              className="w-3 h-3 rounded-full bg-amber-500 mr-2"
            ></div>
            <span
              id="collection-manager-no-collection-label"
              data-testid="collection-manager-no-collection-label"
            >
              No-Collection
            </span>
          </div>

          {/* Collection Options */}
          <div
            id="collection-manager-options-container"
            data-testid="collection-manager-options-container"
            className="max-h-40 overflow-y-auto"
          >
            {/* Filtered Collections based on search term */}
            {collections
              .filter(collection =>
                collection.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(collection => (
                // Each collection option, from filtered list
                <div
                  id={`collection-option-${collection.id}`}
                  data-testid={`collection-option-${collection.id}`}
                  key={collection.id}
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center ${selectedCollection === collection.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  onClick={() => {
                    const e = { target: { value: collection.id.toString() } } as React.ChangeEvent<HTMLSelectElement>;
                    handleCollectionChange(e);
                    setIsCollectionDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={selectedCollection === collection.id}
                >
                  {/* Collection Indicator */}
                  <div
                    id={`collection-indicator-${collection.id}`}
                    className="w-3 h-3 rounded-full bg-blue-500 mr-2"
                  ></div>
                  {/* Collection Name */}
                  <span
                    id={`collection-name-${collection.id}`}
                    data-testid={`collection-name-${collection.id}`}
                  >
                    {collection.name}
                  </span>
                </div>
              ))
            }

            {/* No Results Message */}
            {collections.filter(collection =>
              collection.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
                <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
                  No collections found
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionSelector;
