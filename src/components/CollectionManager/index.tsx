import React, { useState, useEffect } from 'react';
import LayoutPreview from './LayoutPreview';

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

interface Collection {
  id: number;
  name: string;
  description?: string;
}

interface CollectionManagerProps {
  onLoadLayout?: (layoutData: Layout) => void;
  onCollectionChange?: (collection: Collection | null) => void;
  initialCollectionId?: number | null;
}

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
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);


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
          is_full_page: true,
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
    <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Collection Manager</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          disabled={isEditing || isCreating}
        >
          New Collection
        </button>
      </div>
      
      {actionMessage && (
        <div className={`p-2 mb-3 rounded text-sm ${actionMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {actionMessage.text}
        </div>
      )}
      
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading collections...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : isCreating ? (
        <div className="bg-gray-50 dark:bg-dark-600 p-3 rounded-md border border-gray-200 dark:border-dark-500">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Create New Collection</h3>
          <div className="mb-3">
            <label htmlFor="new-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Collection Name *
            </label>
            <input
              id="new-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
              placeholder="Enter collection name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="new-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
              placeholder="Enter collection description"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsCreating(false);
                setNewName('');
                setNewDescription('');
              }}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              onClick={createNewCollection}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              disabled={!newName.trim() || actionLoading}
            >
              {actionLoading ? 'Creating...' : 'Create Collection'}
            </button>
          </div>
        </div>
      ) : collections.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No collections found. Create your first collection!</p>
      ) : (
        <div>
          <div className="mb-4 relative">
            <label htmlFor="collection-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Collection
            </label>
            
            {/* Collection Selector Button */}
            <div 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => !isEditing && setIsCollectionDropdownOpen(!isCollectionDropdownOpen)}
            >
              <div className="flex items-center">
                {selectedCollection ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>{collections.find(c => c.id === selectedCollection)?.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>No-Collection</span>
                  </>
                )}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isCollectionDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {/* Dropdown Menu */}
            {isCollectionDropdownOpen && !isEditing && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-dark-700">
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                {/* No-Collection Option */}
                <div 
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center ${!selectedCollection ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  onClick={() => {
                    const e = { target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>;
                    handleCollectionChange(e);
                    setIsCollectionDropdownOpen(false);
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>No-Collection</span>
                </div>
                
                {/* Collection Options */}
                <div className="max-h-40 overflow-y-auto">
                  {collections
                    .filter(collection => 
                      collection.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(collection => (
                      <div 
                        key={collection.id} 
                        className={`p-2 hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center ${selectedCollection === collection.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                        onClick={() => {
                          const e = { target: { value: collection.id.toString() } } as React.ChangeEvent<HTMLSelectElement>;
                          handleCollectionChange(e);
                          setIsCollectionDropdownOpen(false);
                        }}
                      >
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>{collection.name}</span>
                      </div>
                    ))
                  }
                  
                  {/* No Results Message */}
                  {collections.filter(collection => 
                    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
                      No collections found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {selectedCollection !== null && !isEditing ? (
            <div className="mt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {collections.find(c => c.id === selectedCollection)?.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={startEditing}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={deleteCollection}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {collections.find(c => c.id === selectedCollection)?.description || 'No description available.'}
              </p>
              

              
              {/* Layout Preview Section */}
              {layoutsLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400">Loading layouts...</p>
                </div>
              ) : layoutsError ? (
                <div className="text-center py-4 text-red-500">
                  <p>{layoutsError}</p>
                </div>
              ) : (
                <LayoutPreview 
                  layouts={layouts} 
                  onLayoutSelect={handleLayoutSelect}
                  onLoadLayout={handleLoadLayout}
                  selectedLayoutId={selectedLayout}
                  collectionId={selectedCollection}
                  onCreateNewPage={createNewPage}
                  onDeleteLayout={deleteLayout}
                />
              )}
            </div>
          ) : selectedCollection && isEditing ? (
            <div className="mt-4 bg-gray-50 dark:bg-dark-600 p-3 rounded-md border border-gray-200 dark:border-dark-500">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Edit Collection</h3>
              <div className="mb-3">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collection Name *
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
                  placeholder="Enter collection name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
                  placeholder="Enter collection description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={saveCollectionChanges}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                  disabled={!editName.trim() || actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
