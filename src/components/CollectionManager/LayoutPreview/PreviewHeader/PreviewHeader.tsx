/**
 * PreviewHeader Component
 * 
 * This component displays the header section of the layout preview,
 * including the title and add page button.
 * 
 * @module PreviewHeader
 */
import React from 'react';

/**
 * Props for the PreviewHeader component
 */
interface PreviewHeaderProps {
  collectionId?: number | null;
  onCreateNewPage?: (collectionId: number) => Promise<void>;
}

/**
 * PreviewHeader component displays the header section of the layout preview
 * 
 * @param {PreviewHeaderProps} props - The component props
 * @returns {JSX.Element} The rendered PreviewHeader component
 */
const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  collectionId,
  onCreateNewPage
}) => {
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

  return (
    <div 
      id="preview-header-container" 
      data-testid="preview-header-container"
      className="flex justify-between items-center mb-2"
    >
      {/* Title */}
      <h3 
        id="preview-header-title"
        data-testid="preview-header-title"
        className="text-lg font-semibold text-gray-800 dark:text-gray-200"
      >
        Pages
      </h3>
      
      {/* Add Page Button */}
      {collectionId && onCreateNewPage && (
        <button
          id="preview-header-add-page-button"
          data-testid="preview-header-add-page-button"
          onClick={handleCreateNewPage}
          aria-label="Add new page"
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
        >
          Add New Page
        </button>
      )}
    </div>
  );
};

export default PreviewHeader;
