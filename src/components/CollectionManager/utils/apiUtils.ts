/**
 * API Utility Functions
 * 
 * This file contains utility functions for API operations related to collections and layouts.
 * 
 * @module apiUtils
 */
import { Collection, Layout } from '../../../../shared/types/layoutTypes';
import { API_URL } from '../../../constants';

/**
 * Fetches all collections from the API
 * 
 * @returns {Promise<Collection[]>} A promise that resolves to an array of collections
 */
export const fetchCollectionsApi = async (): Promise<Collection[]> => {
  const response = await fetch(`${API_URL}/collections`);
  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }
  return await response.json();
};

/**
 * Fetches layouts for a specific collection
 * 
 * @param {number} collectionId - The ID of the collection to fetch layouts for
 * @returns {Promise<Layout[]>} A promise that resolves to an array of layouts
 */
export const fetchLayoutsApi = async (collectionId: number): Promise<Layout[]> => {
  if (!collectionId) {
    throw new Error('Collection ID is required');
  }
  
  const response = await fetch(`${API_URL}/layouts/collection/${collectionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch layouts');
  }
  return await response.json();
};

/**
 * Creates a new collection
 * 
 * @param {string} name - The name of the collection
 * @param {string} description - The description of the collection
 * @returns {Promise<Collection>} A promise that resolves to the created collection
 */
export const createCollectionApi = async (name: string, description?: string): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      description: description?.trim() || undefined,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create collection');
  }
  
  return await response.json();
};

/**
 * Updates an existing collection
 * 
 * @param {number} collectionId - The ID of the collection to update
 * @param {string} name - The updated name of the collection
 * @param {string} description - The updated description of the collection
 * @returns {Promise<Collection>} A promise that resolves to the updated collection
 */
export const updateCollectionApi = async (collectionId: number, name: string, description?: string): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections/${collectionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      description: description?.trim() || undefined,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update collection');
  }
  
  return await response.json();
};

/**
 * Deletes a collection
 * 
 * @param {number} collectionId - The ID of the collection to delete
 * @returns {Promise<void>} A promise that resolves when the collection is deleted
 */
export const deleteCollectionApi = async (collectionId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/collections/${collectionId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete collection');
  }
};

/**
 * Creates a new layout in a collection
 * 
 * @param {number} collectionId - The ID of the collection to create the layout in
 * @returns {Promise<Layout>} A promise that resolves to the created layout
 */
export const createLayoutApi = async (collectionId: number): Promise<Layout> => {
  const response = await fetch(`${API_URL}/layouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection_id: collectionId,
      name: 'New Layout',
      panel_data: { panels: [] },
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create layout');
  }
  
  return await response.json();
};

/**
 * Creates a new page with a default panel layout in a collection
 * 
 * @param {number} collectionId - The ID of the collection to create the page in
 * @param {Layout[]} existingLayouts - The existing layouts in the collection to determine display order
 * @returns {Promise<Layout>} A promise that resolves to the created page
 */
export const createNewPageApi = async (collectionId: number, existingLayouts: Layout[]): Promise<Layout> => {
  // Default panel layout with a single full-page panel
  const defaultPanelData = {
    panels: [
      { id: '1', x: 0, y: 0, width: 100, height: 100, number: 1 }
    ]
  };

  // Calculate the next display order
  const nextDisplayOrder = existingLayouts.length > 0
    ? Math.max(...existingLayouts.map(l => l.display_order)) + 1
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

  return await response.json();
};

/**
 * Deletes a layout
 * 
 * @param {number} layoutId - The ID of the layout to delete
 * @returns {Promise<void>} A promise that resolves when the layout is deleted
 */
export const deleteLayoutApi = async (layoutId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/layouts/${layoutId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete layout');
  }
};

/**
 * Loads a layout by ID
 * 
 * @param {number} layoutId - The ID of the layout to load
 * @returns {Promise<Layout>} A promise that resolves to the loaded layout
 */
export const loadLayoutApi = async (layoutId: number): Promise<Layout> => {
  const response = await fetch(`${API_URL}/layouts/${layoutId}`);
  
  if (!response.ok) {
    throw new Error('Failed to load layout');
  }
  
  return await response.json();
};
