import React, { useCallback } from 'react';
import { Panel } from '../../../../shared/types/panelTypes';
import { ComicPage } from '../../ScriptGenerator';

interface LayoutPanel {
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
  panel_data: {
    panels: LayoutPanel[];
  };
  thumbnail_path?: string;
  script_data?: any;
  creative_direction?: any;
  created_at: Date;
  updated_at: Date;
}

interface Collection {
  id: number;
  name: string;
  description?: string;
}

interface CreativeDirection {
  genre: string;
  emotion: string;
  inspiration: string;
  inspirationText: string;
  exclusions: string;
}

interface LayoutManagerProps {
  currentLayout: Layout | null;
  currentCollection: Collection | null;
  panels: Panel[];
  generatedScript: ComicPage | null;
  creativeDirection: CreativeDirection;
  hasUnsavedChanges: boolean;
  isSavingLayout: boolean;
  onSaveLayout: () => Promise<void>;
  onCloseLayout: () => void;
  onCloseCollection: () => void;
  generateThumbnail: () => Promise<string>;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  currentLayout,
  currentCollection,
  panels,
  generatedScript,
  creativeDirection,
  hasUnsavedChanges,
  isSavingLayout,
  onSaveLayout,
  onCloseLayout,
  onCloseCollection,
  generateThumbnail
}) => {
  const handleSaveLayout = useCallback(async () => {
    await onSaveLayout();
  }, [onSaveLayout]);

  return (
    <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Layout Manager</h2>
        
        {currentLayout && (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveLayout}
              disabled={isSavingLayout}
              className={`px-3 py-1 ${isSavingLayout ? 'bg-gray-400' : hasUnsavedChanges ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded text-sm`}
            >
              {isSavingLayout ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Save'}
            </button>
            <button
              onClick={onCloseLayout}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
            >
              Close Layout
            </button>
          </div>
        )}
      </div>
      
      {currentCollection ? (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200">Collection: {currentCollection.name}</h3>
              {currentCollection.description && (
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">{currentCollection.description}</p>
              )}
            </div>
            <button
              onClick={onCloseCollection}
              className="p-1 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
              title="Close collection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900 rounded-md">
          <p className="text-amber-800 dark:text-amber-200">
            No collection selected. This is a one-off layout.
          </p>
        </div>
      )}
      
      {currentLayout && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-dark-600 rounded-md">
          <h3 className="font-medium">Layout: {currentLayout.name}</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Panels:</span>
              <span className="ml-2 font-medium">{panels.length}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Page Type:</span>
              <span className="ml-2 font-medium capitalize">{currentLayout.page_type.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Has Script:</span>
              <span className="ml-2 font-medium">{generatedScript ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="ml-2 font-medium">{new Date(currentLayout.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
      
      {hasUnsavedChanges && (
        <div className="p-2 mb-3 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded text-sm">
          You have unsaved changes. Don't forget to save your work!
        </div>
      )}
    </div>
  );
};

export default LayoutManager;
