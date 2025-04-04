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
import { Layout } from '../types';
import { 
  categorizeLayouts, 
  groupPagesIntoPairs, 
  sortLayoutsByDisplayOrder,
  createDeleteClickHandler,
  createConfirmDeleteHandler,
  createCancelDeleteHandler
} from './utils';

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

  // Sort layouts and categorize them
  const sortedLayouts = sortLayoutsByDisplayOrder(layouts);
  const { frontCover, backCover, standardPages } = categorizeLayouts(layouts);
  
  // Group standard pages into pairs for side-by-side display
  const pagePairs = groupPagesIntoPairs(standardPages);
  
  // Create event handlers using utility functions
  const handleDeleteClick = createDeleteClickHandler(setLayoutToDelete, setShowDeleteConfirm);
  const confirmDelete = createConfirmDeleteHandler(onDeleteLayout, setShowDeleteConfirm, setLayoutToDelete, layoutToDelete);
  const cancelDelete = createCancelDeleteHandler(setShowDeleteConfirm, setLayoutToDelete);
  
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
