/**
 * CollectionManager Component
 * 
 * This component manages collections of comic layouts, allowing users to create, view, edit,
 * and delete collections and their associated layouts.
 * 
 * The component uses a two-panel interface with collections list on the left and layouts grid on the right.
 * It communicates with the parent component through callback props for layout loading and collection changes.
 * 
 * @module CollectionManager
 */
import React, { useState } from 'react';
import Header from './Header';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import CollectionSelector from './CollectionSelector';
import CollectionDetails from './CollectionDetails';
import { Collection, Layout } from './types';

// Import custom hooks
import { useCollections, useLayouts, useCollectionForm } from './hooks';

/**
 * Props for the CollectionManager component
 */
interface CollectionManagerProps {
  onLoadLayout?: (layoutData: Layout) => void;
  onCollectionChange?: (collection: Collection | null) => void;
  initialCollectionId?: number | null;
}

/**
 * CollectionManager component for managing collections and layouts
 * 
 * @param {CollectionManagerProps} props - The component props
 * @returns {JSX.Element} The rendered CollectionManager component
 */
const CollectionManager: React.FC<CollectionManagerProps> = ({ onLoadLayout, onCollectionChange, initialCollectionId }) => {
  // State for action messages
  const [actionMessage, setActionMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // Use custom hooks for collections, layouts, and form management
  const collectionsState = useCollections(initialCollectionId, onCollectionChange, setActionMessage);
  const layoutsState = useLayouts(collectionsState.selectedCollection, onLoadLayout, setActionMessage);
  // Get the setSelectedCollection function from the collectionsState
  // We need to cast it to the expected type since TypeScript doesn't recognize it
  const setSelectedCollection = (collectionsState as any).setSelectedCollection;
  
  const collectionForm = useCollectionForm(
    collectionsState.collections,
    collectionsState.selectedCollection,
    setSelectedCollection,
    collectionsState.fetchCollections,
    setActionMessage
  );

  return (
    <div
      id="collection-manager-container"
      data-testid="collection-manager-container"
      className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-md"
    >
      <Header
        onNewCollection={collectionForm.startCreating}
        isEditing={collectionForm.isEditing}
        isCreating={collectionForm.isCreating}
      />

      {actionMessage && (
        <div
          id="collection-manager-message"
          data-testid="collection-manager-message"
          className={`p-2 mb-3 rounded text-sm ${actionMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
          role="alert"
          aria-live="polite"
        >
          {actionMessage.text}
        </div>
      )}

      {collectionsState.loading ? (
        // Loading state
        <p
          id="collection-manager-loading"
          data-testid="collection-manager-loading"
          className="text-gray-600 dark:text-gray-400"
        >
          Loading collections...
        </p>
      ) : collectionsState.error ? (
        // Error state
        <p
          id="collection-manager-error"
          data-testid="collection-manager-error"
          className="text-red-500"
          role="alert"
        >
          {collectionsState.error}
        </p>
      ) : collectionForm.isCreating ? (
        // Create new collection form
        <CreateForm
          newName={collectionForm.newName}
          newDescription={collectionForm.newDescription}
          onNameChange={(value) => collectionForm.setNewName(value)}
          onDescriptionChange={(value) => collectionForm.setNewDescription(value)}
          onSubmit={collectionForm.createNewCollection}
          onCancel={collectionForm.cancelCreating}
          isLoading={collectionForm.actionLoading}
        />
      ) : collectionsState.collections.length === 0 ? (
        // If there are no collections, show a message
        <p
          id="collection-manager-no-collections"
          data-testid="collection-manager-no-collections"
          className="text-gray-600 dark:text-gray-400"
        >
          No collections found. Create your first collection!
        </p>
      ) : (
        <div id="collection-manager-content" data-testid="collection-manager-content">
          <CollectionSelector
            collections={collectionsState.collections}
            selectedCollection={collectionsState.selectedCollection}
            searchTerm={collectionsState.searchTerm}
            isCollectionDropdownOpen={collectionsState.isCollectionDropdownOpen}
            isEditing={collectionForm.isEditing}
            setSearchTerm={(value) => collectionsState.setSearchTerm(value)}
            setIsCollectionDropdownOpen={(isOpen) => collectionsState.setIsCollectionDropdownOpen(isOpen)}
            handleCollectionChange={collectionsState.handleCollectionChange}
          />

          {collectionsState.selectedCollection && !collectionForm.isEditing ? (
            // Collection details and layout preview
            <CollectionDetails
              collection={collectionsState.collections.find(c => c.id === collectionsState.selectedCollection)}
              layouts={layoutsState.layouts}
              selectedLayout={layoutsState.selectedLayout}
              layoutsLoading={layoutsState.layoutsLoading}
              layoutsError={layoutsState.layoutsError}
              actionLoading={collectionForm.actionLoading}
              onStartEditing={collectionForm.startEditing}
              onDeleteCollection={collectionsState.deleteCollection}
              onLayoutSelect={layoutsState.handleLayoutSelect}
              onLoadLayout={layoutsState.handleLoadLayout}
              onCreateNewPage={layoutsState.createNewPage}
              onDeleteLayout={(layoutId) => Promise.resolve(layoutsState.deleteLayout(layoutId))}
            />
          ) : collectionsState.selectedCollection && collectionForm.isEditing ? (
            // Edit collection form
            <EditForm
              editName={collectionForm.editName}
              editDescription={collectionForm.editDescription}
              onNameChange={(value) => collectionForm.setEditName(value)}
              onDescriptionChange={(value) => collectionForm.setEditDescription(value)}
              onSubmit={collectionForm.saveCollectionChanges}
              onCancel={collectionForm.cancelEditing}
              isLoading={collectionForm.actionLoading}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
