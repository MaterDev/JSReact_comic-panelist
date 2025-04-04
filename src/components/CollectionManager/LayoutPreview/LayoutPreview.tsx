/**
 * LayoutPreview Component
 * 
 * This component displays a grid of layout thumbnails for a collection.
 * It allows users to view, select, load, and delete layouts.
 * 
 * @module LayoutPreview
 */
import React, { useState } from 'react';
import LayoutThumbnail from './LayoutThumbnail';

/**
 * Represents a single panel within a comic layout
 */
interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  number: number;
}

/**
 * Represents a comic layout within a collection
 */
interface Layout {
  id: number;
  collection_id: number;
  name: string;
  display_order: number;
  page_type: 'front_cover' | 'back_cover' | 'standard';

  panel_data: {
    panels: Panel[];
  };
  thumbnail_path?: string;
  script_data?: any;
  creative_direction?: any;
  created_at: Date;
  updated_at: Date;
}

/**
 * Props for the LayoutPreview component
 */
interface LayoutPreviewProps {
  layouts: Layout[];
  onLayoutSelect: (layoutId: number) => void;
  onLoadLayout: (layoutId: number) => void;
  selectedLayoutId?: number | null;
  collectionId?: number | null;
  onCreateNewPage?: (collectionId: number) => Promise<void>;
  onDeleteLayout?: (layoutId: number) => Promise<void>;
}

/**
 * LayoutPreview component displays a grid of layout thumbnails for a collection
 * and provides functionality for selecting, loading, and deleting layouts.
 * 
 * @param {LayoutPreviewProps} props - The component props
 * @returns {JSX.Element} The rendered LayoutPreview component
 */
