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
import React, { useState, useEffect } from 'react';
import Header from './Header';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import CollectionSelector from './CollectionSelector';
import CollectionDetails from './CollectionDetails';
import { Collection, Layout } from './types';

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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(initialCollectionId || null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState<boolean>(false);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [layoutsLoading, setLayoutsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layoutsError, setLayoutsError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);


  const API_URL = 'http://localhost:3001/api';

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/collections`);
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
      // Don't automatically select a collection
      if (data.length === 0) {
        setSelectedCollection(null);
      }
    } catch (err) {
      setError('Error loading collections. Please try again later.');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLayouts = async (collectionId: number) => {
    if (!collectionId) return;

    try {
      setLayoutsLoading(true);
      setLayoutsError(null);
      const response = await fetch(`${API_URL}/layouts/collection/${collectionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch layouts');
      }

      const data = await response.json();
      setLayouts(data);

      // Select the first layout if available
      if (data.length > 0 && !selectedLayout) {
        setSelectedLayout(data[0].id);
      } else if (data.length === 0) {
        setSelectedLayout(null);
      }
    } catch (err) {
      setLayoutsError('Error loading layouts. Please try again later.');
      console.error('Error fetching layouts:', err);
    } finally {
      setLayoutsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Update selected collection when initialCollectionId changes
  useEffect(() => {
    if (initialCollectionId !== undefined && initialCollectionId !== null) {
      setSelectedCollection(initialCollectionId);

      // If we have a valid collection ID, fetch its layouts
      if (initialCollectionId > 0) {
        fetchLayouts(initialCollectionId);
      }
    }
  }, [initialCollectionId]);

  // Notify parent component when collections are loaded
  useEffect(() => {
    if (selectedCollection && onCollectionChange && collections.length > 0) {
      const selectedCollectionData = collections.find(c => c.id === selectedCollection) || null;
      onCollectionChange(selectedCollectionData);
    } else if (selectedCollection === null && onCollectionChange) {
      onCollectionChange(null);
    }
  }, [selectedCollection, collections, onCollectionChange]);

  // Fetch layouts when selected collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchLayouts(selectedCollection);
    } else {
      setLayouts([]);
      setSelectedLayout(null);
    }
  }, [selectedCollection]);

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const collectionId = value ? Number(value) : null;
    setSelectedCollection(collectionId);
    setIsEditing(false);
    setSelectedLayout(null); // Reset selected layout when collection changes

    // Notify parent component about collection change
    if (onCollectionChange) {
      const selectedCollectionData = collectionId ? collections.find(c => c.id === collectionId) || null : null;
      onCollectionChange(selectedCollectionData);
    }
  };

  const handleLayoutSelect = (layoutId: number) => {
    setSelectedLayout(layoutId);
  };

  const handleLoadLayout = (layoutId: number) => {
    const layoutToLoad = layouts.find(layout => layout.id === layoutId);
    if (layoutToLoad && onLoadLayout) {
      onLoadLayout(layoutToLoad);
    }
  };

  // Function to create a new page with default panel layout
  const createNewPage = async (collectionId: number) => {
    if (!collectionId) return;

    try {
      setLayoutsLoading(true);

      // Default panel layout with a single full-page panel
      const defaultPanelData = {
        panels: [
          { id: '1', x: 0, y: 0, width: 100, height: 100, number: 1 }
        ]
      };

      // Calculate the next display order
      const nextDisplayOrder = layouts.length > 0
        ? Math.max(...layouts.map(l => l.display_order)) + 1
        : 1;

      const response = await fetch(`${API_URL}/layouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection_id: collectionId,
          name: `Page ${nextDisplayOrder}`,
          panel_data: defaultPanelData,
          page_type: 'standard',

          display_order: nextDisplayOrder
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create new page');
      }

      // Refresh layouts to include the new one
      await fetchLayouts(collectionId);

      setActionMessage({ text: 'New page created successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (error) {
      console.error('Error creating new page:', error);
      setActionMessage({ text: 'Failed to create new page. Please try again.', type: 'error' });
    } finally {
      setLayoutsLoading(false);
    }
  };

  // Function to delete a layout
  const deleteLayout = async (layoutId: number) => {
    if (!layoutId) return;

    try {
      setLayoutsLoading(true);

      const response = await fetch(`${API_URL}/layouts/${layoutId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete page');
      }

      // Refresh layouts after deletion
      if (selectedCollection) {
        await fetchLayouts(selectedCollection);
      }

      setActionMessage({ text: 'Page deleted successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (error: any) {
      console.error('Error deleting page:', error);
      setActionMessage({
        text: `Failed to delete page: ${error.message || 'Please try again.'}`,
        type: 'error'
      });
    } finally {
      setLayoutsLoading(false);
    }
  };

  const startEditing = () => {
    const currentCollection = collections.find(c => c.id === selectedCollection);
    if (currentCollection) {
      setEditName(currentCollection.name);
      setEditDescription(currentCollection.description || '');
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setActionMessage(null);
  };

  const saveCollectionChanges = async () => {
    if (!selectedCollection || !editName.trim()) return;

    try {
      setActionLoading(true);
      const response = await fetch(`${API_URL}/collections/${selectedCollection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update collection');
      }

      await fetchCollections();
      setIsEditing(false);
      setActionMessage({ text: 'Collection updated successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Error updating collection:', err);
      setActionMessage({ text: 'Failed to update collection. Please try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCollection = async () => {
    if (!selectedCollection) return;
    if (!window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`${API_URL}/collections/${selectedCollection}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete collection');
      }

      await fetchCollections();
      setActionMessage({ text: 'Collection deleted successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting collection:', err);
      setActionMessage({ text: 'Failed to delete collection. Please try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const createNewCollection = async () => {
    if (!newName.trim()) return;

    try {
      setActionLoading(true);
      const response = await fetch(`${API_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const result = await response.json();
      await fetchCollections();
      setSelectedCollection(result.id);
      setIsCreating(false);
      setNewName('');
      setNewDescription('');
      setActionMessage({ text: 'New collection created successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Error creating collection:', err);
      setActionMessage({ text: 'Failed to create collection. Please try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      id="collection-manager-container"
      data-testid="collection-manager-container"
      className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-md"
    >
      <Header
        onNewCollection={() => setIsCreating(true)}
        isEditing={isEditing}
        isCreating={isCreating}
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

      {loading ?
        // Loading state
        (
          <p
            id="collection-manager-loading"
            data-testid="collection-manager-loading"
            className="text-gray-600 dark:text-gray-400"
          >
            Loading collections...
          </p>
        ) :
        error ?
          // Error state
          (
            <p
              id="collection-manager-error"
              data-testid="collection-manager-error"
              className="text-red-500"
              role="alert"
            >
              {error}
            </p>
          ) :
          // Normal state
          isCreating ?
            // Create new collection form
            (
              <CreateForm
                newName={newName}
                onNameChange={setNewName}
                newDescription={newDescription}
                onDescriptionChange={setNewDescription}
                onSubmit={createNewCollection}
                onCancel={() => {
                  setIsCreating(false);
                  setNewName('');
                  setNewDescription('');
                }}
                isLoading={actionLoading}
              />
            ) :
            // If there are no collections, show a message
            collections.length === 0 ? (
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
                  collections={collections}
                  selectedCollection={selectedCollection}
                  searchTerm={searchTerm}
                  isCollectionDropdownOpen={isCollectionDropdownOpen}
                  isEditing={isEditing}
                  setSearchTerm={setSearchTerm}
                  setIsCollectionDropdownOpen={setIsCollectionDropdownOpen}
                  handleCollectionChange={handleCollectionChange}
                />

                {selectedCollection !== null && !isEditing ?
                  (
                    // Collection details and layout preview
                    <CollectionDetails
                      collection={collections.find(c => c.id === selectedCollection)}
                      layouts={layouts}
                      selectedLayout={selectedLayout}
                      layoutsLoading={layoutsLoading}
                      layoutsError={layoutsError}
                      actionLoading={actionLoading}
                      onStartEditing={startEditing}
                      onDeleteCollection={deleteCollection}
                      onLayoutSelect={handleLayoutSelect}
                      onLoadLayout={handleLoadLayout}
                      onCreateNewPage={createNewPage}
                      onDeleteLayout={deleteLayout}
                    />
                  ) : selectedCollection && isEditing ?
                    // Edit collection form
                    (
                      <EditForm
                        editName={editName}
                        onNameChange={setEditName}
                        editDescription={editDescription}
                        onDescriptionChange={setEditDescription}
                        onSubmit={saveCollectionChanges}
                        onCancel={cancelEditing}
                        isLoading={actionLoading}
                      />
                    ) : null}
              </div>
            )}
    </div>
  );
};

export default CollectionManager;
