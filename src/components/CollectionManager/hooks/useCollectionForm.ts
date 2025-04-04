/**
 * Collection Form Hook
 * 
 * This hook manages the state and operations for creating and editing collections.
 * It encapsulates form state, validation, and submission logic.
 * 
 * @module hooks/useCollectionForm
 */
import { useState } from 'react';
import { Collection } from '../types';
import { 
  createCollectionCreationHandler
} from '../utils/eventHandlers';
import { updateCollectionApi } from '../utils/apiUtils';

/**
 * Hook for managing collection form state and operations
 * 
 * @param {Collection[]} collections - The list of collections
 * @param {number|null} selectedCollection - The ID of the selected collection
 * @param {Function} setSelectedCollection - State setter for the selected collection
 * @param {Function} fetchCollections - Function to fetch collections
 * @param {Function} setActionMessage - State setter for action messages
 * @returns {Object} Collection form state and operations
 */
export const useCollectionForm = (
  collections: Collection[],
  selectedCollection: number | null,
  setSelectedCollection: (id: number | null) => void,
  fetchCollections: () => Promise<void>,
  setActionMessage: (message: { text: string, type: 'success' | 'error' } | null) => void
) => {
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Create handlers using utility functions
  const handleCreateCollection = createCollectionCreationHandler(
    setActionLoading,
    fetchCollections,
    setSelectedCollection,
    setIsCreating,
    setNewName,
    setNewDescription,
    setActionMessage
  );

  /**
   * Starts editing the currently selected collection
   */
  const startEditing = () => {
    const currentCollection = collections.find(c => c.id === selectedCollection);
    if (currentCollection) {
      setEditName(currentCollection.name);
      setEditDescription(currentCollection.description || '');
      setIsEditing(true);
    }
  };

  /**
   * Cancels the current editing operation
   */
  const cancelEditing = () => {
    setIsEditing(false);
    setActionMessage(null);
  };

  /**
   * Saves changes to the currently edited collection
   */
  const saveCollectionChanges = async () => {
    if (!selectedCollection || !editName.trim()) return;

    try {
      setActionLoading(true);
      await updateCollectionApi(selectedCollection, editName, editDescription);
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

  /**
   * Creates a new collection with the provided name and description
   */
  const createNewCollection = () => {
    if (!newName.trim()) return;
    handleCreateCollection(newName, newDescription);
  };

  /**
   * Starts the collection creation process
   */
  const startCreating = () => {
    setIsCreating(true);
  };

  /**
   * Cancels the collection creation process
   */
  const cancelCreating = () => {
    setIsCreating(false);
    setNewName('');
    setNewDescription('');
  };

  return {
    // Form state
    isEditing,
    isCreating,
    editName,
    editDescription,
    newName,
    newDescription,
    actionLoading,
    
    // State setters
    setEditName,
    setEditDescription,
    setNewName,
    setNewDescription,
    
    // Operations
    startEditing,
    cancelEditing,
    saveCollectionChanges,
    createNewCollection,
    startCreating,
    cancelCreating
  };
};