const LayoutPreview: React.FC<LayoutPreviewProps> = ({ layouts, onLayoutSelect, onLoadLayout, selectedLayoutId, collectionId, onCreateNewPage, onDeleteLayout }) => {
  const [layoutToDelete, setLayoutToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sort layouts by display_order
  const sortedLayouts = [...layouts].sort((a, b) => a.display_order - b.display_order);
  
  // Group layouts into categories
  const frontCover = sortedLayouts.find(layout => layout.page_type === 'front_cover');
  const backCover = sortedLayouts.find(layout => layout.page_type === 'back_cover');
  const standardPages = sortedLayouts.filter(layout => layout.page_type === 'standard');
  
  /**
   * Groups standard pages into pairs for side-by-side display
   * 
   * @param {Layout[]} pages - The standard pages to group into pairs
   * @returns {Layout[][]} An array of page pairs
   */
  const groupPagesIntoPairs = (pages: Layout[]): Layout[][] => {
    const pairs: Layout[][] = [];
    
    for (let i = 0; i < pages.length; i += 2) {
      if (i + 1 < pages.length) {
        pairs.push([pages[i], pages[i + 1]]);
      } else {
        // If there's an odd number of pages, the last page is alone
        pairs.push([pages[i]]);
      }
    }
    
    return pairs;
  };
  
  // Group standard pages into pairs for side-by-side display
  const pagePairs = groupPagesIntoPairs(standardPages);
  
  /**
   * Handles creating a new page with default panel layout
   * 
   * @returns {Promise<void>} A promise that resolves when the page is created
   */
  const handleCreateNewPage = async () => {
    if (collectionId && onCreateNewPage) {
      await onCreateNewPage(collectionId);
    }
  };
  
  /**
   * Handles the click event on the delete button for a layout
   * 
   * @param {number} layoutId - The ID of the layout to delete
   * @param {React.MouseEvent} e - The click event
   * @returns {void}
   */
  const handleDeleteClick = (layoutId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setLayoutToDelete(layoutId);
    setShowDeleteConfirm(true);
  };
  
  /**
   * Confirms the deletion of a layout
   * 
   * @returns {Promise<void>} A promise that resolves when the layout is deleted
   */
  const confirmDelete = async () => {
    if (layoutToDelete !== null && onDeleteLayout) {
      await onDeleteLayout(layoutToDelete);
      setShowDeleteConfirm(false);
      setLayoutToDelete(null);
    }
  };
  
  /**
   * Cancels the deletion of a layout
   * 
   * @returns {void}
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setLayoutToDelete(null);
  };
  
  // Function to handle opening the rename modal



  
  return (
    <div 
      id="layout-preview-container" 
      data-testid="layout-preview-container"
      className="mt-4 space-y-4"
    >
      <div 
        id="layout-preview-header" 
        data-testid="layout-preview-header"
        className="flex justify-between items-center mb-2"
      >
        <h3 
          id="layout-preview-title"
          className="text-lg font-semibold text-gray-800 dark:text-gray-200"
        >
          Pages
        </h3>
        {collectionId && onCreateNewPage && (
          <button
            id="layout-preview-add-page-button"
            data-testid="layout-preview-add-page-button"
            onClick={handleCreateNewPage}
            aria-label="Add new page"
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          >
            Add New Page
          </button>
        )}
      </div>
      
      {/* Front Cover */}
      {frontCover && (
        <div 
          id="layout-preview-front-cover-section" 
          data-testid="layout-preview-front-cover-section"
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
        >
          <div 
            id="layout-preview-front-cover-label"
            className="text-xs text-gray-600 dark:text-gray-400 mb-1"
          >
            Cover page
          </div>
          <div 
            id="layout-preview-front-cover-container"
            className="flex justify-center"
          >
            <div 
              id="layout-preview-front-cover-thumbnail-container"
              className="w-1/3"
            >
              <LayoutThumbnail
                layout={frontCover}
                isSelected={selectedLayoutId === frontCover.id}
                onSelect={onLayoutSelect}
                onLoad={onLoadLayout}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Inside Cover and First Page */}
      {pagePairs.length > 0 && (
        <div 
          id="layout-preview-first-pair-section" 
          data-testid="layout-preview-first-pair-section"
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
        >
          <div 
            id="layout-preview-first-pair-container"
            className="flex justify-between gap-4"
          >
            <div 
              id="layout-preview-first-pair-left"
              className="w-1/3 mx-auto"
            >
              <LayoutThumbnail
                layout={pagePairs[0][0]}
                isSelected={selectedLayoutId === pagePairs[0][0].id}
                onSelect={onLayoutSelect}
                onLoad={onLoadLayout}
                onDelete={handleDeleteClick}
              />
            </div>
            {pagePairs[0].length > 1 ? (
              <div 
                id="layout-preview-first-pair-right"
                className="w-1/3 mx-auto"
              >
                <LayoutThumbnail
                  layout={pagePairs[0][1]}
                  isSelected={selectedLayoutId === pagePairs[0][1].id}
                  onSelect={onLayoutSelect}
                  onLoad={onLoadLayout}
                  onDelete={handleDeleteClick}
                />
              </div>
            ) : (
              <div 
                id="layout-preview-first-pair-right-empty"
                className="w-1/3 mx-auto"
              ></div>
            )}
          </div>
        </div>
      )}
      
      {/* Standard Pages (in pairs) */}
      {pagePairs.length > 1 && pagePairs.slice(1).map((pair, index) => (
        <div 
          id={`layout-preview-page-pair-${index + 1}`} 
          data-testid={`layout-preview-page-pair-${index + 1}`}
          key={`pair-${index}`} 
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
        >
          <div 
            id={`layout-preview-page-pair-container-${index + 1}`}
            className="flex justify-between gap-4"
          >
            <div 
              id={`layout-preview-page-pair-left-${index + 1}`}
              className="w-1/3 mx-auto"
            >
              <LayoutThumbnail
                layout={pair[0]}
                isSelected={selectedLayoutId === pair[0].id}
                onSelect={onLayoutSelect}
                onLoad={onLoadLayout}
                onDelete={handleDeleteClick}
              />
            </div>
            {pair.length > 1 ? (
              <div 
                id={`layout-preview-page-pair-right-${index + 1}`}
                className="w-1/3 mx-auto"
              >
                <LayoutThumbnail
                  layout={pair[1]}
                  isSelected={selectedLayoutId === pair[1].id}
                  onSelect={onLayoutSelect}
                  onLoad={onLoadLayout}
                  onDelete={handleDeleteClick}
                />
              </div>
            ) : (
              <div 
                id={`layout-preview-page-pair-right-empty-${index + 1}`}
                className="w-1/3 mx-auto"
              ></div> /* Empty div to maintain layout when there's only one page */
            )}
          </div>
        </div>
      ))}
      

      
      {/* Back Cover */}
      {backCover && (
        <div 
          id="layout-preview-back-cover-section" 
          data-testid="layout-preview-back-cover-section"
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
        >
          <div 
            id="layout-preview-back-cover-label"
            className="text-xs text-gray-600 dark:text-gray-400 mb-1"
          >
            Back cover page
          </div>
          <div 
            id="layout-preview-back-cover-container"
            className="flex justify-center"
          >
            <div 
              id="layout-preview-back-cover-thumbnail-container"
              className="w-1/3"
            >
              <LayoutThumbnail
                layout={backCover}
                isSelected={selectedLayoutId === backCover.id}
                onSelect={onLayoutSelect}
                onLoad={onLoadLayout}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* No layouts message */}
      {sortedLayouts.length === 0 && (
        <div 
          id="layout-preview-empty-state" 
          data-testid="layout-preview-empty-state"
          className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded"
        >
          <p 
            id="layout-preview-empty-state-message"
            className="text-gray-600 dark:text-gray-400"
          >
            No pages in this collection yet.
          </p>
          <p 
            id="layout-preview-empty-state-hint"
            className="text-sm text-gray-500 dark:text-gray-500 mt-1"
          >
            Create a new layout to get started.
          </p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          id="layout-preview-delete-modal-overlay" 
          data-testid="layout-preview-delete-modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div 
            id="layout-preview-delete-modal" 
            data-testid="layout-preview-delete-modal"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h3 
              id="layout-preview-delete-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
            >
              Confirm Delete
            </h3>
            <p 
              id="layout-preview-delete-modal-message"
              className="text-gray-700 dark:text-gray-300 mb-6"
            >
              Are you sure you want to delete this page? This action cannot be undone.
            </p>
            <div 
              id="layout-preview-delete-modal-actions"
              className="flex justify-end space-x-3"
            >
              <button 
                id="layout-preview-delete-modal-cancel-button"
                data-testid="layout-preview-delete-modal-cancel-button"
                aria-label="Cancel delete"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                id="layout-preview-delete-modal-confirm-button"
                data-testid="layout-preview-delete-modal-confirm-button"
                aria-label="Confirm delete"
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutPreview;
