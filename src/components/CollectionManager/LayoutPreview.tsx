import React, { useState } from 'react';

interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  number: number;
}

interface Layout {
  id: number;
  collection_id: number;
  name: string;
  display_order: number;
  page_type: 'front_cover' | 'back_cover' | 'standard';
  is_full_page: boolean;
  panel_data: {
    panels: Panel[];
  };
  thumbnail_path?: string;
  script_data?: any;
  creative_direction?: any;
  created_at: Date;
  updated_at: Date;
}

interface LayoutPreviewProps {
  layouts: Layout[];
  onLayoutSelect: (layoutId: number) => void;
  onLoadLayout: (layoutId: number) => void;
  selectedLayoutId?: number | null;
  collectionId?: number | null;
  onCreateNewPage?: (collectionId: number) => Promise<void>;
  onDeleteLayout?: (layoutId: number) => Promise<void>;
}

const LayoutPreview: React.FC<LayoutPreviewProps> = ({ layouts, onLayoutSelect, onLoadLayout, selectedLayoutId, collectionId, onCreateNewPage, onDeleteLayout }) => {
  const [layoutToDelete, setLayoutToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sort layouts by display_order
  const sortedLayouts = [...layouts].sort((a, b) => a.display_order - b.display_order);
  
  // Group layouts into categories
  const frontCover = sortedLayouts.find(layout => layout.page_type === 'front_cover');
  const backCover = sortedLayouts.find(layout => layout.page_type === 'back_cover');
  const standardPages = sortedLayouts.filter(layout => layout.page_type === 'standard');
  
  // Group standard pages into pairs (for side-by-side display)
  const pagePairs: Layout[][] = [];
  for (let i = 0; i < standardPages.length; i += 2) {
    if (i + 1 < standardPages.length) {
      pagePairs.push([standardPages[i], standardPages[i + 1]]);
    } else {
      // If there's an odd number of pages, the last page is alone
      pagePairs.push([standardPages[i]]);
    }
  }
  
  // Handle creating a new page with default panel layout
  const handleCreateNewPage = async () => {
    if (collectionId && onCreateNewPage) {
      await onCreateNewPage(collectionId);
    }
  };
  
  const handleDeleteClick = (layoutId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setLayoutToDelete(layoutId);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (layoutToDelete !== null && onDeleteLayout) {
      await onDeleteLayout(layoutToDelete);
      setShowDeleteConfirm(false);
      setLayoutToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setLayoutToDelete(null);
  };
  
  // Function to handle opening the rename modal


  // Function to render a single layout thumbnail
  const renderLayoutThumbnail = (layout: Layout, width: string = '100%') => {
    const isSelected = selectedLayoutId === layout.id;
    
    return (
      <div 
        key={layout.id}
        className={`relative ${width} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        {/* Render the layout preview */}
        <div 
          className="bg-white border border-gray-300 aspect-[3/4] relative cursor-pointer group"
          onClick={() => onLayoutSelect(layout.id)}
        >
          {/* If thumbnail exists, use it */}
          {layout.thumbnail_path ? (
            <img 
              src={`http://localhost:3001/thumbnails/${layout.thumbnail_path}`} 
              alt={layout.name}
              className="w-full h-full object-contain"
            />
          ) : (
            /* Otherwise render a simple representation of the panels */
            <div className="w-full h-full relative">
              {layout.panel_data?.panels?.map((panel: Panel) => (
                <div
                  key={panel.id}
                  style={{
                    position: 'absolute',
                    left: `${panel.x}%`,
                    top: `${panel.y}%`,
                    width: `${panel.width}%`,
                    height: `${panel.height}%`,
                    border: '1px solid black',
                    backgroundColor: 'rgba(200, 200, 200, 0.2)',
                  }}
                >
                  <span className="absolute top-1 left-1 text-xs font-bold text-black">{panel.number}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Button overlay - appears on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 opacity-0 group-hover:opacity-100 space-y-2">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                onLoadLayout(layout.id);
              }}
            >
              Load
            </button>
            {layout.page_type === 'standard' && onDeleteLayout && (
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md"
                onClick={(e) => handleDeleteClick(layout.id, e)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        
        {/* Page label */}
        <div className="text-center text-xs mt-1 text-gray-700 dark:text-gray-300 truncate">
          {layout.name}
        </div>
      </div>
    );
  };
  
  return (
    <div className="mt-4 space-y-4">

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Pages
        </h3>
        {collectionId && onCreateNewPage && (
          <button
            onClick={handleCreateNewPage}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          >
            Add New Page
          </button>
        )}
      </div>
      
      {/* Front Cover */}
      {frontCover && (
        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cover page</div>
          <div className="flex justify-center">
            <div className="w-1/3">
              {renderLayoutThumbnail(frontCover)}
            </div>
          </div>
        </div>
      )}
      
      {/* Inside Cover and First Page */}
      {pagePairs.length > 0 && (
        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
          <div className="flex justify-between gap-4">
            <div className="w-1/3 mx-auto">
              {renderLayoutThumbnail(pagePairs[0][0])}
            </div>
            {pagePairs[0].length > 1 ? (
              <div className="w-1/3 mx-auto">
                {renderLayoutThumbnail(pagePairs[0][1])}
              </div>
            ) : (
              <div className="w-1/3 mx-auto"></div>
            )}
          </div>
        </div>
      )}
      
      {/* Standard Pages (in pairs) */}
      {pagePairs.length > 1 && pagePairs.slice(1).map((pair, index) => (
        <div key={`pair-${index}`} className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
          <div className="flex justify-between gap-4">
            <div className="w-1/3 mx-auto">
              {renderLayoutThumbnail(pair[0])}
            </div>
            {pair.length > 1 ? (
              <div className="w-1/3 mx-auto">
                {renderLayoutThumbnail(pair[1])}
              </div>
            ) : (
              <div className="w-1/3 mx-auto"></div> /* Empty div to maintain layout when there's only one page */
            )}
          </div>
        </div>
      ))}
      

      
      {/* Back Cover */}
      {backCover && (
        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Back cover page</div>
          <div className="flex justify-center">
            <div className="w-1/3">
              {renderLayoutThumbnail(backCover)}
            </div>
          </div>
        </div>
      )}
      
      {/* No layouts message */}
      {sortedLayouts.length === 0 && (
        <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-gray-600 dark:text-gray-400">No pages in this collection yet.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Create a new layout to get started.
          </p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete this page? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
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
