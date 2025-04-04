import React from 'react';
import { InstructionsModal } from '../../InstructionsModal';
import BreadcrumbNavigation from '../BreadcrumbNavigation';

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

interface HeaderToolbarProps {
  currentCollection: Collection | null;
  loadedLayout: Layout | null;
  hasUnsavedChanges: boolean;
  isSavingLayout: boolean;
  showInstructions: boolean;
  onShowInstructions: (show: boolean) => void;
  onCloseCollection: () => void;
  onSaveLayout: () => void;
  onCloseLayout?: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  currentCollection,
  loadedLayout,
  hasUnsavedChanges,
  isSavingLayout,
  showInstructions,
  onShowInstructions,
  onCloseCollection,
  onSaveLayout,
  onCloseLayout,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex items-center">
      <div className="flex items-center w-1/3">
        <h1 className="text-2xl font-bold">Comic Panel Creator</h1>
        <button
          onClick={() => onShowInstructions(true)}
          className="ml-4 px-3 py-1 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded flex items-center justify-center text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Instructions
        </button>
        {showInstructions && <InstructionsModal onClose={() => onShowInstructions(false)} />}
      </div>

      <BreadcrumbNavigation
        currentCollection={currentCollection}
        loadedLayout={loadedLayout}
        hasUnsavedChanges={hasUnsavedChanges}
        isSavingLayout={isSavingLayout}
        onCloseCollection={onCloseCollection}
        onSaveLayout={onSaveLayout}
        onCloseLayout={onCloseLayout}
      />

      {/* Empty div to balance the layout */}
      <div className="w-1/3"></div>
    </div>
  );
};

export default HeaderToolbar;
