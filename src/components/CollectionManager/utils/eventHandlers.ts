/**
 * Collection Event Handler Functions
 * 
 * This file contains utility functions for handling collection-related events.
 * 
 * @module eventHandlers
 */
import { Dispatch, SetStateAction } from 'react';
import { Collection, Layout } from '../types';
import { 
  fetchCollectionsApi,
  fetchLayoutsApi, 
  loadLayoutApi, 
  createCollectionApi, 
  updateCollectionApi, 
  deleteCollectionApi,
  deleteLayoutApi,
  createNewPageApi
} from './apiUtils';

/**
 * Creates a handler for collection selection
 * 
 * @param setSelectedCollection - State setter for the selected collection
 * @param setLayouts - State setter for layouts
 * @param setLayoutsLoading - State setter for layouts loading state
 * @param setLayoutsError - State setter for layouts error state
 * @param setSelectedLayout - State setter for the selected layout
 * @param onCollectionChange - Callback for collection changes
 * @returns A function that handles collection selection
 */
export const createCollectionSelectHandler = (
  setSelectedCollection: (id: number | null) => void,
  setLayouts: (layouts: Layout[]) => void,
  setLayoutsLoading: (loading: boolean) => void,
  setLayoutsError: (error: string | null) => void,
  setSelectedLayout: (id: number | null) => void,
  onCollectionChange?: (collection: Collection | null) => void
) => {
  return async (collectionId: number | null, collections: Collection[]) => {
    setSelectedCollection(collectionId);
    
    const selectedCollectionObj = collections.find(c => c.id === collectionId) || null;
    if (onCollectionChange) {
      onCollectionChange(selectedCollectionObj);
    }
    
    if (collectionId === null) {
      setLayouts([]);
      setSelectedLayout(null);
      return;
    }
    
    try {
      setLayoutsLoading(true);
      setLayoutsError(null);
      const layouts = await fetchLayoutsApi(collectionId);
      setLayouts(layouts);
      
      // Select the first layout if available
      if (layouts.length > 0) {
        setSelectedLayout(layouts[0].id);
      } else {
        setSelectedLayout(null);
      }
    } catch (err) {
      setLayoutsError('Error loading layouts. Please try again later.');
      console.error('Error fetching layouts:', err);
    } finally {
      setLayoutsLoading(false);
    }
  };
};

/**
 * Creates a handler for layout selection
 * 
 * @param setSelectedLayout - State setter for the selected layout
 * @returns A function that handles layout selection
 */
export const createLayoutSelectHandler = (
  setSelectedLayout: (id: number | null) => void
) => {
  return (layoutId: number) => {
    setSelectedLayout(layoutId);
  };
};

/**
 * Creates a handler for layout loading
 * 
 * @param onLoadLayout - Callback for loading a layout
 * @returns A function that handles layout loading
 */
export const createLayoutLoadHandler = (
  onLoadLayout?: (layoutData: Layout) => void
) => {
  return async (layoutId: number) => {
    if (!onLoadLayout) return;
    
    try {
      const layoutData = await loadLayoutApi(layoutId);
      onLoadLayout(layoutData);
    } catch (err) {
      console.error('Error loading layout:', err);
    }
  };
};

/**
 * Creates a handler for collection creation
 * 
 * @param setActionLoading - State setter for action loading state
 * @param fetchCollections - Function to fetch collections
 * @param setSelectedCollection - State setter for the selected collection
 * @param setIsCreating - State setter for creation state
 * @param setNewName - State setter for new name
 * @param setNewDescription - State setter for new description
 * @param setActionMessage - State setter for action message
 * @returns A function that handles collection creation
 */
