/**
 * LayoutHeader Component
 * 
 * This component renders the top toolbar for the comic creator, including:
 * - Layout name and description
 * - Save/close actions
 * - Collection information
 */
import React from 'react';
import { Collection, Layout } from '../../../../shared/types/layoutTypes';

interface LayoutHeaderProps {
  loadedLayout: Layout | null;
  currentCollection: Collection | null;
  hasUnsavedChanges: boolean;
  isSavingLayout: boolean;
  onSaveLayout: () => void;
  onCloseLayout: () => void;
  onCloseCollection: () => void;
}

/**
 * Renders the header toolbar with layout information and actions
 */
export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  loadedLayout,
  currentCollection,
  hasUnsavedChanges,
  isSavingLayout,
  onSaveLayout,
  onCloseLayout,
  onCloseCollection
}) => {
  return (
    <div 
      id="layout-header"
      data-testid="layout-header"
      className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm"
    >
      <div 
        id="layout-header-info-container"
        data-testid="layout-header-info-container"
        className="flex items-center space-x-4">
        {/* Collection and Layout Info */}
        <div
          id="layout-header-collection-info"
          data-testid="layout-header-collection-info">
          {currentCollection ? (
            <div 
              id="layout-header-collection-details"
              data-testid="layout-header-collection-details"
              className="flex flex-col">
              <div className="flex items-center">
                <span 
                  id="layout-header-collection-label"
                  data-testid="layout-header-collection-label"
                  className="text-sm font-medium text-gray-600">Collection:</span>
                <span 
                  id="layout-header-collection-name"
                  data-testid="layout-header-collection-name"
                  className="ml-2 text-sm font-semibold">{currentCollection.name}</span>
              </div>
              
              {loadedLayout && (
                <div 
                  id="layout-header-layout-name-container"
                  data-testid="layout-header-layout-name-container"
                  className="flex items-center">
                  <span 
                    id="layout-header-layout-label"
                    data-testid="layout-header-layout-label"
                    className="text-sm font-medium text-gray-600">Layout:</span>
                  <span 
                    id="layout-header-layout-name"
                    data-testid="layout-header-layout-name"
                    className="ml-2 text-sm font-semibold">{loadedLayout.name}</span>
                  {hasUnsavedChanges && (
                    <span 
                      id="layout-header-unsaved-indicator"
                      data-testid="layout-header-unsaved-indicator"
                      className="ml-2 text-xs text-amber-600">*</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <span 
              id="layout-header-no-collection"
              data-testid="layout-header-no-collection"
              className="text-sm text-gray-600">No collection loaded</span>
          )}
        </div>
      </div>
      
      <div 
        id="layout-header-actions-container"
        data-testid="layout-header-actions-container"
        className="flex items-center space-x-2">
        {/* Action Buttons */}
        {loadedLayout && (
          <>
            <button
              id="save-layout-button"
              data-testid="save-layout-button"
              onClick={onSaveLayout}
              disabled={isSavingLayout || !hasUnsavedChanges}
              className={`px-3 py-1 text-sm rounded-md ${
                isSavingLayout || !hasUnsavedChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSavingLayout ? 'Saving...' : 'Save Layout'}
            </button>
            
            <button
              id="close-layout-button"
              data-testid="close-layout-button"
              onClick={onCloseLayout}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Close Layout
            </button>
          </>
        )}
        
        {currentCollection && !loadedLayout && (
          <button
            id="close-collection-button"
            data-testid="close-collection-button"
            onClick={onCloseCollection}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close Collection
          </button>
        )}
      </div>
    </div>
  );
};

export default LayoutHeader;
