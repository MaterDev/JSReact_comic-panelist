/**
 * LayoutPreview Component
 * 
 * This component displays a grid of layout thumbnails for a collection.
 * It allows users to view, select, load, and delete layouts.
 * 
 * @module LayoutPreview
 */
import React, { useState } from 'react';
import PreviewHeader from './PreviewHeader';
import CoverSection from './CoverSection';
import PagePairSection from './PagePairSection';
import EmptyState from './EmptyState';
import DeleteConfirmationModal from './DeleteConfirmationModal';

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
      {/* Header */}
      <PreviewHeader
        collectionId={collectionId}
        onCreateNewPage={onCreateNewPage}
      />
      
      {/* Front Cover */}
      {frontCover && (
        <CoverSection
          coverLayout={frontCover}
          selectedLayoutId={selectedLayoutId}
          onLayoutSelect={onLayoutSelect}
          onLoadLayout={onLoadLayout}
          type="front"
        />
      )}
      
      {/* Inside Cover and First Page */}
      {pagePairs.length > 0 && (
        <PagePairSection
          pagePair={pagePairs[0]}
          selectedLayoutId={selectedLayoutId}
          onLayoutSelect={onLayoutSelect}
          onLoadLayout={onLoadLayout}
          onDeleteLayout={handleDeleteClick}
          isFirstPair={true}
        />
      )}
      
      {/* Standard Pages (in pairs) */}
      {pagePairs.length > 1 && pagePairs.slice(1).map((pair, index) => (
        <PagePairSection
          key={`pair-${index}`}
          pagePair={pair}
          selectedLayoutId={selectedLayoutId}
          onLayoutSelect={onLayoutSelect}
          onLoadLayout={onLoadLayout}
          onDeleteLayout={handleDeleteClick}
          pairIndex={index + 1}
        />
      ))}
      
      {/* Back Cover */}
      {backCover && (
        <CoverSection
          coverLayout={backCover}
          selectedLayoutId={selectedLayoutId}
          onLayoutSelect={onLayoutSelect}
          onLoadLayout={onLoadLayout}
          type="back"
        />
      )}
      
      {/* No layouts message */}
      {sortedLayouts.length === 0 && <EmptyState />}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default LayoutPreview;
