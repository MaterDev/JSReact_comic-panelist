import React from 'react';

interface Collection {
  id: number;
  name: string;
  description?: string;
}

interface Layout {
  id: number;
  name: string;
  collection_id: number;
}

interface BreadcrumbNavigationProps {
  currentCollection: Collection | null;
  loadedLayout: Layout | null;
  hasUnsavedChanges: boolean;
  isSavingLayout: boolean;
  onCloseCollection: () => void;
  onSaveLayout: () => void;
  onCloseLayout?: () => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  currentCollection,
  loadedLayout,
  hasUnsavedChanges,
  isSavingLayout,
  onCloseCollection,
  onSaveLayout,
  onCloseLayout,
}) => {
  return (
    <div className="flex-1 flex justify-center">
      <div className={`flex items-center px-3 py-2 rounded-md ${currentCollection ? 'bg-blue-50 dark:bg-blue-900' : 'bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700'}`}>
        {/* Collection information */}
        {currentCollection ? (
          <div className="flex items-center mr-3 pr-3 border-r border-gray-300 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400 font-medium mr-1">
              Collection:
            </span>
            <span className="text-blue-500 font-medium">
              {currentCollection.name}
            </span>
            <button
              onClick={onCloseCollection}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Close collection and create one-off layout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center mr-3 pr-3 border-r border-amber-300 dark:border-amber-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-amber-800 dark:text-amber-200 font-medium mr-1">
              Collection:
            </span>
            <span className="text-amber-800 dark:text-amber-200 font-bold">
              No-Collection
            </span>
          </div>
        )}
        
        {/* Layout information */}
        {loadedLayout && (
          <>
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400 font-medium mr-1">
                Page:
              </span>
              <span className="text-blue-500 font-medium">
                {loadedLayout.name}
              </span>
            </div>
            
            <div className="flex ml-4">
              <button
                onClick={onSaveLayout}
                disabled={isSavingLayout}
                className={`px-2 py-1 flex items-center ${isSavingLayout ? 'bg-gray-400' : hasUnsavedChanges ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded text-xs mr-2`}
                title={hasUnsavedChanges ? 'You have unsaved changes!' : 'Save changes to this layout'}
              >
                {hasUnsavedChanges && !isSavingLayout && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {isSavingLayout ? 'Saving...' : 'Save'}
              </button>
              {onCloseLayout && (
                <button
                  onClick={onCloseLayout}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Close this layout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;
