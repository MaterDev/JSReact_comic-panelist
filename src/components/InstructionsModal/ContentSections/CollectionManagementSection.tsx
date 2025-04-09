/**
 * CollectionManagementSection Component
 * 
 * Displays information about collection and page management within the instructions modal.
 * Includes comic book collection organization, page management functions, and comic spread views.
 */
import React from 'react';

/**
 * Renders the collection management section for the instructions modal
 * 
 * @returns A React component with collection management and page management explanations
 */
export const CollectionManagementSection: React.FC = () => {
  return (
    <div
      id="instructions-modal-collections-section"
      data-testid="instructions-modal-collections-section"
      className="space-y-4"
    >
      {/* Comic Book Collections */}
      <div
        id="instructions-modal-comic-collections"
        data-testid="instructions-modal-comic-collections"
      >
        <h4 
          id="instructions-modal-comic-collections-title"
          data-testid="instructions-modal-comic-collections-title"
          className="font-medium mb-2"
        >Comic Book Collections</h4>
        <ul 
          id="instructions-modal-comic-collections-list"
          data-testid="instructions-modal-comic-collections-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li>Create named collections to organize your comic book pages</li>
          <li>Add descriptions to keep track of your projects</li>
          <li>Switch between collections using the dropdown selector</li>
          <li>Edit or delete collections as needed</li>
        </ul>
      </div>
      
      {/* Page Management */}
      <div
        id="instructions-modal-page-management"
        data-testid="instructions-modal-page-management"
      >
        <h4 
          id="instructions-modal-page-management-title"
          data-testid="instructions-modal-page-management-title"
          className="font-medium mb-2"
        >Page Management</h4>
        <ul 
          id="instructions-modal-page-management-list"
          data-testid="instructions-modal-page-management-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li><span className="font-medium">Create Pages:</span> Add new pages to your collection</li>
          <li><span className="font-medium">Delete Pages:</span> Remove pages with confirmation</li>
          <li><span className="font-medium">Load Pages:</span> Open existing pages for editing</li>
          <li><span className="font-medium">Page Types:</span> Designate special pages for covers and back covers</li>
          <li><span className="font-medium">Automatic Ordering:</span> Pages maintain sequential display order</li>
        </ul>
      </div>
      
      {/* Comic Spread View */}
      <div
        id="instructions-modal-comic-spread"
        data-testid="instructions-modal-comic-spread"
      >
        <h4 
          id="instructions-modal-comic-spread-title"
          data-testid="instructions-modal-comic-spread-title"
          className="font-medium mb-2"
        >Comic Spread View</h4>
        <ul 
          id="instructions-modal-comic-spread-list"
          data-testid="instructions-modal-comic-spread-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li>View your pages in a professional comic spread format</li>
          <li>Pages are displayed in pairs as they would appear in a physical book</li>
          <li>Front and back covers are displayed appropriately</li>
          <li>Thumbnails provide quick visual reference to your layouts</li>
        </ul>
      </div>
    </div>
  );
};
