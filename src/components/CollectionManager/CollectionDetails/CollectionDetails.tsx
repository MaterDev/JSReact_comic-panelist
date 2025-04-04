/**
 * CollectionDetails Component
 * 
 * This component displays the details of a selected collection and its layouts.
 * 
 * @module CollectionManager/CollectionDetails
 */
import React from 'react';
import LayoutPreview from '../LayoutPreview';
import { Collection, Layout } from '../types';

/**
 * Props for the CollectionDetails component that displays collection information and layouts
 */
interface CollectionDetailsProps {
  collection: Collection | undefined;
  layouts: Layout[];
  selectedLayout: number | null;
  layoutsLoading: boolean;
  layoutsError: string | null;
  actionLoading: boolean;
  onStartEditing: () => void;
  onDeleteCollection: () => void;
  onLayoutSelect: (layoutId: number) => void;
  onLoadLayout: (layoutId: number) => void;
  onCreateNewPage: (collectionId: number) => Promise<void>;
  onDeleteLayout: (layoutId: number) => Promise<void>;
}

/**
 * CollectionDetails component displays a collection's information and its layouts
 * 
 * @param {CollectionDetailsProps} props - The component props
 * @returns {JSX.Element} The rendered CollectionDetails component
 */
const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  collection,
  layouts,
  selectedLayout,
  layoutsLoading,
  layoutsError,
  actionLoading,
  onStartEditing,
  onDeleteCollection,
  onLayoutSelect,
  onLoadLayout,
  onCreateNewPage,
  onDeleteLayout
}) => {
  return (
    <div 
      id="collection-manager-details"
      data-testid="collection-manager-details"
      className="mt-4"
    >
      {/* Collection header with name and action buttons */}
      <div 
        id="collection-manager-details-header"
        data-testid="collection-manager-details-header"
        className="flex justify-between items-start mb-2"
      >
        <h3 
          id="collection-manager-details-title"
          data-testid="collection-manager-details-title"
          className="text-lg font-semibold text-gray-800 dark:text-gray-200"
        >
          {collection?.name}
        </h3>
        <div 
          id="collection-manager-details-actions"
          data-testid="collection-manager-details-actions"
          className="flex space-x-2"
        >
          {/* Edit button */}
          <button
            id="collection-manager-details-edit-button"
            data-testid="collection-manager-details-edit-button"
            onClick={onStartEditing}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
            aria-label="Edit collection"
          >
            Edit
          </button>
          
          {/* Delete button */}
          <button
            id="collection-manager-details-delete-button"
            data-testid="collection-manager-details-delete-button"
            onClick={onDeleteCollection}
            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
            disabled={actionLoading}
            aria-label="Delete collection"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Collection description */}
      <p 
        id="collection-manager-details-description"
        data-testid="collection-manager-details-description"
        className="text-gray-600 dark:text-gray-400 mb-4"
      >
        {collection?.description || 'No description available.'}
      </p>

      {/* Layout Preview Section */}
      {layoutsLoading ? (
        <div 
          id="collection-manager-layouts-loading"
          data-testid="collection-manager-layouts-loading"
          className="text-center py-4"
        >
          <p className="text-gray-600 dark:text-gray-400">Loading layouts...</p>
        </div>
      ) : layoutsError ? (
        <div 
          id="collection-manager-layouts-error"
          data-testid="collection-manager-layouts-error"
          className="text-center py-4 text-red-500"
        >
          <p>{layoutsError}</p>
        </div>
      ) : (
        <LayoutPreview
          layouts={layouts}
          onLayoutSelect={onLayoutSelect}
          onLoadLayout={onLoadLayout}
          selectedLayoutId={selectedLayout}
          collectionId={collection?.id || 0}
          onCreateNewPage={onCreateNewPage}
          onDeleteLayout={onDeleteLayout}
        />
      )}
    </div>
  );
};

export default CollectionDetails;