export const createCollectionCreationHandler = (
  setActionLoading: (loading: boolean) => void,
  fetchCollections: () => Promise<void>,
  setSelectedCollection: (id: number | null) => void,
  setIsCreating: (isCreating: boolean) => void,
  setNewName: (name: string) => void,
  setNewDescription: (description: string) => void,
  setActionMessage: (message: { text: string, type: 'success' | 'error' } | null) => void
) => {
  return async (name: string, description: string) => {
    if (!name.trim()) return;

    try {
      setActionLoading(true);
      const result = await createCollectionApi(name, description);
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
};

/**
 * Creates a handler for collection update
 * 
 * @param setActionLoading - State setter for action loading state
 * @param fetchCollections - Function to fetch collections
 * @param setIsEditing - State setter for editing state
 * @param setEditName - State setter for edit name
 * @param setEditDescription - State setter for edit description
 * @param setActionMessage - State setter for action message
 * @returns A function that handles collection update
 */
export const createCollectionUpdateHandler = (
  setActionLoading: (loading: boolean) => void,
  fetchCollections: () => Promise<void>,
  setIsEditing: (isEditing: boolean) => void,
  setEditName: (name: string) => void,
  setEditDescription: (description: string) => void,
  setActionMessage: (message: { text: string, type: 'success' | 'error' } | null) => void
) => {
  return async (collectionId: number, name: string, description: string) => {
    if (!name.trim() || !collectionId) return;

    try {
      setActionLoading(true);
      await updateCollectionApi(collectionId, name, description);
      await fetchCollections();
      setIsEditing(false);
      setEditName('');
      setEditDescription('');
      setActionMessage({ text: 'Collection updated successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Error updating collection:', err);
      setActionMessage({ text: 'Failed to update collection. Please try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };
};

/**
 * Creates a handler for collection deletion
 * 
 * @param setActionLoading - State setter for action loading state
 * @param fetchCollections - Function to fetch collections
 * @param setSelectedCollection - State setter for the selected collection
 * @param setActionMessage - State setter for action message
 * @returns A function that handles collection deletion
 */
export const createCollectionDeleteHandler = (
  setActionLoading: (loading: boolean) => void,
  fetchCollections: () => Promise<void>,
  setSelectedCollection: (id: number | null) => void,
  setActionMessage: (message: { text: string, type: 'success' | 'error' } | null) => void
) => {
  return async (collectionId: number) => {
    if (!collectionId) return;

    try {
      setActionLoading(true);
      await deleteCollectionApi(collectionId);
      await fetchCollections();
      setSelectedCollection(null);
      setActionMessage({ text: 'Collection deleted successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting collection:', err);
      setActionMessage({ text: 'Failed to delete collection. Please try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };
};

/**
 * Creates a handler for layout deletion
 * 
 * @param {Function} setLayoutsLoading - State setter for layouts loading state
 * @param {Function} fetchLayouts - Function to fetch layouts
 * @param {Function} setSelectedLayout - State setter for the selected layout
 * @param {number} selectedCollection - ID of the selected collection
 * @param {Function} setActionMessage - State setter for action message
 * @returns {Function} A function that handles layout deletion
 */
/**
 * Creates a handler for fetching collections
 * 
 * @param setCollections - State setter for collections
 * @param setLoading - State setter for loading state
 * @param setError - State setter for error state
 * @param setSelectedCollection - State setter for selected collection
 * @returns A function that fetches collections
 */
export const createFetchCollectionsHandler = (
  setCollections: Dispatch<SetStateAction<Collection[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setSelectedCollection: Dispatch<SetStateAction<number | null>>
) => {
  return async () => {
    try {
      setLoading(true);
      const data = await fetchCollectionsApi();
      setCollections(data);
      
      // Don't automatically select a collection if there are none
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
};

/**
 * Creates a handler for fetching layouts
 * 
 * @param setLayouts - State setter for layouts
 * @param setLayoutsLoading - State setter for layouts loading state
 * @param setLayoutsError - State setter for layouts error state
 * @param setSelectedLayout - State setter for selected layout
 * @returns A function that fetches layouts for a collection
 */
export const createFetchLayoutsHandler = (
  setLayouts: Dispatch<SetStateAction<Layout[]>>,
  setLayoutsLoading: Dispatch<SetStateAction<boolean>>,
  setLayoutsError: Dispatch<SetStateAction<string | null>>,
  setSelectedLayout: Dispatch<SetStateAction<number | null>>
) => {
  return async (collectionId: number) => {
    if (!collectionId) return;

    try {
      setLayoutsLoading(true);
      setLayoutsError(null);
      const data = await fetchLayoutsApi(collectionId);
      setLayouts(data);

      // Select the first layout if available
      if (data.length > 0) {
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
};

/**
 * Creates a handler for creating a new page
 * 
 * @param setLayoutsLoading - State setter for layouts loading state
 * @param fetchLayouts - Function to fetch layouts
 * @param setActionMessage - State setter for action message
 * @returns A function that handles creating a new page
 */
export const createNewPageHandler = (
  setLayoutsLoading: Dispatch<SetStateAction<boolean>>,
  fetchLayouts: (collectionId: number) => Promise<void>,
  setActionMessage: Dispatch<SetStateAction<{ text: string, type: 'success' | 'error' } | null>>
) => {
  return async (collectionId: number, layouts: Layout[]) => {
    if (!collectionId) return;

    try {
      setLayoutsLoading(true);
      
      await createNewPageApi(collectionId, layouts);
      
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
};

/**
 * Creates a handler for layout deletion
 * 
 * @param setLayoutsLoading - State setter for layouts loading state
 * @param fetchLayouts - Function to fetch layouts
 * @param setSelectedLayout - State setter for the selected layout
 * @param selectedCollection - The ID of the selected collection
 * @param setActionMessage - State setter for action message
 * @returns A function that handles layout deletion
 */
export const createLayoutDeleteHandler = (
  setLayoutsLoading: (loading: boolean) => void,
  fetchLayouts: (collectionId: number) => Promise<void>,
  setSelectedLayout: (id: number | null) => void,
  selectedCollection: number | null,
  setActionMessage: (message: { text: string, type: 'success' | 'error' } | null) => void
) => {
  return async (layoutId: number) => {
    if (!layoutId || !selectedCollection) return;

    try {
      setLayoutsLoading(true);
      await deleteLayoutApi(layoutId);
      await fetchLayouts(selectedCollection);
      setSelectedLayout(null);
      setActionMessage({ text: 'Layout deleted successfully!', type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting layout:', err);
      setActionMessage({ text: 'Failed to delete layout. Please try again.', type: 'error' });
    } finally {
      setLayoutsLoading(false);
    }
  };
};
